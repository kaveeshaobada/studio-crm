import api from './axios';

export async function fetchAttachments(projectId) {
    const res = await api.get(`/attachments?projectId=${projectId}`);
    return res.data;
}

export async function createAttachment(payload) {
    const res = await api.post('/attachments', payload);
    return res.data;
}

export async function deleteAttachment(id) {
    const res = await api.delete(`/attachments/${id}`);
    return res.data;
}
