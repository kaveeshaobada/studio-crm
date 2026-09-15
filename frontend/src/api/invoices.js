import api from './axios';

export const fetchInvoices = (projectId) =>
    api.get(projectId ? `/invoices?projectId=${projectId}` : '/invoices').then((res) => res.data);

export const recordPayment = (invoiceId, amountCents) =>
    api.patch(`/invoices/${invoiceId}/payment`, { amountCents }).then((res) => res.data);
