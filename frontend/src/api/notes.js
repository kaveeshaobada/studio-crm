import api from './axios';

export async function fetchNotes(projectId) {
    const res = await api.get(`/notes?projectId=${projectId}`);
    return res.data;
}

export async function createNote(payload) {
    const res = await api.post('/notes', payload);
    return res.data;
}

export async function togglePinNote(id) {
    const res = await api.patch(`/notes/${id}/pin`);
    return res.data;
}

export async function deleteNote(id) {
    const res = await api.delete(`/notes/${id}`);
    return res.data;
}
