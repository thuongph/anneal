import { Api } from './api';
import { baseUrl } from './config'

const host_endpoint = '/host'
const api = new Api({baseUrl: baseUrl})

export const getHosts = async () => {
    const hosts = await api.get(host_endpoint);
    return hosts;
}

export const getHostById = async (hostId) => {
    const host = await api.get(`${host_endpoint}/${hostId}`);
    return host;
}

export const createHost = async (host) => {
    const newHost = await api.post(host_endpoint, host);
    return newHost;
}

export const updateHost = async (host) => {
    const updatedHost = await api.put(`${host_endpoint}/${host.id}`, host);
    return updatedHost;
}

export const deleteHost = async (hostId) => {
    const res = await api.delete(`${host_endpoint}/${hostId}`);
    return res;
}