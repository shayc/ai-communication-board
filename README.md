# AI Communication Board

A proof-of-concept [Augmentative and Alternative Communication (AAC)](https://en.wikipedia.org/wiki/Augmentative_and_alternative_communication) board powered by [Chrome Built-in AI](https://developer.chrome.com/docs/ai/built-in).

This project explores how on-device AI can make AAC more natural and multilingual, enabling real-time and accessible communication across languages.

🚀 **Live demo**: [aiboard.dev](https://aiboard.dev)

## Why Built-in AI?

- **Speed**: Runs on-device for instant responses
- **Privacy**: No cloud server needed, sensitive messages stay on the device
- **Offline**: Works even without internet access

## Tech Highlights

- Chrome Built-in AI APIs for translation, language detection, and grammar rewriting
- SpeechSynthesis API for text-to-speech output
- Support for [Open Board Format](https://www.openboardformat.org/examples) files
- React + MUI for the interface
- IndexedDB for offline storage of boards

## Quick Start

```bash
npm install
npm run dev
```
