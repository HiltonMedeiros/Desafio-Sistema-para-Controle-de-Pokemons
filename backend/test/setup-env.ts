import * as dotenv from 'dotenv';
import { join } from 'path';

// Isso força o carregamento do .env que está na raiz do backend
dotenv.config({ path: join(__dirname, '../.env') });