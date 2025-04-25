import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  SERVER_URL,
  EMAIL_PASSWORD,
  NODE_ENV,
  DB_URI,
  JWT_EXPIRY,
  JWT_SECRET,
  ARCJET_KEY,
  QSTASH_URL,
  QSTASH_TOKEN,
  QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY,
} = process.env;
