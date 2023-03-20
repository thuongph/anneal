import { Api } from './api';
import { baseUrl } from './config'

const project_endpoint = '/host'
const api = new Api({baseUrl: baseUrl})

export const getProjects = async () => {
    const projects = await api.get(project_endpoint);
    return projects;
}

export const getProjectById = async (projectId) => {
    const project = await api.get(`${project_endpoint}/${projectId}`);
    return project;
}

export const createProject = async (project) => {
    const res = await api.post(project_endpoint, project);
    return res;
}

export const updateProject = async (project) => {
    const res = await api.put(`${project_endpoint}/${project.id}`, project);
    return res;
}

export const deleteProject = async (projectId) => {
    const res = await api.delete(`${project_endpoint}/${projectId}`);
    return res;
}