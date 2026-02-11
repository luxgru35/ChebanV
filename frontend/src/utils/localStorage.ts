import type { User } from '../types';

export const setToken = (token: string) => {
    localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export const setUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr) as User;
        } catch (e) {
            console.error('Error parsing user from local storage', e);
            return null;
        }
    }
    return null;
};

export const removeUser = () => {
    localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};
