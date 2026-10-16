import express from 'express'
import z from 'zod'
import { SignJWT, jwtVerify } from 'jose'
import { sendResponse, JWT_SECRET } from '../middleware'
import { ResponseStatus } from '../responseStatus';
import { prisma } from '../db';
const router = express.Router();

//SignUp
//SignIn
//Logout

// SignUp Zod Schema - 
const SignUpSchema = z.object({
    email: z.email(),
    username: z.string(),
    password: z.string(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    Dob: z.coerce.date({ error: "Invalid date format" })
})

// Signin Zod Schema -
const SignInSchema = z.object({
    email: z.email(),
    password: z.string()
})

const signToken = (userId: string, currentProfileId: string, activeChannelId?: string) => {
    return new SignJWT({ id: userId, activeChannelId, currentProfileId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET)
}

router.post('/signup', async (req, res) => {
    const { data, success } = SignUpSchema.safeParse(req.body);

    if (!success) {
        return sendResponse(res, ResponseStatus.BAD_REQUEST)
    }

    try {
        const passwordHash = await Bun.password.hash(data.password)

        const transaction = await prisma.$transaction(async (tx) => {
            
            const profileId = crypto.randomUUID();

            const userData = await tx.user.create({
                data: {
                    email: data.email,
                    username: data.username,
                    gender: data.gender,
                    passwordHash,
                    Dob: data.Dob,
                    personalProfileId: profileId,
                    lastUsedProfileId: profileId,
                    profiles: { create: { id: profileId } },
                },
                select: {
                    id: true,
                    personalProfileId: true,
                    lastUsedProfileId: true
                }
            })

            //@ts-ignore
            const token = await signToken(userData.id, profileId)
            res.cookie('token', token)
            return sendResponse(res, ResponseStatus.SUCCESS, userData)
        })
    } catch (err: any) {
        if (err?.code === 'P2002') return sendResponse(res, ResponseStatus.CONFLICT)
        console.error('signup failed', err)
        return sendResponse(res, ResponseStatus.INTERNAL_ERROR, err)
    }
})

router.post('/signin', async (req, res) => {
    const { data, success } = SignInSchema.safeParse(req.body);

    if (!success) {
        return sendResponse(res, ResponseStatus.BAD_REQUEST)
    }

    try {
        const userData = await prisma.user.findUnique({
            where: { email: data.email },
            select: {
                id: true, username: true, passwordHash: true, personalProfileId: true, lastUsedProfileId: true,
                profiles: {
                    select: {
                        id: true,
                        channelId: true
                    }
                }
            },
        })

        if (!userData) return sendResponse(res, ResponseStatus.INVALID_CREDENTIALS);

        const isMatch = await Bun.password.verify(data.password, userData.passwordHash);

        if (!isMatch) return sendResponse(res, ResponseStatus.INVALID_CREDENTIALS);

        const profileId = userData.lastUsedProfileId 

        if (!profileId) return sendResponse(res, ResponseStatus.INTERNAL_ERROR);

        //@ts-ignore
        let channelId = userData ? userData.profiles[0]?.channelId : undefined

        let token
        token = channelId
            ? await signToken(userData.id, profileId, channelId) 
            : await signToken(userData.id, profileId) 

        res.cookie('token', token)
        return sendResponse(res, ResponseStatus.SUCCESS, {
            user: { id: userData.id, username: userData.username }
        })

    } catch (err: any) {
        console.error('signin failed', err)
        return sendResponse(res, ResponseStatus.INTERNAL_ERROR, err)
    }
})

// Logout still pending
router.post('/logout', (_req, res) => {
    res.clearCookie('token')
    return sendResponse(res, ResponseStatus.NO_CONTENT)
})

export default router