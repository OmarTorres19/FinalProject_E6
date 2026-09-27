import { Router } from "express";

import {
  getCriminals,
  getCriminal,
} from "../controllers/criminalsController.js";

const router = Router();

router.get("/", getCriminals);

router.get("/:id", getCriminal);

export default router;
