# AI Communication Board

A proof-of-concept [Augmentative and Alternative Communication (AAC)](https://en.wikipedia.org/wiki/Augmentative_and_alternative_communication) board powered by [Chrome Built-In AI](https://developer.chrome.com/docs/ai/built-in).

This project explores how on-device AI can make AAC more natural and multilingual, enabling real-time and accessible communication across languages.

⚠️ This is an experimental prototype. It is not a production-ready AAC system, but a demonstration of new possibilities for communication technology.

## Why Built-in AI?

- **Speed**: runs locally, so responses feel instant.
- **Privacy**: no cloud server needed, sensitive messages stay on the device.
- **Offline**: works even without internet access.

## Tech Highlights

- React + MUI for the interface
- IndexedDB for offline storage of boards and messages
- SpeechSynthesis API for text-to-speech output
- Chrome Built-in AI APIs for translation, language detection, and grammar rewriting
- Support for [Open Board Format](https://www.openboardformat.org/examples) files
