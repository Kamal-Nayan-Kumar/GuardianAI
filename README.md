# Real-Time Cyberbullying Detection API

This project is a real-time, privacy-first API designed to detect cyberbullying in chat conversations. It uses a fine-tuned RoBERTa model that runs on a local server, ensuring that no message content ever leaves the user's device.

## Features

- **High Accuracy**: Achieves over 90% F1-score in detecting toxic and bullying language.
- **Real-Time Analysis**: Analyzes messages as they are sent to provide immediate feedback.
- **Privacy-First**: All model inference happens locally. Only anonymized alerts are sent out.
- **Stateful Logic**: Detects patterns of harassment over a series of messages, not just single instances.

## Model and Dataset

- **Model**: The fine-tuned model is available on the Hugging Face Hub: [nayan90k/roberta-finetuned-cyberbullying-detection](https://huggingface.co/nayan90k/roberta-finetuned-cyberbullying-detection)
- **Dataset**: The balanced, cleaned dataset used for training is available here: [nayan90k/cyberbullying-tweets-balanced](https://huggingface.co/datasets/nayan90k/cyberbullying-tweets-balanced)

## Architecture

The system consists of three main components:
1.  **FastAPI Backend** (`app.py`): A Python server that loads the model and exposes an API endpoint for analysis.
2.  **Chat Frontend**: A web-based chat application that sends messages to the local backend.
3.  **Parent Dashboard**: A separate application that receives alerts when a bullying pattern is detected.

For deployment, the frontend and backend are designed to be packaged together in an **Electron** desktop application.

## How to Run Locally

1.  **Clone the repository:**
    ```
    git clone https://github.com/Kamal-Nayan-Kumar/GuardianAI.git
    cd GuardianAI/model
    ```

2.  **Install dependencies:**
    ```
    pip install -r requirements.txt
    ```

3.  **Run the server:**
    ```
    uvicorn app:app --reload
    ```

4.  The API will be available at `http://127.0.0.1:8000`.


