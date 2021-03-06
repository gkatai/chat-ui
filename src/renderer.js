chatUi.renderer = (function () {
  /**
   * The main render function
   * It redraws the whole ui on every call
   */
  function view(store, root) {
    const state = store.getState();

    root.innerHTML = '';
    [renderMessages(state.messages), renderControlls(state, store)].forEach((element) => root.appendChild(element));

    const messagesContainer = document.getElementsByClassName('messages');

    if (messagesContainer && messagesContainer[0]) {
      messagesContainer[0].scrollTo(0, messagesContainer[0].scrollHeight);
    }

    const messageInput = document.getElementById('message-input');
    messageInput.focus();
  }

  // helper for drawing the controls (inputs and send button)
  function renderControlls(state, store) {
    const container = document.createElement('div');
    container.classList.add('controlls');
    container.appendChild(
      renderInput(
        'name-input',
        'Name: ',
        state.userName,
        (e) => store.dispatch({ type: 'NAME_BOX_CHANGED', name: e.target.value }),
        () => store.dispatch({ type: 'USER_NAME_ENTERED' }),
        keydownHandlerForName,
        state.connected
      )
    );
    const messageInput = renderInput('message-input', 'Message: ', state.currentMessage, undefined, undefined, (e) =>
      keydownHandlerForMessage(e, store)
    );
    messageInput.classList.add('message-input');
    container.appendChild(messageInput);
    const sendButton = renderButton('send-button', 'Send', () => store.dispatch({ type: 'SEND_MESSAGE', message: state.currentMessage }));
    sendButton.classList.add('send-button');
    container.appendChild(sendButton);
    container.appendChild(renderValidationMessage(state.validationMessage));

    return container;

    function keydownHandlerForName(e) {
      if (e.which === 13) {
        e.target.blur();
        return false;
      }

      return true;
    }

    function keydownHandlerForMessage(e, store) {
      store.dispatch({ type: 'MESSAGE_BOX_CHANGED', doNotListen: true, message: e.target.value + e.key });
      if (e.which === 13) {
        store.dispatch({ type: 'SEND_MESSAGE_FROM_ENTER', message: e.target.value });
      }
    }

    // renders an input element
    function renderInput(id, name, value, changeHandler, blurHandler, keydownHandler, disabled = false) {
      const container = document.createElement('span');
      const label = document.createElement('label');
      label.appendChild(document.createTextNode(name));
      container.appendChild(label);
      const input = document.createElement('input');
      input.id = id;
      input.value = value;
      input.onchange = changeHandler;
      input.onkeydown = keydownHandler;
      input.onblur = blurHandler;
      input.disabled = disabled;

      container.appendChild(input);

      return container;
    }

    // renders a button element
    function renderButton(id, name, clickHandler) {
      const button = document.createElement('button');
      button.id = id;
      button.innerHTML = name;
      button.onclick = clickHandler;

      return button;
    }

    // renders a p element with the provided message
    function renderValidationMessage(text) {
      const p = document.createElement('p');

      if (text) {
        p.appendChild(document.createTextNode(text));
        p.className = 'validation-info';
      }

      return p;
    }
  }

  // Helper for drawing the message div element
  function renderMessages(messages) {
    const container = document.createElement('div');
    container.classList = 'messages';

    messages.map((message) => {
      const p = document.createElement('p');

      p.appendChild(document.createTextNode(`${message.user}: ${message.message}`));
      p.classList.add('message');

      if (message.isOwn) {
        p.classList.add('user');
      }

      container.appendChild(p);
    });

    return container;
  }

  return {
    view,
  };
})();
