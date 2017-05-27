import {observable, computed, reaction} from 'mobx';
import TodoModel from '../models/TodoModel'
import TagModel from '../models/TagModel'
import * as Utils from '../utils';


export default class TodoStore {
	@observable todos = [];
	@observable tags = [];

	@computed get activeTodoCount() {
		return this.todos.reduce(
			(sum, todo) => sum + (todo.completed ? 0 : 1),
			0
		)
	}

	@computed get completedCount() {
		return this.todos.length - this.activeTodoCount;
	}


	subscribeServerToStore() {
		console.log("subscribeServerToStore");
		reaction(
			() => this.todoToJS(),
			todos => fetch('/api/todos', {
				method: 'post',
				body: JSON.stringify({ todos }),
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
		);
		
	}
	
	subscribeServerToStore1() {
		reaction(
			() => this.tagToJS(),
			tags => fetch('/api/tags', {
				method: 'post',
				body: JSON.stringify({ tags }),
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
		);
		console.log("subscribeServerToStore1");
	}

	subscribeLocalstorageToStore() {
		reaction(
			() => this.todoToJS(),
			todos => localStorage.setItem('mobx-react-todomvc-todos', JSON.stringify({ todos }))
		);
		console.log("subscribeLocalstorageToStore");
	}

	subscribeLocalstorageToStore1() {
		reaction(
			() => this.tagToJS(),
			tags => localStorage.setItem('mobx-react-todomvc-tags', JSON.stringify({ tags }))
		);
		console.log("subscribeLocalstorageToStore1");
	}

	addTodo (title) {
		this.todos.push(new TodoModel(this, Utils.uuid(), title, false));
	}

	addTags (array) {
		for (var i = 0; i < array.length; i++) { 
			this.tags.push(new TagModel(this, Utils.uuid(), array[i].text));
			console.log("tags:", this.tags);
		}		
	}

	toggleAll (checked) {
		this.todos.forEach(
			todo => todo.completed = checked
		);
	}

	clearCompleted () {
		this.todos = this.todos.filter(
			todo => !todo.completed
		);
	}

	todoToJS() {
		console.log("todotojs");
		return this.todos.map(todo => todo.toJS());
	}

	tagToJS() {
		console.log("tagtojs");
		return this.tags.map(tag => tag.toJS());
	}

	static fromJS(todo, tag) {
		const todoStore = new TodoStore();
		todoStore.todos = todo.map(item => TodoModel.fromJS(todoStore, item));
		todoStore.tags = tag.map(item => TagModel.fromJS(todoStore, item));
		return todoStore;
	}
}
