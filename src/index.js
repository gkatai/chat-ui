(function () {
  const socket = io('http://35.157.80.184:8080/');

  const store = chatUi.logic.createStore(chatUi.logic.chatReducer);

  socket.on('message', function (data) {
    store.dispatch({ type: 'MESSAGE_RECEIVED', user: data.user, message: data.message });
  });

  const rootElement = document.getElementById('app');
  chatUi.renderer.view(store.getState(), store, rootElement);
  store.subscribe(() => chatUi.renderer.view(store.getState(), store, rootElement));
})();
