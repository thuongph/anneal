import { Api } from './api';
import { baseUrl } from './config'

export class HostService {
    constructor(accessToken, endpoint) {
        this.hostApi = new Api({baseUrl: baseUrl}).setHeader('Content-Type', 'application/json').setHeader('Authorization', `Bearer ${accessToken}`)
        this._endpoint = endpoint;
    }

    getHosts = async () => {
        const hosts = await this.hostApi.get(this._endpoint);
        return hosts;
    }
    
    createHost = async (host) => {
        const newHost = await this.hostApi.post(this._endpoint, host);
        return newHost;
    }
    
    deleteHost = async (hostId) => {
        const res = await this.hostApi.delete(`${this._endpoint}/${hostId}`);
        return res;
    }
}