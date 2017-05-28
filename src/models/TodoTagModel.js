import {observable} from 'mobx';

export default class TodoTagModel {
    store;
	todoId;
    tagId;

	constructor(store, todoId, tagId) {
        this.store = store;
		this.todoId = todoId;
		this.tagId = tagId;
	}

	destroy() {
		this.store.todotags.remove(this);
	}


	toJS() {
		return {
			todoId: this.todoId,
			tagId: this.tagId
		};
	}

	static fromJS(store, object) {
		return new TodoTagModel(store, object.todoId, object.tagId);
	}
}
