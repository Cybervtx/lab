import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho absoluto baseado neste arquivo
const dbPath = path.resolve(__dirname, '../data/NVI.sqlite');
// console.log('📁 Caminho do banco:', dbPath);


const db = new Database(dbPath);
export default db;
