import { verbose } from 'sqlite3';
import { join } from 'path';

const sqlite3 = verbose();

const file = join(process.cwd(), 'database.sqlite');

export const db = new sqlite3.Database(file, (err) => {
  if (err) console.error('Falha ao abrir SQLite:', err);
  else console.log('SQLite conectado em', file);
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL CHECK(price > 0),
      sku TEXT NOT NULL UNIQUE
    );
  `);
});
