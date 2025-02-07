import express from "express";
import {getMessage, sendMessage } from "../controllers/MessageController.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

router.post("/send/:id",secureRoute, sendMessage);
router.get("/get/:id",secureRoute, getMessage);

export default router;