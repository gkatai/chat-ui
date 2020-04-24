# chat-ui

A simple chat ui. Connect by providing a name (this cannot be changed later). Enter a message and send it with the Enter key or the send button.

## Architecture

The program uses a redux like flow for the state management. Every message goes through the chatReducer, then the whole page rerenders with the new state.
