import { transactionApi } from '../api/transactionApi';

class TransactionService {
    async getAllTransactions(params = {}) {
        const res = await transactionApi.getAll(params);
        return res.data;           // Important: Backend returns { success, data, pagination }
    }

    async createTransaction(data) {
        const res = await transactionApi.create(data);
        return res.data;
    }

    async updateTransaction(id, data) {
        const res = await transactionApi.update(id, data);
        return res.data;
    }

    async deleteTransaction(id) {
        const res = await transactionApi.delete(id);
        return res.data;
    }
}

export default new TransactionService();