import { Api } from './api';
import { baseUrl } from './config'

export class PipelineService {
    constructor(accessToken, endpoint) {
        this.pipelineApi = new Api({baseUrl: baseUrl}).setHeader('Content-Type', 'application/json').setHeader('Authorization', `Bearer ${accessToken}`)
        this._endpoint = endpoint;
    }

    getPipelines = async () => {
        const pipelines = await this.pipelineApi.get(this._endpoint);
        return pipelines;
    }
    
    getPipelineById = async (pipelineId) => {
        const pipeline = await this.pipelineApi.get(`${this._endpoint}/${pipelineId}`);
        return pipeline;
    }
}