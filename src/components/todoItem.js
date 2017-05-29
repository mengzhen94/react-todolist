import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import { WithContext as ReactTags } from 'react-tag-input';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

@observer
export default class TodoItem extends React.Component {
	@observable editText = "";

	constructor(props) {
        super(props);

        this.state = {
            tags: [],
			placeholder : "Add Additional Tags"                                                                                                                        
        };
        this.handleAddition = this.handleAddition.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
    }

	handleAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
		console.log("this.state", this.state);
    }

	handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }


	render() {
		const {viewStore, todo, todoStore} = this.props;
		const {tags, placeholder} = this.state;
		return (
			<li className={[
				todo.completed ? "completed": "",
				todo === viewStore.todoBeingEdited ? "editing" : ""
			].join(" ")}>
				<div className="view">
					<input
						className="toggle"
						type="checkbox"
						checked={todo.completed}
						onChange={this.handleToggle}
					/>
					<label onDoubleClick={this.handleEdit}>
						{todo.title}
					</label>
					<button className="destroy" onClick={this.handleDestroy} />
				</div>
				
				<div>
					<input
						ref="editField"
						className="edit"
						value={this.editText}
						onBlur={this.handleSubmit}
						onChange={this.handleChange}
						onKeyDown={this.handleKeyDown}
					/>
					<div className="tag">
						{this.showTags().map(tag =>(<span key={tag.id}>{tag.title}</span>))}
					</div>
					<div className="add-tag-line">
						<div className="addtional-tag">
							<ReactTags tags={tags}
							placeholder={placeholder}
                			handleAddition={this.handleAddition}
							handleDelete={this.handleDelete}
							/>
						</div>
						<button className="addTag" onClick={this.addTag} />
					</div>
				</div>
			</li>
		);
	}

	showTags = () => {
		var id = this.props.todo.id;
		var todotags = this.props.todoStore.todotags;
		var tags = this.props.todoStore.tags;
		var thisTag = [];
		for(var i = 0; i < todotags.length; i++){
			if(todotags[i].todoId === id){
				for(var j = 0; j < tags.length; j++){
					if(tags[j].id === todotags[i].tagId){
						thisTag.push(tags[j]);
					}
				}
			}
		}
		return thisTag;
	}

	addTag = () => {
		var tags = this.state.tags;
		if(tags) {
			this.props.todoStore.addAdditionTags(tags, this.props.todo.id);
		}
		this.state.tags = [];
	}

	handleSubmit = (event) => {
		const val = this.editText.trim();
		if (val) {
			this.props.todo.setTitle(val);
			this.editText = val;
		} else {
			this.handleDestroy();
		}
		this.props.viewStore.todoBeingEdited = null;
	};

	handleDestroy = () => {
		this.props.todoStore.removeTags(this.props.todo.id);
		this.props.todo.destroy();
		this.props.viewStore.todoBeingEdited = null;
	};

	handleEdit = () => {
		const todo = this.props.todo;
		this.props.viewStore.todoBeingEdited = todo;
		this.editText = todo.title;
	};

	handleKeyDown = (event) => {
		if (event.which === ESCAPE_KEY) {
			this.editText = this.props.todo.title;
			this.props.viewStore.todoBeingEdited = null;
		} else if (event.which === ENTER_KEY) {
			this.handleSubmit(event);
		}
	};

	handleChange = (event) => {
		this.editText = event.target.value;
	};

	handleToggle = () => {
		this.props.todo.toggle();
	};
}

TodoItem.propTypes = {
	todo: PropTypes.object.isRequired,
	viewStore: PropTypes.object.isRequired
};
