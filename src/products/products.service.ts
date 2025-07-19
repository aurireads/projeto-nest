// src/products/products.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { db } from '../db';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Statement } from 'sqlite3';

export interface DBProduct {
  id: number;
  name: string;
  price: number;
  sku: string;
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
function missingLetter(name: string): string {
  const letters = new Set(name.toLowerCase().match(/[a-z]/g) || []);
  for (const l of alphabet) {
    if (!letters.has(l)) return l;
  }
  return '_';
}

@Injectable()
export class ProductsService {
  create(dto: CreateProductDto): Promise<DBProduct & { missing: string }> {
    const { name, price, sku } = dto;
    return new Promise<DBProduct & { missing: string }>((resolve, reject) => {
      const stmt = db.prepare(
        'INSERT INTO products (name, price, sku) VALUES (?, ?, ?)',
      );
      stmt.run(
        name,
        price,
        sku,
        function (this: Statement & { lastID: number }, err: unknown) {
          if (err) {
            if (err instanceof Error) {
              if (err.message.includes('UNIQUE')) {
                return reject(new BadRequestException('SKU deve ser único.'));
              }
              return reject(new BadRequestException(err.message));
            }
            if (typeof err === 'object' && err !== null) {
              const text = JSON.stringify(err);
              return reject(new BadRequestException(text));
            }
            return reject(new BadRequestException(String()));
          }

          const product: DBProduct = { id: this.lastID, name, price, sku };
          resolve({ ...product, missing: missingLetter(name) });
        },
      );
    });
  }

  findAll(): Promise<(DBProduct & { missing: string })[]> {
    return new Promise<(DBProduct & { missing: string })[]>(
      (resolve, reject) => {
        db.all(
          'SELECT * FROM products ORDER BY name COLLATE NOCASE',
          [],
          (err: unknown, rows: DBProduct[]) => {
            if (err) {
              if (err instanceof Error) {
                return reject(new BadRequestException(err.message));
              }
              if (typeof err === 'object' && err !== null) {
                return reject(new BadRequestException(JSON.stringify(err)));
              }
              return reject(new BadRequestException(String()));
            }
            resolve(
              rows.map((r) => ({
                ...r,
                missing: missingLetter(r.name),
              })),
            );
          },
        );
      },
    );
  }

  findOne(id: number): Promise<DBProduct & { missing: string }> {
    return new Promise<DBProduct & { missing: string }>((resolve, reject) => {
      db.get(
        'SELECT * FROM products WHERE id = ?',
        [id],
        (err: unknown, row: DBProduct) => {
          if (err) {
            if (err instanceof Error) {
              return reject(new BadRequestException(err.message));
            }
            if (typeof err === 'object' && err !== null) {
              return reject(new BadRequestException(JSON.stringify(err)));
            }
            return reject(new BadRequestException(String()));
          }
          if (!row) {
            return reject(new NotFoundException('Produto não encontrado.'));
          }
          resolve({ ...row, missing: missingLetter(row.name) });
        },
      );
    });
  }

  update(
    id: number,
    dto: UpdateProductDto,
  ): Promise<DBProduct & { missing: string }> {
    const { name, price, sku } = dto;
    return new Promise<DBProduct & { missing: string }>((resolve, reject) => {
      db.run(
        'UPDATE products SET name = ?, price = ?, sku = ? WHERE id = ?',
        [name, price, sku, id],
        function (this: Statement & { changes: number }, err: unknown) {
          if (err) {
            if (err instanceof Error) {
              if (err.message.includes('UNIQUE')) {
                return reject(new BadRequestException('SKU deve ser único.'));
              }
              return reject(new BadRequestException(err.message));
            }
            if (typeof err === 'object' && err !== null) {
              return reject(new BadRequestException(JSON.stringify(err)));
            }
            return reject(new BadRequestException(String()));
          }
          if (this.changes === 0) {
            return reject(new NotFoundException('Produto não encontrado.'));
          }
          db.get(
            'SELECT * FROM products WHERE id = ?',
            [id],
            (err2: unknown, row: DBProduct) => {
              if (err2) {
                if (err2 instanceof Error) {
                  return reject(new BadRequestException(err2.message));
                }
                if (typeof err2 === 'object' && err2 !== null) {
                  return reject(new BadRequestException(JSON.stringify(err2)));
                }
                return reject(new BadRequestException(String()));
              }
              resolve({ ...row, missing: missingLetter(row.name) });
            },
          );
        },
      );
    });
  }

  remove(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      db.run('DELETE FROM products WHERE id = ?', [id], (err: unknown) => {
        if (err) {
          if (err instanceof Error) {
            return reject(new BadRequestException(err.message));
          }
          if (typeof err === 'object' && err !== null) {
            return reject(new BadRequestException(JSON.stringify(err)));
          }
          return reject(new BadRequestException(String()));
        }
        resolve();
      });
    });
  }
}
