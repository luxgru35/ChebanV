export const setToken = (token: string) => {
    localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export const setUser = (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): any | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
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
