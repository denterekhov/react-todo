// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from '../../theme/assets/Checkbox';
import { sortTasksByGroup, BaseTaskModel } from '../../instruments';
import FlipMove from 'react-flip-move';

//Components
import Task from '../Task';
import Spinner from '../Spinner';

export default class Scheduler extends Component {
    state = {
        newTaskMessage:  '',
        tasks:           [],
        tasksFilter:     '',
        isTasksFetching: false,
    };

    componentDidMount() {
        this._fetchTasksAsync();
    }

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);
        const tasks = await api.fetchTasks();

        this.setState({
            tasks: sortTasksByGroup(tasks),
        });
        this._setTasksFetchingState(false);
    };

    _setTasksFetchingState = (isTasksFetching) => {
        this.setState({
            isTasksFetching,
        });
    };

    _createTaskAsync = async (e) => {
        const { newTaskMessage } = this.state;

        e.preventDefault();
        if (!newTaskMessage.trim()) {
            return null;
        }
        this._setTasksFetchingState(true);
        const newTask = await api.createTask(newTaskMessage.trim());

        this.setState((prevState) => ({
            tasks:          sortTasksByGroup([newTask, ...prevState.tasks]),
            newTaskMessage: '',
        }));
        this._setTasksFetchingState(false);
    };

    _updateTasksFilter = (e) => {
        this.setState({
            tasksFilter: e.target.value.toLocaleLowerCase(),
        });
    };

    _updateNewTaskMessage = (e) => {
        this.setState({
            newTaskMessage: e.target.value,
        });
    };

    _updateTaskAsync = async (updatingTask) => {
        const { tasks } = this.state;

        this._setTasksFetchingState(true);
        const updatedTask = await api.updateTask(updatingTask);
        const updatedTasks = tasks.map((task) => {
            return task.id === updatedTask.id ? updatedTask : task;
        });

        this.setState({
            tasks: sortTasksByGroup(updatedTasks),
        });
        this._setTasksFetchingState(false);
    };

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);
        await api.removeTask(id);
        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id !== id),
        }));
        this._setTasksFetchingState(false);
    };

    _completeAllTasksAsync = async () => {
        const { tasks } = this.state;

        const incompletedTasksToCompleted = tasks
            .filter((task) => !task.completed)
            .map((task) => {
                task.completed = true;
                return task;
            });

        if (!incompletedTasksToCompleted.length) {
            return null;
        }
        this._setTasksFetchingState(true);
        await api.completeAllTasks(incompletedTasksToCompleted);

        this.setState(({ tasks }) => {
            tasks.map((task) => {
                task.completed = true;
                return task;
            });
        });
        this._setTasksFetchingState(false);
    };

    _getAllCompleted = () => {
        const { tasks } = this.state;

        return tasks.every((task) => task.completed);
    };

    _filterTasks = () => {
        const { tasks, tasksFilter } = this.state;
        
        return tasks.filter((task) =>
            task.message.toLocaleLowerCase().includes(tasksFilter)
        );
    };

    render () {
        const {
            newTaskMessage,
            tasks,
            tasksFilter,
            isTasksFetching,
        } = this.state;
        const filteredTasks = tasksFilter ? this._filterTasks() : tasks;
        const areTasksCompleted = tasks.length && this._getAllCompleted();
        const tasksJSX = filteredTasks.map((task) => (
            <Task
                key = { task.id }
                { ...task }
                _updateTaskAsync = { this._updateTaskAsync }
                _removeTaskAsync = { this._removeTaskAsync }
            />
        ));

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            onChange = { this._updateTasksFilter }
                            type = 'search'
                            placeholder = 'Поиск'
                            value = { tasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = { Styles.createTask }
                                onChange = { this._updateNewTaskMessage }
                                type = 'text'
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                value = { newTaskMessage }
                            />
                            <button>
                                Добавить задачу
                            </button>
                        </form>
                        <div  className = { Styles.overlay }>
                            <ul>
                                <FlipMove duration = { 400 }>
                                    {tasksJSX}
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            onClick = { this._completeAllTasksAsync }
                            color1 = '#363636'
                            color2 = '#fff'
                            checked = { areTasksCompleted }
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
