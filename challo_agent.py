import asyncio
import os
from typing import Dict, Any, AsyncGenerator
from googlesearch import search
from google import genai

# Set API key if not in environment
if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = "AIzaSyDYnzqyVrwldM3jrBHKOsytV-yGr-Wg9XU"

from google.adk.agents import BaseAgent, LlmAgent, InvocationContext
from google.adk.models import BaseLlm
from google.adk.models import Gemini
from google.adk.tools import ToolContext, FunctionTool
from google.adk.events import Event, EventActions
from google.adk.runners import InMemoryRunner
from google.genai.types import Content, Part
# Decorator workaround
def tool(func):
    return FunctionTool(func)
# These tools update the 'Internal Context' (session.state) directly.

@tool
def web_surfer_tool(query: str, tool_context: ToolContext) -> str:
    """Performs a web search and updates the internal research state."""
    print(f"\n[Tool: Web Surfer] Searching for: {query}")
    
    results = []
    try:
        # Get top 3 search results
        search_results = search(query, num_results=3, advanced=True)
        for res in search_results:
             results.append(f"Title: {res.title}\nDescription: {res.description}\nURL: {res.url}")
    except Exception as e:
        return f"Search failed: {e}"

    result_text = "\n---\n".join(results)
    
    # WRITE to Internal Context
    if "research" not in tool_context.session.state:
        tool_context.session.state["research"] = []
    tool_context.session.state["research"].append(result_text)
    
    return f"Context updated with {len(results)} search results."

@tool
def save_options_tool(options_text: str, tool_context: ToolContext) -> str:
    """Saves the generated options to the internal state. Input must be a string with options separated by newlines."""
    print("\n[Tool: Save Options] Saving options to state...")
    
    # Parse the text into a list (assuming agent sends a formatted string or distinct lines)
    # Simple splitting by newline for this demo
    options_list = [opt.strip() for opt in options_text.split('\n') if opt.strip()]
    
    # WRITE to Internal Context
    tool_context.session.state["options"] = options_list
    
    return "Internal context updated with options."


# --- 2. THE LOOP AGENT (The Logic Gate) ---
# This is a Custom Agent that implements your 3-step logic flow.

class LoopRouterAgent(BaseAgent):
    asker_agent: BaseAgent
    researcher_agent: BaseAgent
    clarifier_agent: BaseAgent

    def __init__(self, asker_agent: BaseAgent, researcher_agent: BaseAgent, clarifier_agent: BaseAgent, name: str = "loop_router"):
        super().__init__(name=name, asker_agent=asker_agent, researcher_agent=researcher_agent, clarifier_agent=clarifier_agent)

    async def _run_async_impl(self, ctx: InvocationContext) -> AsyncGenerator[Event, None]:
        history = ctx.session.events
        state = ctx.session.state
        
        # Ensure state keys exist
        if "research" not in state:
            state["research"] = []
        if "options" not in state:
            state["options"] = []

        # --- LOGIC STEP 1: Research Phase ---
        if not state["research"]:
            print(">> [Router] Step 1: Delegating to Researcher Agent...")
            # Run Researcher to populate state
            # We iterate but don't necessarily yield everything if we want to keep it clean, 
            # but for transparency let's yield.
            async for event in self.researcher_agent.run_async(ctx):
                # Optional: Filter events if you don't want user to see research steps
                yield event
            
            # After research is done, we usually want to immediately inform the user or acknowledge.
            # Let's hand off to Asker immediately to interpret the research.
            print(">> [Router] Research complete. Handing off to Asker...")
            async for event in self.asker_agent.run_async(ctx):
                yield event
            return

        # --- LOGIC STEP 2: Understanding Check ---
        user_understands = state.get("user_understood_fear", False)
        
        if not user_understands:
            print(">> [Router] Step 2: User needs to understand Fear=Desire. Delegating to Asker...")
            ctx.run_config.instruction = (
                "Explain to the user that their fear is actually a sign of desire. "
                "Make them feel better."
            )
            async for event in self.asker_agent.run_async(ctx):
                yield event
            state["user_understood_fear"] = True 
            return

        # --- LOGIC STEP 3: Clarification/Options Phase ---
        user_detached = state.get("user_detached", False)
        
        if not user_detached:
            print(">> [Router] Step 3: Generating Options with Clarifier Agent...")
            
            # Run Clarifier to populate 'options' in state
            async for event in self.clarifier_agent.run_async(ctx):
                yield event
            
            # Now Asker presents these options
            print(">> [Router] Options generated. Handing off to Asker...")
            ctx.run_config.instruction = (
                "Ask the user if they can see the action separately from the emotion. "
                "Present the options: {options}"
            )
            async for event in self.asker_agent.run_async(ctx):
                yield event
            
            state["user_detached"] = True
            return

        # --- END STATE ---
        print(">> [Router] Process Complete.")
        yield Event(
            author=self.name,
            content=Content(parts=[Part(text="Thank you. You seem calm and detached now. The session is complete.")])
        )


# --- 3. MAIN EXECUTION ---

async def main():
    # A. Setup the Model
    # Replace 'gemini-1.5-pro' with your actual model version
    model_client = Gemini(model="gemini-2.5-flash")

    # B. Define the Agents
    
    # 1. Researcher: Has the web_surfer_tool
    researcher = LlmAgent(
        name="Researcher",
        model=model_client,
        instruction="You are a research assistant. Your goal is to search the web for information related to the user's input and save it to the shared state using the web_surfer_tool. Be concise.",
        tools=[web_surfer_tool]
    )

    # 2. Clarifier: Has the save_options_tool
    clarifier = LlmAgent(
        name="Clarifier",
        model=model_client,
        instruction="You are an expert analyst. Your goal is to analyze the conversation history and generate 2 actionable options for the user. Call the save_options_tool to save them.",
        tools=[save_options_tool]
    )

    # 3. Asker: The User Interface (No tools now, purely conversational reading state)
    asker = LlmAgent(
        name="Asker",
        model=model_client,
        instruction=(
            "You are a calm, empathetic assistant. "
            "Research data: {research}. "
            "Options available: {options}. "
            "Use this information to guide the user. Keep your answers short and soothing."
        )
    )

    # C. Define the LOOP Agent
    loop_agent = LoopRouterAgent(asker_agent=asker, researcher_agent=researcher, clarifier_agent=clarifier)

    # D. Run the System
    runner = InMemoryRunner(agent=loop_agent)
    
    # Create session
    session = await runner.session_service.create_session(
        app_name=runner.app_name,
        user_id="user_001"
    )
    session_id = session.id

    print("--- STARTING CHAT SYSTEM (Type 'quit' to exit) ---")
    
    while True:
        try:
            user_text = input("\nUSER: ")
            if user_text.lower() in ("quit", "exit"):
                break
        except EOFError:
            break
        
        # The runner sends the input to the LoopAgent (root), which decides what to do
        async for event in runner.run_async(
            session_id=session_id, 
            user_id="user_001",
            new_message=Content(parts=[Part(text=user_text)])
        ):
            # We only print the final text response to the user
            if event.content and event.author == "Asker":
                print(f"AGENT ({event.author}): {event.content.parts[0].text}")
            elif event.author == "loop_router" and event.content:
                print(f"SYSTEM: {event.content.parts[0].text}")

if __name__ == "__main__":
    asyncio.run(main())