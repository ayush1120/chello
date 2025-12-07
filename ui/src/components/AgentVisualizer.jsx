import React from 'react';

import mermaid from 'mermaid';

const AgentVisualizer = () => {
    React.useEffect(() => {
        mermaid.initialize({ startOnLoad: true });
        mermaid.contentLoaded();
    }, []);

    return (
        <div className="h-full flex flex-col bg-transparent">
            <div className="h-16 px-8 flex items-center border-b border-white/20 bg-white/10 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-slate-700">Agent Internals (Live View)</h2>
            </div>

            <div className="flex-1 p-8 overflow-auto flex items-center justify-center relative">
                {/* Background Grid - Darker for visibility on light bg */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>


                <div className="mermaid flex justify-center w-full h-full text-sm font-sans" key="mermaid-diagram">
                    {`graph BT
    %% --- Styles ---
    classDef redAgent fill:#fff,stroke:#ff0000,stroke-width:2px,color:#000;
    classDef blackAgent fill:#fff,stroke:#000,stroke-width:2px,color:#000;
    classDef contextBox fill:#f4faff,stroke:#007bff,stroke-width:2px;
    classDef logicStep fill:#ffeded,stroke:#ff0000,stroke-dasharray: 5 5,color:#333;

    %% --- 1. Global Context Layer (Bottom Blue Box) ---
    subgraph Global_Context [Global Context]
        direction LR
        %% User interacts here
        ChatContext[("<b>CHAT CONTEXT</b><br/>(Conversation History)")]:::contextBox
        
        %% Internal processing happens here
        InternalContext[("<b>INTERNAL CONTEXT</b><br/>(Facts & Research)")]:::contextBox
    end

    %% --- 2. The User ---
    User(("<b>USER</b><br/>(Customer)")):::blackAgent

    %% --- 3. The Agents ---
    %% Asker Agent
    Asker("<b>Asker Agent</b><br/>1. Makes you calm<br/>2. Asks questions/enquiry<br/>3. Relays options"):::blackAgent

    %% Internal Agents
    Clarifier("<b>Clarifier</b><br/>(Internal Processing)<br/>Guided -> Generates options"):::redAgent
    WebSurfer("<b>Web Surfer</b><br/>(Internal Research)"):::redAgent

    %% End Node
    EndNode(("<b>END</b>")):::redAgent

    %% --- 4. The Loop Logic Details ---
    subgraph Loop_Logic [Loop Agent Logic]
        direction TB
        LoopEntry(("<b>Loop<br/>Check</b>")):::redAgent
        
        Step1["<b>1. Check Enquiry</b><br/>Has fear/desire been calculated?"]:::logicStep
        Step2["<b>2. Check Understanding</b><br/>Does user know fear=feel better?"]:::logicStep
        Step3["<b>3. Check Feedback</b><br/>User detached emotion from action?"]:::logicStep
    end

    %% --- 5. Connections ---

    %% User interaction
    User --> ChatContext

    %% --- Asker Flow ---
    ChatContext <--> Asker
    Asker --> EndNode

    %% --- Loop Agent Flow ---
    %% Reads from Chat, processes steps, triggers Asker
    ChatContext --> LoopEntry
    LoopEntry --> Step1
    Step1 --> Step2
    Step2 --> Step3
    Step3 -->|"Checks Passed"| Asker

    %% --- Clarifier Flow (Read Global / Write Internal) ---
    ChatContext -->|"Reads"| Clarifier
    InternalContext -->|"Reads"| Clarifier
    Clarifier -->|"Writes"| InternalContext

    %% --- Web Surfer Flow (Read Global / Write Internal) ---
    ChatContext -->|"Reads"| WebSurfer
    InternalContext -->|"Reads"| WebSurfer
    WebSurfer -->|"Writes"| InternalContext`}
                </div>
            </div>
        </div>
    );
};

export default AgentVisualizer;
