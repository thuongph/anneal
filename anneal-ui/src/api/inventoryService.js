import { Api } from './api';
import { baseUrl } from './config'


export class InventoryService {
    constructor(accessToken, endpoint) {
        this.inventoryApi = new Api({baseUrl: baseUrl}).setHeader('Content-Type', 'application/json').setHeader('Authorization', `Bearer ${accessToken}`)
        this._endpoint = endpoint;
    }

    getInventories = async () => {
        const inventories = await this.inventoryApi.get(this._endpoint);
        return inventories;
    }
    
    createInventory = async (inventory) => {
        const res = await this.inventoryApi.post(this._endpoint, inventory);
        return res;
    }
    
    deleteInventory = async (inventoryId) => {
        const res = await this.inventoryApi.delete(`${this._endpoint}/${inventoryId}`);
        return res;
    }
}