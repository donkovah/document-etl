import * as dotenv from 'dotenv';
import { validateEnv } from './env-validation';


dotenv.config();

export const config = validateEnv(process.env);
