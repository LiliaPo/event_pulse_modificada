import { Request, Response } from 'express';

export interface IUser {
    id?: number;
    username: string;
    nombre: string;
    email: string;
    password: string;
    rol?: string;
}

export interface IUserResponse {
    id: number;
    username: string;
    nombre: string;
    email: string;
}

export interface TypedRequest<T> extends Request {
    body: T
}

