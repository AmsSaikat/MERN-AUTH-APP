import express from 'express'
import { checkAuth, forgotPassword, logout, resetPassword, signin, signup, verifyEmail } from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.get("/check-auth", verifyToken, checkAuth)

router.post("/signup", signup)
router.post("/login", signin)
router.post("/logout", logout)  // changed to POST

router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword) // fixed typo
router.post("/reset-password/:token", resetPassword)

export default router
