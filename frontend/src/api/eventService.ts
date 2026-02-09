import api from './axios';
import type { Event } from '../types';

export const getEvents = async (includeDeleted: boolean = false): Promise<Event[]> => {
    const response = await api.get<Event[]>('/public/events', {
        params: { includeDeleted }
    });
    return response.data;
};
