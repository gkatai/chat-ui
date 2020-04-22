chatUi.logic = (function logic() {
  let initialState = {
    connected: false,
    messages: [],
    userName: '',
    currentMessage: '',
    validationMessage: 'Enter username to connect',
  };

  function chatReducer(state = initialState, action) {
    switch (action.type) {
      case 'MESSAGE_RECEIVED': {
        const isOwn = state.userName === action.user;
        return { ...state, messages: [...state.messages, { user: action.user, message: action.message, isOwn }] };
      }
      case 'MESSAGE_BOX_CHANGED':
        return { ...state, currentMessage: action.message };
      case 'NAME_BOX_CHANGED':
        return { ...state, userName: action.name };
      default:
        return state;
    }
  }

  function createStore(reducer) {
    const listeners = [];
    let state = reducer(undefined, {});

    function getState() {
      return state;
    }

    function dispatch(action) {
      state = reducer(state, action);
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
