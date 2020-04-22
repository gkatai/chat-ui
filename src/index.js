// eslint-disable-next-line no-undef
const socket = io('http://35.157.80.184:8080/');

let initialState = {
  connected: false,
  messages: [
    {
      isOwn: false,
      user: 'user 1',
      message: 'message 1',
    },
  ],
  userName: 'My name',
  currentMessage: 'current message',
};

const store = createStore(chatReducer);

socket.on('message', function (data) {
  store.dispatch({ type: 'MESSAGE_RECEIVED', user: data.user, message: data.message });
});

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

document.getElementById('name-input').addEventListener('change', (e) => store.dispatch({ type: 'NAME_BOX_CHANGED', name: e.target.value }));

document
  .getElementById('message-input')
  .addEventListener('change', (e) => store.dispatch({ type: 'MESSAGE_BOX_CHANGED', message: e.target.value }));

document.getElementById('send-button').addEventListener('click', () => console.log(store.getState()));

store.subscribe(() => view(store.getState().messages, document.getElementById('messages')));

function view(messages, messagesDiv) {
  messagesDiv.innerHTML = '';
  messages.map((m) => renderMessage(m)).forEach((element) => messagesDiv.appendChild(element));
}

function renderMessage(message) {
  const p = document.createElement('p');

  p.appendChild(document.createTextNode(`${message.user}: ${message.message}`));

  if (message.isOwn) {
    p.className = 'user-message';
  }

  return p;
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
