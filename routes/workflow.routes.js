import { Router } from "express";
import { sendReminder } from "../Controller/workflow.controller.js";

const workflowRouter = Router();

workflowRouter.post("/subscription/reminder", sendReminder);

export default workflowRouter;