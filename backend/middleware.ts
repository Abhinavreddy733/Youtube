import express from 'express'
import { jwtVerify } from 'jose'
import type { Response, Request, NextFunction } from 'express'
import { ResponseStatus,type ResponseStatusType } from './responseStatus'
import { prisma } from "./db";

declare global {
    namespace Express {
        interface Request {
            auth?: {
                userId: string;
                profileId: string;
                channelId: string | undefined;
            };
        }
    }
}

export const JWT_SECRET = new TextEncoder().encode("ABHINAV"!)

export const profileMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    
    if (!token) return sendResponse(res, ResponseStatus.UNAUTHORIZED)

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        
        if(typeof payload.id !== "string" || typeof payload.currentProfileId !== 'string' ) return sendResponse(res, ResponseStatus.UNAUTHORIZED)

        req.auth = {
            userId: payload.id,
            profileId: payload.currentProfileId,
            channelId: payload.activeChannelId as string | undefined
        };
        
        next()
    } catch {
        return sendResponse(res, ResponseStatus.UNAUTHORIZED)
    }
}

export const sendResponse = (res: Response, rs: ResponseStatusType, data?: unknown) => {

    if (rs.status === 204) return res.status(204).send();

    return res.status(rs.status).json({
        status: rs.status,
        code: rs.code,
        message: rs.message,
        ...(data !== undefined && { data }),
    });
}