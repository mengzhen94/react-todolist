import {observable, computed, reaction} from 'mobx';
import TodoModel from '../models/TodoModel'
import TagModel from '../models/TagModel'
import TodoTagModel from '../models/TodoTagModel'
import * as Utils from '../utils';


export default class TodoStore {
	@observable todos = [];
	@observable tags = [];
	@observable todotags = [];

	newTodo;

	@computed get activeTodoCount() {
		return this.todos.reduce(
			(sum, todo) => sum + (todo.completed ? 0 : 1),
			0
		)
	}

	@computed get completedCount() {
		return this.todos.length - this.activeTodoCount;
	}


	subscribeServerToStoreTodo() {
		reaction(
			() => this.todoToJS(),
			todos => fetch('/api/todos', {
				method: 'post',
				body: JSON.stringify({ todos }),
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
		);
		
	}
	
	subscribeServerToStoreTag() {
		reaction(
			() => this.tagToJS(),
			tags => fetch('/api/tags', {
				method: 'post',
				body: JSON.stringify({ tags }),
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
		);
	}

	subscribeServerToStoreTodoTag() {
		reaction(
			() => this.todotagToJS(),
			todotags => fetch('/api/todotags', {
				method: 'post',
				body: JSON.stringify({ todotags }),
				headers: new Headers({ 'Content-Type': 'application/json' })
			})
		);
		
	}

	subscribeLocalstorageToStoreTodo() {
		reaction(
			() => this.todoToJS(),
			todos => localStorage.setItem('mobx-react-todomvc-todos', JSON.stringify({ todos }))
		);
	}

	subscribeLocalstorageToStoreTag() {
		reaction(
			() => this.tagToJS(),
			tags => localStorage.setItem('mobx-react-todomvc-tags', JSON.stringify({ tags }))
		);
	}

	subscribeLocalstorageToStoreTodoTag() {
		reaction(
			() => this.todotagToJS(),
			todotags => localStorage.setItem('mobx-react-todomvc-todotags', JSON.stringify({ todotags }))
		);
	}

	addTodo (title) {
		this.newTodo = new TodoModel(this, Utils.uuid(), title, false)
		this.todos.push(this.newTodo);
	}

	addTags (array) {
		for (var i = 0; i < array.length; i++) {
			var saved = false;
			for(var j = 0; j < this.tags.length; j++){
				if(this.tags[j].title == array[i].text) {
					saved = true;
					var newTag = this.tags[j];
				}
			}

			if(!saved){
				var newTag = new TagModel(this, Utils.uuid(), array[i].text);
				this.tags.push(newTag);
			}
			
			var newTodoTag = new TodoTagModel(this, this.newTodo.id, newTag.id);
			this.todotags.push(newTodoTag);
		}		
	}

	addAdditionTags (array, id) {
		for (var i = 0; i < array.length; i++) {
			var saved = false;
			for(var j = 0; j < this.tags.length; j++){
				if(this.tags[j].title == array[i].text) {
					saved = true;
					var newTag = this.tags[j];
				}
			}
			if(!saved){
				var newTag = new TagModel(this, Utils.uuid(), array[i].text);
				this.tags.push(newTag);
			}
			var tagSaved = false;
			this.todotags.forEach(
				todotag => {
					if(todotag.todoId === id && todotag.tagId === newTag.id){
						tagSaved = true;
					}
				}
			)
			if(!tagSaved){
				var newTodoTag = new TodoTagModel(this, id, newTag.id);
				this.todotags.push(newTodoTag);
			}	
		}		
	}

	removeTags(id) {
		var tags = [];
		
		for (var i = this.todotags.length; i--;) {
    		if (this.todotags[i].todoId === id) {
				tags.push(this.todotags[i].tagId);
        		this.todotags[i].destroy();
    		}
		}
		for (var i = tags.length; i--;) {
			var exist = false;
			this.todotags.forEach(
				todotag => {
					if(todotag.tagId === tags[i]){
						exist = true;
					}
				}
			)
			if(exist === false){
				this.tags.forEach(
					tag => {
						if(tag.id == tags[i]){
							tag.destroy();
						}
					}
				)			
			}
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
		return this.todos.map(todo => todo.toJS());
	}

	tagToJS() {
		return this.tags.map(tag => tag.toJS());
	}

	todotagToJS() {
		return this.todotags.map(todotag => todotag.toJS());
	}

	static fromJS(todo, tag, todotags) {
		const todoStore = new TodoStore();
		todoStore.todos = todo.map(item => TodoModel.fromJS(todoStore, item));
		todoStore.tags = tag.map(item => TagModel.fromJS(todoStore, item));
		todoStore.todotags = todotags.map(item => TodoTagModel.fromJS(todoStore, item));
		return todoStore;
	}
}
