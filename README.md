# Chalo - Google ADK Agent

"Chalo" (Let's Go!) is a demo agent Application using the Google Agent Development Kit.

## Quick Start

### 1. Run the User Interface (UI)
We have provided a simple script to get you started immediately.

```bash
./run_ui.sh
```
*This will install dependencies (if needed) and start the local development server at `http://localhost:5173`.*

### 2. Run the Backend Agent (Optional)
If you are developing the Python backend:

1.  **Set up the environment**:
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```

2.  **Run the agent**:
    ```bash
    # Ensure you have GOOGLE_API_KEY set in your environment
    export GOOGLE_API_KEY="your-api-key"
    python main.py
    ```

## Project Structure

- `ui/`: React frontend (Vite + Tailwind CSS)
    - `src/components/ChatInterface.jsx`: Main chat logic with "Presentation Mode" and "Timeline View".
    - `public/ai_studio_code.json`: Conversation data (Editable).
- `main.py`: Python entry point for the ADK agent.
