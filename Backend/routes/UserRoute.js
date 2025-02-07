import express from "express";
import {allusers, logout, signup} from "../controllers/UserController.js";
import {login} from "../controllers/UserController.js";
import secureRoute from "../middleware/secureRoute.js";
// import secureRoute from "../middleware/secureRoute.js";
const router = express.Router();


router.post("/login",login);
router.post("/logout",logout);
router.post("/signup",signup);
router.get("/allUsers",secureRoute,allusers);
export default router;