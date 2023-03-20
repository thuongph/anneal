import { Api } from './api';
import { baseUrl } from './config'

const inventory_endpoint = '/inventory'
const api = new Api({baseUrl: baseUrl})

export const getInventories = async () => {
    const inventories = await api.get(inventory_endpoint);
    return inventories;
}

export const getInventoryById = async (inventoryId) => {
    const inventory = await api.get(`${inventory_endpoint}/${inventoryId}`);
    return inventory;
}

export const createInventory = async (inventory) => {
    const res = await api.post(inventory_endpoint, inventory);
    return res;
}

export const updateInventory = async (inventory) => {
    const updatedHost = await api.put(`${inventory_endpoint}/${inventory.id}`, inventory);
    return updatedHost;
}

export const deleteInventory = async (inventoryId) => {
    const res = await api.delete(`${inventory_endpoint}/${inventoryId}`);
    return res;
}