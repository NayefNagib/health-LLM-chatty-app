# Health LLM Chatty App

AI-powered healthcare assistant mobile application built with React Native, Expo, FastAPI, Transformers, and QLoRA fine-tuned Large Language Models.

Designed to deliver healthcare-oriented conversational AI through a custom fine-tuned LLM pipeline with real-time mobile interaction.

---

## Features

- Modern mobile chat UI
- Clean responsive design
- Expo Router architecture
- TypeScript support
- TailwindCSS + NativeWind styling
- Reusable component structure
- Cross-platform support (Android / iOS)
- AI-powered healthcare conversations
- FastAPI backend integration
- Real-time conversational interaction
- Modular frontend architecture

---

## Tech Stack

### Frontend
- React Native
- Expo
- TypeScript
- NativeWind
- TailwindCSS
- Expo Router

### Backend Stack
- FastAPI
- Python
- Transformers
- PyTorch
- QLoRA
- PEFT
- Hugging Face

---

## Architecture

Mobile Client → FastAPI Backend → Fine-Tuned Healthcare LLM → AI Response Generation

---

## AI Pipeline

Healthcare Dataset → Data Preprocessing → QLoRA Fine-Tuning → FastAPI Inference Server → Mobile Client Integration

---

## LLM Fine-Tuning

The language model was fine-tuned using:

- QLoRA
- Hugging Face Transformers
- PEFT
- BitsAndBytes Quantization
- Custom Healthcare Conversation Dataset

Training focused on generating healthcare-oriented conversational responses while maintaining lightweight inference performance.

---

## Backend Repository

The backend powering this application is available here:

- Backend API & QLoRA Pipeline:
  https://github.com/NayefNagib/healthcare-llm-qlora

---

## Project Structure

```bash
app/
components/
assets/
services/
hooks/
utils/
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/NayefNagib/health-LLM-chatty-app.git
```

### Navigate Into Project

```bash
cd health-LLM-chatty-app
```

### Install Dependencies

```bash
npm install
```

### Start Expo Development Server

```bash
npx expo start
```

---

## Disclaimer

This project is intended for educational and research purposes only and should not be used as a substitute for professional medical advice.

---

## Author

Ahmed Mohamed Nagib El-Sadany

GitHub:
https://github.com/NayefNagib
