import { Request, Response } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role?: string;
            }
        }
    }
}

export interface TypedRequest<T = any> extends Request {
    body: T;
    params: any;
}

export interface TypedResponse<T = any> extends Response {
    json: (body: T) => TypedResponse<T>;
}

export interface RequestWithUser extends Request {
    user: {
        id: string;
        email: string;
        role?: string;
    };
} 

export function Router() {
    throw new Error('Function not implemented.');
}
