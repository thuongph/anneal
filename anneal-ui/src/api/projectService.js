import { Api } from './api';
import { baseUrl } from './config'

export class ProjectService {
    constructor(accessToken, endpoint) {
        this.projectApi = new Api({baseUrl: baseUrl}).setHeader('Content-Type', 'application/json').setHeader('Authorization', `Bearer ${accessToken}`)
        this._endpoint = endpoint;
    }

    getProjects = async () => {
        const projects = await this.projectApi.get(this._endpoint);
        return projects;
    }
    
    getProjectById = async (projectId) => {
        const project = await this.projectApi.get(`${this._endpoint}/${projectId}`);
        return project;
    }
    
    createProject = async (project) => {
        const res = await this.projectApi.post(this._endpoint, project);
        return res;
    }
    
    updateProject = async (project) => {
        const res = await this.projectApi.put(`${this._endpoint}/${project.id}`, project);
        return res;
    }
    
    deleteProject = async (projectId) => {
        const res = await this.projectApi.delete(`${this._endpoint}/${projectId}`);
        return res;
    }
    
    getPipelineByProjectId = async (projectId) => {
        const pipelines = await this.projectApi.get(`${this._endpoint}/${projectId}/pipelines`);
        return pipelines;
    }
}