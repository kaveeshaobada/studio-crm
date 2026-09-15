import api from './axios';

export const fetchProjects = () => api.get('/projects').then((res) => res.data);

export const createProject = (projectData) => api.post('/projects', projectData).then((res) => res.data);

export const updateProjectStage = (id, stage) =>
    api.patch(`/projects/${id}/stage`, { stage }).then((res) => res.data);