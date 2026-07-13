#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { Pool } from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable not set');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

// Read and parse CSV
const csvPath = path.join(__dirname, 'cms-data.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
});

console.log(`Found ${records.length} articles to import...`);

async function importArticles() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Record sync metadata
    const syncResult = await client.query(
      `INSERT INTO article_syncs (source_file, total_count, imported_count, failed_count)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ['csv_import', records.length, 0, 0]
    );
    const syncId = syncResult.rows[0].id;
    console.log(`Created sync record: ${syncId}`);
    
    let importedCount = 0;
    let failedCount = 0;
    
    for (const [index, record] of records.entries()) {
      try {
        // Generate slug from title if not present
        let slug = record.Slug;
        if (!slug) {
          slug = record['Nombre']
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        
        const publishedDate = record['Fecha publicación Thinko'] 
          ? new Date(record['Fecha publicación Thinko']).toISOString()
          : new Date().toISOString();
        
        await client.query(
          `INSERT INTO articles (
            slug, title, excerpt, author, category, 
            image_url, source_url, source_name, 
            published_at, is_published, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            excerpt = EXCLUDED.excerpt,
            author = EXCLUDED.author,
            category = EXCLUDED.category,
            image_url = EXCLUDED.image_url,
            source_url = EXCLUDED.source_url,
            source_name = EXCLUDED.source_name,
            published_at = EXCLUDED.published_at,
            updated_at = NOW()`,
          [
            slug,
            record['Nombre'] || '',
            record['Extracto'] || '',
            record['Autor'] || '',
            record['Categoría'] || '',
            record['Imagen destacada'] || '',
            record['URL fuente'] || record['Canonical URL'] || '',
            record['Fuente'] || '',
            publishedDate,
            record['Status']?.toLowerCase() === 'published' || record['Sincronizado']?.toLowerCase() === 'yes'
          ]
        );
        
        importedCount++;
        if ((index + 1) % 5 === 0) {
          console.log(`✓ Imported ${index + 1}/${records.length}`);
        }
      } catch (err) {
        failedCount++;
        console.error(`✗ Failed to import article at row ${index + 1}:`, err.message);
      }
    }
    
    // Update sync metadata
    await client.query(
      `UPDATE article_syncs 
       SET imported_count = $1, failed_count = $2, synced_at = NOW()
       WHERE id = $3`,
      [importedCount, failedCount, syncId]
    );
    
    await client.query('COMMIT');
    
    console.log(`\n✓ Import complete!`);
    console.log(`  Imported: ${importedCount}`);
    console.log(`  Failed: ${failedCount}`);
    console.log(`  Total: ${records.length}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Import failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

importArticles()
  .then(() => {
    console.log('Database closed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
