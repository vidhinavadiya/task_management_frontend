import { targetApi } from '../api/targetApi';

class TargetService {
    async createTarget(data) {
        const res = await targetApi.create(data);
        return res.data;
    }

    async getTargets() {
        const res = await targetApi.getAll();
        return res.data;
    }
}

export default new TargetService();