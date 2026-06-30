import { taskApi } from '../api/taskApi';

class TaskService {
    async getAllTasks(params) {
        const res = await taskApi.getAll(params);
        return res.data;                    // Backend returns { success, data, pagination }
    }

    async createTask(data) {
        const res = await taskApi.create(data);
        return res.data;
    }

    async updateTask(id, data) {
        const res = await taskApi.update(id, data);
        return res.data;
    }

    async deleteTask(id) {
        const res = await taskApi.delete(id);
        return res.data;
    }
    
    async updateTaskStatus(id, status) {

    const res = await taskApi.updateStatus(id, status);

    return res.data;

}
}

export default new TaskService();