import api from './axios';
import type { Event } from '../types';

export const getEvents = async (includeDeleted: boolean = false): Promise<Event[]> => {
    const response = await api.get<Event[]>('/public/events', {
        params: { includeDeleted }
    });
    return response.data;
};

export const getUserEvents = async (): Promise<Event[]> => {
    const response = await api.get<Event[]>('/users/events');
    return response.data;
};

export const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
    const response = await api.post<Event>('/events', eventData);
    return response.data;
};

export const updateEvent = async (id: number, eventData: Partial<Event>): Promise<Event> => {
    const response = await api.put<Event>(`/events/${id}`, eventData);
    return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`);
};

export const participate = async (id: number): Promise<{ message: string; participating: boolean }> => {
    const response = await api.post<{ message: string; participating: boolean }>(`/events/${id}/participate`, {});
    return response.data;
};

export const getParticipants = async (id: number): Promise<{ id: number, name: string, email: string }[]> => {
    const response = await api.get<{ id: number, name: string, email: string }[]>(`/events/${id}/participants`);
    return response.data;
}
