import { Api } from './api';
import { baseUrl } from './config'

const pipeline_endpoint = '/pipeline'
const api = new Api({baseUrl: baseUrl}).setHeader('Content-Type', 'application/json')

export const getPipelines = async () => {
    const pipelines = await api.get(pipeline_endpoint);
    return pipelines;
}

export const getPipelineById = async (pipelineId) => {
    const pipeline = await api.get(`${pipeline_endpoint}/${pipelineId}`);
    return pipeline;
}