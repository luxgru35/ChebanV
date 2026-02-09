export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Event {
    id: number;
    title: string;
    description?: string;
    date: string; // ISO date string
    createdBy: number;
    creator?: {
        id: number;
        name: string; // "Например имя пользователя" indicator requirement
        email: string;
    };
    deletedAt?: string | null;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}
