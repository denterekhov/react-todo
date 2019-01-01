import { MAIN_URL, TOKEN } from './';

export const api = {
    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status === 200) {
            const { 
                data: tasks 
            } = await response.json();
            return tasks;
        }
    },

    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                Authorization:  TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (response.status === 200) {
            const { 
                data: newTask 
            } = await response.json();
            return newTask;
        }
    },

    async updateTask (message) {
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                Authorization:  TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([message]),
        });

        if (response.status === 200) {
            const {
                data: [updatedTask],
            } = await response.json();

            return updatedTask;
        }
    },

    async removeTask (id) {
        await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });
    },

    async completeAllTasks (taskArray) {
        const requests = taskArray.map((task) =>
            fetch(MAIN_URL, {
                method:  'PUT',
                headers: {
                    Authorization:  TOKEN,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([task]),
            })
        );

        const responses = await Promise.all(requests);

        if (responses.some((response) => response.status !== 200)) {
            throw new Error('Task wasn\'t updated');
        }
    },
};
