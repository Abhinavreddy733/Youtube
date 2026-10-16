import express from 'express'
import z from 'zod'
import { SignJWT, jwtVerify } from 'jose'
import { sendResponse, JWT_SECRET, profileMiddleware } from '../middleware'
import { ResponseStatus } from '../responseStatus';
import { prisma } from '../db';
const router = express.Router();

// Likes
// Dislikes
// History
// Playlist
// Subscribe
// Liked History

router.post('/like', profileMiddleware, async(req, res) => {

})

// remove Like
router.put('/like', profileMiddleware, async(req, res) => {
    
})

router.post('/dislike', profileMiddleware, async(req, res) => {
    
})

// remove dislike
router.put('/dislike', profileMiddleware, async(req, res) => {
    
})

router.post('/history', profileMiddleware, async(req, res) => {
    
})

// remove from history
router.put('/history', profileMiddleware, async(req, res) => {
    
})

router.post('/subscribe', profileMiddleware, async(req, res) => {
    
})

// remove from subscribe
router.put('/unsubscribe', profileMiddleware, async(req, res) => {
    
})

router.post('/createplaylist', profileMiddleware, async(req, res) => {
    
})

// update playlist
router.put('/playlist', profileMiddleware, async(req, res) => {
    
})

// delete playlist
router.delete('/playlist', profileMiddleware, async(req, res) => {
    
})

//Add video to playlist
router.post('/playlistvideo', profileMiddleware, async(req, res) => {
    
})

// Delete video from playlist
router.put('/playlistvideo', profileMiddleware, async(req, res) => {
    
})


export default router