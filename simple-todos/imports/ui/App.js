import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';


// App component - represents the whole app
class App extends Component {

    state = {
        hideCompleted: false,
        taskBody: '',
    };

    handleSubmit = (event) => {
        event.preventDefault();

        // Find the text field via the React ref
        const text = this.state.taskBody.trim();


        Meteor.call('tasks.insert', text);

        Tasks.insert({
            text,
            createdAt: new Date(), // current time
            owner: Meteor.userId(),           // _id of logged in user
            username: Meteor.user().username,  // username of logged in user
        });

        // Clear form
        // ReactDOM.findDOMNode(this.refs.textInput).value = '';
        this.setState({taskBody: ''})
    };

    renderTasks = () => (
        this.props.tasks
            .filter(task => this.state.hideCompleted ? !task.checked : true)
            .map((task) => (
                <Task
                    key={`task_${task._id}`}
                    task={task}
                    showPrivateButton={task.owner === (this.props.currentUser && this.props.currentUser._id)}
                />
            ))
    );

    toggleHideCompleted() {
        this.setState((prevState) => ({
            hideCompleted: !prevState.hideCompleted
        }));
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Todo List ({this.props.incompleteCount})</h1>

                    <label className="hide-completed">
                        <input
                            type="checkbox"
                            readOnly
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted.bind(this)}
                        />
                        Hide Completed Tasks
                    </label>

                    <AccountsUIWrapper />

                    {
                        this.props.currentUser &&
                        <form
                            className="new-task"
                            onSubmit={this.handleSubmit}
                        >
                            <input
                                type="text"
                                placeholder="Type to add new tasks"
                                value={this.state.taskBody}
                                onChange={({target: {value: taskBody}}) => this.setState({taskBody})}
                            />
                        </form>
                    }
                </header>

                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('tasks');
    return {
        // tasks: Tasks.find({}).fetch(),
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
    };
})(App);