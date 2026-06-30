import { projectApi } from "../api/projectApi";

class ProjectService {
    async getAllProjects(params) {
        const res = await projectApi.getAll(params);
        return res.data;   // { success, data, pagination }
    }

    async getProjectById(id) {
        const res = await projectApi.getById(id);
        return res.data;
    }

    async createProject(data) {
        const res = await projectApi.create(data);
        return res.data;
    }

    async updateProject(id, data) {
        const res = await projectApi.update(id, data);
        return res.data;
    }

    async deleteProject(id) {
        const res = await projectApi.delete(id);
        return res.data;
    }

    async updateProjectStatus(id, status) {
        const res = await projectApi.updateStatus(id, status);
        return res.data;
    }
}

export default new ProjectService();