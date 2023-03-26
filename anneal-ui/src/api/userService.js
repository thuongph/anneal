import { Api } from './api';
import { baseUrl } from './config'

const host_endpoint = '/users'
const api = new Api({baseUrl: baseUrl}).setHeader('Content-Type', 'application/json')

export const getUser = async (user) => {
    const _user = await api.post(`${host_endpoint}/login`, user);
    return _user;
}