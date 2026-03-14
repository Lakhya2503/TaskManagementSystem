import { Router } from "express";
import { createProject, getAllProject, updateDeadline, updateProject } from "../controllers/project.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

router.route("/add/project").post(createProject)

router.route("/update/deadline/:projectId").post(updateDeadline)

router.route("/update/:projectId").patch(updateProject)

router.route("/get/project").get(getAllProject)


export default router;
