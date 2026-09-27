import { Router } from "express";

import { getCriminals } from "../controllers/criminalsController.js";

const router = Router();

router.get("/", getCriminals);

export default router;
