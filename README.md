# Chello - Google ADK Agent

This repository contains a basic Python agent using the Google Agent Development Kit (ADK).

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd chello
    ```

2.  **Create a virtual environment:**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up API Keys:**
    You will likely need a Google Cloud Project and API keys.
    Export them as environment variables:
    ```bash
    export GOOGLE_API_KEY="your_api_key_here"
    export PROJECT_ID="your_project_id"
    ```

## Running the Agent

Run the main script:
```bash
python main.py
```
