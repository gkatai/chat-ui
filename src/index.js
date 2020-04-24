(function () {
  let socket;
  const sideEffects = {
    connect: function () {
      socket = io('http://35.157.80.184:8080/');
      socket.on('message', function (data) {
        store.dispatch({ type: 'MESSAGE_RECEIVED', user: data.user, message: data.message });
      });
    },
    sendMessage: function (user, message) {
      socket.emit('message', { user, message });
    },
  };

  const store = chatUi.logic.createStore(chatUi.logic.chatReducer, sideEffects);

  const rootElement = document.getElementById('app');
  chatUi.renderer.view(store, rootElement);
  store.subscribe(() => chatUi.renderer.view(store, rootElement));
})();
