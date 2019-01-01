// Core
import React, { PureComponent, createRef } from 'react';
import cx from 'classnames';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {
    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    state = {
        isTaskEditing: false,
        newMessage:    this.props.message,
    };

    taskInput = createRef();

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _setTaskEditingState = (isTaskEditing) => {
        this.setState({
            isTaskEditing,
        });
        this.taskInput.current.disabled = !isTaskEditing;
        if (isTaskEditing) {
            this.taskInput.current.focus();
        }
    };

    _updateTask = () => {
        const { newMessage } = this.state;
        const { _updateTaskAsync, message } = this.props;

        if (newMessage.trim() === message) {
            this._setTaskEditingState(false);
            return null;
        }
        _updateTaskAsync(this._getTaskShape({ message: newMessage }));
        this._setTaskEditingState(false);
    };

    _updateNewTaskMessage = (e) => {
        this.setState({
            newMessage: e.target.value,
        });
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;

        _updateTaskAsync(this._getTaskShape({ completed: !completed }));
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;
        _updateTaskAsync(this._getTaskShape({ favorite: !favorite }));
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing, newMessage } = this.state;

        if (isTaskEditing && newMessage.trim()) {
            this._updateTask();
            return null;
        }
        this._setTaskEditingState(true);
    };

    _cancelUpdatingTaskMessage = () => {
        this._setTaskEditingState(false);
        this.setState({
            newMessage: this.props.message,
        });
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;

        const enterKey = event.key === 'Enter';
        const escKey = event.key === 'Escape';

        if (!newMessage.trim()) {
            return null;
        }
        if (enterKey) {
            this._updateTask();
        }
        if (escKey) {
            this._cancelUpdatingTaskMessage();
        }
    };

    render () {
        const { isTaskEditing, newMessage } = this.state;
        const { completed, favorite } = this.props;
        const taskStyle = cx(Styles.task, {
            [Styles.completed]: completed,
        });

        return (
            <li className = { taskStyle }>
                <div className = { Styles.content }>
                    <Checkbox
                        onClick = { this._toggleTaskCompletedState }
                        className = { Styles.toggleTaskCompletedState }
                        checked = { completed }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        inlineBlock
                    />
                    <input
                        ref = { this.taskInput }
                        type = 'text'
                        maxLength = { 50 }
                        value = { newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                        disabled
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        onClick = { this._toggleTaskFavoriteState }
                        className = { Styles.toggleTaskFavoriteState }
                        checked = { favorite }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                    />
                    <Edit
                        onClick = { this._updateTaskMessageOnClick }
                        className = { Styles.updateTaskMessageOnClick }
                        checked = { isTaskEditing }
                        width = { 19 }
                        height = { 19 }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                    />
                    <Remove
                        onClick = { this._removeTask }
                        className = { Styles.removeTask }
                        width = { 17 }
                        height = { 17 }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                    />
                </div>
            </li>
        );
    }
}
