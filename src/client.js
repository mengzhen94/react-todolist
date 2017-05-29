import 'todomvc-common';
import TodoStore from './stores/TodoStore';
import ViewStore from './stores/ViewStore';
import TodoApp from './components/todoApp.js';
import React from 'react';
import ReactDOM from 'react-dom';

const initialState = window.initialState && JSON.parse(window.initialState) || {};

var todoStore = TodoStore.fromJS(initialState.todos || [], initialState.tags || [], initialState.todotags || []);
var viewStore = new ViewStore();

todoStore.subscribeServerToStoreTodo();
todoStore.subscribeServerToStoreTag();
todoStore.subscribeServerToStoreTodoTag();                                                                                                               

ReactDOM.render(
	<TodoApp todoStore={todoStore} viewStore={viewStore}/>,
	document.getElementById('todoapp')
);

if (module.hot) {
  module.hot.accept('./components/todoApp', () => {
    var NewTodoApp = require('./components/todoApp').default;
    ReactDOM.render(
      <NewTodoApp todoStore={todoStore} viewStore={viewStore}/>,
      document.getElementById('todoapp')
    );
  });
}

