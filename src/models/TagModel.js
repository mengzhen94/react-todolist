import {observable} from 'mobx';

export default class TagModel {
	store;
	id;
	title;

	constructor(store, id, title) {
		this.store = store;
		this.id = id;
		this.title = title;
	}

	destroy() {
		this.store.tags.remove(this);
	}

	toJS() {
		return {
			id: this.id,
			title: this.title
		};
	}

	static fromJS(store, object) {
		return new TagModel(store, object.id, object.title);
	}
}
