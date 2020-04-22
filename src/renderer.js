chatUi.renderer = (function () {
  function view(state, store, root) {
    root.innerHTML = '';
    [
      ...state.messages.map((m) => renderMessage(m)),
      renderInput('name-input', 'Name: ', state.userName, (e) => store.dispatch({ type: 'NAME_BOX_CHANGED', name: e.target.value })),
      renderInput('message-input', 'Message: ', state.currentMessage, (e) =>
        store.dispatch({ type: 'MESSAGE_BOX_CHANGED', message: e.target.value })
      ),
      renderButton('send-button', 'Send', () => console.log(store.getState())),
      renderValidationMessage(state.validationMessage),
    ].forEach((element) => root.appendChild(element));
  }

  function renderInput(id, name, value, changeHandler) {
    const container = document.createElement('span');
    const label = document.createElement('label');
    label.appendChild(document.createTextNode(name));
    container.appendChild(label);
    const input = document.createElement('input');
    input.id = id;
    input.value = value;
    input.onchange = changeHandler;
    container.appendChild(input);

    return container;
  }

  function renderButton(id, name, clickHandler) {
    const button = document.createElement('button');
    button.id = id;
    button.innerHTML = name;
    button.onclick = clickHandler;

    return button;
  }

  function renderValidationMessage(text) {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(text));
    p.className = 'validation-info';

    return p;
  }

  function renderMessage(message) {
    const p = document.createElement('p');

    p.appendChild(document.createTextNode(`${message.user}: ${message.message}`));

    if (message.isOwn) {
      p.className = 'user-message';
    }

    return p;
  }

  return {
    view,
  };
})();