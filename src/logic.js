chatUi.logic = (function logic() {
  let initialState = {
    connected: false,
    messages: [],
    userName: '',
    currentMessage: '',
    validationMessage: 'Enter username to connect',
  };

  function chatReducer(state = initialState, action, sideEffects) {
    switch (action.type) {
      case 'USER_NAME_ENTERED': {
        if (state.userName.length < 3) {
          return { ...state, validationMessage: 'Name must be at least 3 characters long!' };
        }

        if (!/^[a-zA-Z0-9_.-]*$/.test(state.userName)) {
          return { ...state, validationMessage: 'Name can only contain letters, numbers, underscore or hypen!' };
        }

        sideEffects.connect();

        return { ...state, validationMessage: undefined, connected: true };
      }
      case 'MESSAGE_BOX_CHANGED':
        return { ...state, currentMessage: action.message };
      case 'NAME_BOX_CHANGED':
        return { ...state, userName: action.name };
      case 'SEND_MESSAGE':
        if (!state.connected) {
          return state;
        }

        if (action.message.trim().length > 0) {
          sideEffects.sendMessage(state.userName, action.message);
          return { ...state, currentMessage: '', validationMessage: '' };
        }

        return { ...state, validationMessage: 'Enter a message!' };
      case 'MESSAGE_RECEIVED': {
        const isOwn = state.userName === action.user;
        return { ...state, messages: [...state.messages, { user: action.user, message: action.message, isOwn }] };
      }
      default:
        return state;
    }
  }

  function createStore(reducer, sideEffects) {
    const listeners = [];
    let state = reducer(undefined, {});

    function getState() {
      return state;
    }

    function dispatch(action) {
      state = reducer(state, action, sideEffects);
      listeners.forEach((listener) => listener());
    }

    function subscribe(listener) {
      listeners.push(listener);
    }

    return {
      getState,
      dispatch,
      subscribe,
    };
  }

  return {
    chatReducer,
    createStore,
  };
})();
