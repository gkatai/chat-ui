(function () {
  let socket;

  // these are the side effects the reducer will work with
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

  const store = createStore(chatUi.logic.chatReducer, sideEffects);

  // attach to this Element
  const rootElement = document.getElementById('app');

  // draw first frame
  chatUi.renderer.view(store, rootElement);

  // rerender on every state change
  store.subscribe(() => chatUi.renderer.view(store, rootElement));

  /**
   * A Redux like store for managing the state
   */
  function createStore(reducer, sideEffects) {
    const listeners = [];
    let state = reducer(undefined, {});

    function getState() {
      return state;
    }

    function dispatch(action) {
      state = reducer(state, action, sideEffects);

      if (!action.doNotListen) {
        listeners.forEach((listener) => listener());
      }
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
})();
