import express from 'express'
import { getCurrentUser, loginUser } from '../controllers/user.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", isAuth, getCurrentUser);

export default router;
