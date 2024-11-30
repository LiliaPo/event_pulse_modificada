import { Request, Response, NextFunction } from 'express';

export interface TypedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role?: string;
    };
}

export interface TypedResponse extends Response {
    json: (body: any) => TypedResponse;
}

export interface AuthRequest extends TypedRequest {
    user: {
        id: string;
        email: string;
        role?: string;
    };
}

export interface User {
    id: string;
    email: string;
    nombre: string;
    username: string;
    password: string;
    role?: string;
}

export interface Event {
    id: string;
    nombre: string;
    categoria: string;
    subcategoria?: string;
    fecha: Date;
    localizacion: string;
    organizador: string;
} 