import express from 'express'
import z, { string } from 'zod'
import { SignJWT, jwtVerify } from 'jose'
import { sendResponse, JWT_SECRET, profileMiddleware, signToken } from '../middleware'
import { ResponseStatus } from '../responseStatus';
import { prisma } from '../db';
const router = express.Router();

// Channel - Create, Update, Delete
// Comment - Create, Update, Delete
// Video - Upload, update, Delete

enum Country {
    India,
    USA,
    UK
}

const channelSchema = z.object({
    channelName: z.string(),
    channelProfile: z.string(),
    discription: z.string().optional(),
    country: z.enum(["India", "USA", "UK"]),
    channelBanner: z.string().optional(),
    channelProfileUrl: z.string().optional()
})

const channelUpdateSchema = z.object({
    channelName: z.string().optional(),
    discription: z.string().optional(),
    channelBanner: z.string().optional(),
    channelProfileUrl: z.string().optional()
})

const commentSchema = z.object({
    commentText: z.string(),
    videoId: z.string()
})

const commentUpdateSchema = z.object({
    commentText: z.string(),
    videoId: z.string(),
    commentId: z.string()
})

const commentDelete = z.object({
    commentId: z.string(),
    videoId: z.string()
})

router.post('/channel',profileMiddleware, async(req,res) => {
    const { data, success } = channelSchema.safeParse(req.body);

    if(!success) return sendResponse(res, ResponseStatus.BAD_REQUEST);

    if (!req.auth) return sendResponse(res, ResponseStatus.UNAUTHORIZED);

    const userId = req.auth?.userId;
    const profileId = req.auth?.profileId;
    const channelId = req.auth?.channelId;

    try {
        const transaction = await prisma.$transaction(async(tx) => {
            const channelData = await tx.channel.create({
                data: {
                    channelName: data.channelName,
                    channelProfile: data.channelProfile,
                    discription: data.discription,
                    country: data.country,
                    channelBanner: data.channelBanner,
                    channelProfileUrl: data.channelProfileUrl,
                    userId,
                    profileId
                }
            })
    
            if (!channelData) return sendResponse(res, ResponseStatus.INTERNAL_ERROR)
    
            const profileUpdate = await tx.profile.update({
                where: { id:profileId, userId },
                data: {
                    channelId: channelData.id
                }
            })
    
            if (!profileUpdate) return sendResponse(res, ResponseStatus.INTERNAL_ERROR)
    
            const token = await signToken(userId, profileId, channelData.id);
    
            res.cookie("token",token);
    
            return sendResponse(res, ResponseStatus.SUCCESS, {
                userId,
                profileId,
                channelData
            })
        })
    } catch (err) {
        return sendResponse(res, ResponseStatus.INTERNAL_ERROR, err)
    }
})

router.put('/channel',profileMiddleware, async(req,res) => {
    const { data, success } = channelUpdateSchema.safeParse(req.body)

    if(!success) return sendResponse(res, ResponseStatus.BAD_REQUEST);

    if(!req.auth) return sendResponse(res, ResponseStatus.UNAUTHORIZED);

    const userId = req.auth.userId;
    const profileId = req.auth.profileId;
    const channelId = req.auth.channelId;

    if (Object.keys(data).length === 0) return sendResponse(res, ResponseStatus.BAD_REQUEST);

    try {
        const updateChannelData = await prisma.channel.update({
            where: { id: channelId, profileId },
            data
        });

        return sendResponse(res, ResponseStatus.SUCCESS, updateChannelData)

    } catch(err) {
        return sendResponse(res, ResponseStatus.INTERNAL_ERROR, err)
    }
})

router.delete('/channel',profileMiddleware, async(req,res) => {
    
    if(!req.auth) return sendResponse(res, ResponseStatus.UNAUTHORIZED);
    const userId = req.auth.userId;
    const profileId = req.auth.profileId;
    const channelId = req.auth.channelId;

    try {
        const channelDeleted = await prisma.channel.delete({
            where: { id: channelId, profileId }
        })

        return sendResponse(res, ResponseStatus.NO_CONTENT)

    } catch(err) {
        return sendResponse(res, ResponseStatus.INTERNAL_ERROR, err)
    }
})

router.post('/comment',profileMiddleware, async(req,res) => {
    const { data, success } = commentSchema.safeParse(req.body);

    if(!success) return sendResponse(res, ResponseStatus.BAD_REQUEST);

    if(!req.auth) return sendResponse(res, ResponseStatus.UNAUTHORIZED);

    const profileId = req.auth.profileId

    try {
        const commentData = await prisma.comment.create({
            data: {
                profileId,
                commentText: data.commentText,
                videoId: data.videoId
            }
        })

        return sendResponse(res, ResponseStatus.SUCCESS, commentData);
    } catch(err) {
        return sendResponse(res, ResponseStatus.INTERNAL_ERROR, err);
    }
})

router.put('/comment',profileMiddleware, async(req,res) => {
    const { data, success } = commentUpdateSchema.safeParse(req.body);

    if(!success) return sendResponse(res, ResponseStatus.BAD_REQUEST);

    if(!req.auth) return sendResponse(res, ResponseStatus.UNAUTHORIZED);

    const profileId = req.auth.profileId

    if(!data) return sendResponse(res, ResponseStatus.BAD_REQUEST)
     
    try {
        const updatedComment = await prisma.comment.update({
            where: { id: data.commentId, profileId, videoId: data.videoId },
            data: {
                commentText: data.commentText
            }
        })

        return sendResponse(res, ResponseStatus.SUCCESS, updatedComment)
    }catch(err) {
        return sendResponse(res, ResponseStatus.INTERNAL_ERROR, err)
    }
})

router.delete('/comment',profileMiddleware, async(req,res) => {
    const { data, success } = commentDelete.safeParse(req.body);

    if(!success) return sendResponse(res, ResponseStatus.BAD_REQUEST);

    if(!req.auth) return sendResponse(res, ResponseStatus.UNAUTHORIZED);

    const profileId = req.auth.profileId

    if(!data) return sendResponse(res, ResponseStatus.BAD_REQUEST)
    
    try {
        const commentDelete = await prisma.comment.delete({
            where: { id: data.commentId, profileId, videoId: data.videoId }
        })

        return sendResponse(res, ResponseStatus.NO_CONTENT)
    } catch(err) {
        return sendResponse(res, ResponseStatus.INTERNAL_ERROR, err)
    }
})

router.post('/video',profileMiddleware, async(req,res) => {

})

router.put('/video',profileMiddleware, async(req,res) => {

})

router.delete('/video',profileMiddleware, async(req,res) => {

})

export default router