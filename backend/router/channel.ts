import express from 'express'
import z, { string } from 'zod'
import { SignJWT, jwtVerify } from 'jose'
import { sendResponse, JWT_SECRET, profileMiddleware } from '../middleware'
import { ResponseStatus } from '../responseStatus';
import { prisma } from '../db';
const router = express.Router();

// Channel - Create, Update, Delete
// Comment - Create, Update, Delete
// Video - Upload, update, Delete

const channelSchema = z.object({

})

router.post('/channel',profileMiddleware, async(req,res) => {

})

router.put('/channel',profileMiddleware, async(req,res) => {

})

router.delete('/channel',profileMiddleware, async(req,res) => {

})

router.post('/comment',profileMiddleware, async(req,res) => {

})

router.put('/comment',profileMiddleware, async(req,res) => {

})

router.delete('/comment',profileMiddleware, async(req,res) => {

})

router.post('/video',profileMiddleware, async(req,res) => {

})

router.put('/video',profileMiddleware, async(req,res) => {

})

router.delete('/video',profileMiddleware, async(req,res) => {

})

export default router