chatUi.logic = (function logic() {
  // the starting state
  let initialState = {
    connected: false,
    messages: [],
    userName: '',
    currentMessage: '',
    validationMessage: 'Enter username to connect',
  };

  // reducer for chat related logic
  function chatReducer(state = initialState, action, sideEffects) {
    switch (action.type) {
      case 'USER_NAME_ENTERED':
        return userNameEntered(state, sideEffects);
      case 'MESSAGE_BOX_CHANGED':
        return { ...state, currentMessage: action.message };
      case 'NAME_BOX_CHANGED':
        return { ...state, userName: action.name };
      case 'SEND_MESSAGE':
        return sendMessage(state, sideEffects, state.currentMessage);
      case 'SEND_MESSAGE_FROM_ENTER':
        return sendMessage(state, sideEffects, action.message);
      case 'MESSAGE_RECEIVED': {
        const isOwn = state.userName === action.user;
        return { ...state, messages: [...state.messages, { user: action.user, message: action.message, isOwn }] };
      }
      default:
        return state;
    }
  }

  // helper for the user name entered event
  function userNameEntered(state, sideEffects) {
    if (state.connected) {
      return state;
    }

    if (state.userName.length < 3) {
      return { ...state, validationMessage: 'Name must be at least 3 characters long!' };
    }

    if (!/^[a-zA-Z0-9_.-]*$/.test(state.userName)) {
      return { ...state, validationMessage: 'Name can only contain letters, numbers, underscore or hypen!' };
    }

    sideEffects && sideEffects.connect();

    return { ...state, validationMessage: '', connected: true };
  }

  // helper for the send message event
  function sendMessage(state, sideEffects, message) {
    if (!state.connected) {
      return { ...state, currentMessage: '' };
    }

    if (message.trim().length > 0) {
      sideEffects && sideEffects.sendMessage(state.userName, message);
      return { ...state, currentMessage: '', validationMessage: '' };
    }

    return { ...state, validationMessage: 'Enter a message!' };
  }

  return {
    chatReducer,
  };
})();
