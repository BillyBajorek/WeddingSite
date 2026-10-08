import "server-only";
import { Pool, type PoolClient } from "pg";

const schema = `
  create table if not exists parties (
    id serial primary key,
    email text not null default '',
    song_request text not null default '',
    dietary text not null default '',
    notes text not null default '',
    offer_first_dance boolean not null default false,
    first_dance_song text not null default '',
    responded_at timestamptz,
    created_at timestamptz not null default now()
  );
  alter table parties add column if not exists offer_first_dance boolean not null default false;
  alter table parties add column if not exists first_dance_song text not null default '';
  create table if not exists guests (
    id serial primary key,
    party_id integer not null references parties(id) on delete cascade,
    position integer not null default 0,
    name text not null default '',
    is_plus_one boolean not null default false,
    attending boolean,
    meal text
  );
  create index if not exists guests_party_id on guests (party_id);
`;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set");
  }
}

// Survives dev-server hot reloads so each edit doesn't open a new pool.
const globalForDb = globalThis as unknown as {
  weddingPool?: Pool;
  weddingSchema?: Promise<void>;
};

function pool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new DatabaseNotConfiguredError();
  globalForDb.weddingPool ??= new Pool({ connectionString, max: 5 });
  return globalForDb.weddingPool;
}

async function ready() {
  const db = pool();
  globalForDb.weddingSchema ??= db.query(schema).then(
    () => undefined,
    (error) => {
      globalForDb.weddingSchema = undefined;
      throw error;
    },
  );
  await globalForDb.weddingSchema;
  return db;
}

export async function query<Row extends object>(text: string, values: unknown[] = []) {
  const db = await ready();
  const result = await db.query<Row>(text, values);
  return result.rows;
}

export async function transaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await (await ready()).connect();
  try {
    await client.query("begin");
    const result = await work(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
