import express from "express";
import { template } from "../../controllers";
const router = express.Router();

router.get("/template", template);

export { router };
