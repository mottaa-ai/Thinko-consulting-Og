#!/usr/bin/env node

import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable not set');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('Running migrations...\n');
    
    // Create articles table
    console.log('Creating articles table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        author TEXT,
        category TEXT,
        image_url TEXT,
        source_url TEXT,
        source_name TEXT,
        published_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_by TEXT,
        is_published BOOLEAN NOT NULL DEFAULT FALSE
      )
    `);
    console.log('✓ articles table created\n');
    
    // Create contacts table
    console.log('Creating contacts table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        read BOOLEAN NOT NULL DEFAULT FALSE
      )
    `);
    console.log('✓ contacts table created\n');
    
    // Create article_syncs table
    console.log('Creating article_syncs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS article_syncs (
        id SERIAL PRIMARY KEY,
        source_file TEXT NOT NULL,
        total_count INTEGER NOT NULL,
        imported_count INTEGER NOT NULL DEFAULT 0,
        failed_count INTEGER NOT NULL DEFAULT 0,
        synced_at TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✓ article_syncs table created\n');
    
    // Create indexes for better query performance
    console.log('Creating indexes...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_is_published ON articles(is_published)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC)`);
    console.log('✓ Indexes created\n');
    
    console.log('✓ All migrations completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

migrate()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
