// Database utility functions

import type { D1Database } from '@cloudflare/workers-types';

/**
 * Execute a query and return results
 */
export async function query<T = any>(db: D1Database, sql: string, params: any[] = []): Promise<T[]> {
  const stmt = db.prepare(sql);
  const bound = params.length > 0 ? stmt.bind(...params) : stmt;
  const result = await bound.all<T>();
  return result.results || [];
}

/**
 * Execute a query and return first result
 */
export async function queryOne<T = any>(db: D1Database, sql: string, params: any[] = []): Promise<T | null> {
  const results = await query<T>(db, sql, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Execute an insert/update/delete query
 */
export async function execute(db: D1Database, sql: string, params: any[] = []): Promise<D1Result> {
  const stmt = db.prepare(sql);
  const bound = params.length > 0 ? stmt.bind(...params) : stmt;
  return await bound.run();
}

/**
 * Execute a batch of queries
 */
export async function batch(db: D1Database, queries: { sql: string; params?: any[] }[]): Promise<D1Result[]> {
  const statements = queries.map(q => {
    const stmt = db.prepare(q.sql);
    return q.params ? stmt.bind(...q.params) : stmt;
  });
  return await db.batch(statements);
}

/**
 * Paginate query results
 */
export async function paginate<T = any>(
  db: D1Database,
  sql: string,
  params: any[],
  page: number = 1,
  limit: number = 10
): Promise<{ data: T[]; total: number; page: number; totalPages: number }> {
  // Get total count
  const countSql = `SELECT COUNT(*) as count FROM (${sql})`;
  const countResult = await queryOne<{ count: number }>(db, countSql, params);
  const total = countResult?.count || 0;
  
  // Get paginated data
  const offset = (page - 1) * limit;
  const paginatedSql = `${sql} LIMIT ? OFFSET ?`;
  const data = await query<T>(db, paginatedSql, [...params, limit, offset]);
  
  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}

/**
 * Search with LIKE operator
 */
export function buildSearchQuery(fields: string[], searchTerm: string): { condition: string; params: string[] } {
  const conditions = fields.map(field => `${field} LIKE ?`).join(' OR ');
  const params = fields.map(() => `%${searchTerm}%`);
  return { condition: `(${conditions})`, params };
}

/**
 * Build filter conditions
 */
export function buildFilters(filters: Record<string, any>): { condition: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];
  
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      conditions.push(`${key} = ?`);
      params.push(value);
    }
  }
  
  return {
    condition: conditions.length > 0 ? conditions.join(' AND ') : '1=1',
    params
  };
}

/**
 * Safely get integer value
 */
export function getIntParam(value: any, defaultValue: number = 0): number {
  const num = parseInt(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Format date for database
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Check if record exists
 */
export async function exists(db: D1Database, table: string, conditions: Record<string, any>): Promise<boolean> {
  const { condition, params } = buildFilters(conditions);
  const sql = `SELECT 1 FROM ${table} WHERE ${condition} LIMIT 1`;
  const result = await queryOne(db, sql, params);
  return result !== null;
}
