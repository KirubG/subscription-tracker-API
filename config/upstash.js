import {Client as WorkflowClient} from '@upstash/workflow';

import {QSTASH_TOKEN, QSTASH_URL} from "./env.js"
import e from 'express';

export const workflowClient = new WorkflowClient({
  token: QSTASH_TOKEN,
    url: QSTASH_URL,
    // Optional: Set the region to your Upstash region (e.g., "us1", "eu1", etc.)
    })