import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log('Starting migration: research_papers -> news_items...');

// Step 1: Copy research_papers to news_items
const copyResult = await db.execute(sql`
  INSERT INTO news_items (title, description, url, source, categoryId, language, publishedAt, createdAt)
  SELECT 
    title,
    COALESCE(abstract, '') as description,
    url,
    source,
    categoryId,
    language,
    publishedAt,
    createdAt
  FROM research_papers
  WHERE 1=1
`);

console.log(`Copied ${copyResult[0].affectedRows} records from research_papers to news_items`);

// Step 2: Clear research_papers table
const deleteResult = await db.execute(sql`DELETE FROM research_papers`);
console.log(`Deleted ${deleteResult[0].affectedRows} records from research_papers`);

// Step 3: Verify counts
const newsCount = await db.execute(sql`SELECT COUNT(*) as count FROM news_items`);
const researchCount = await db.execute(sql`SELECT COUNT(*) as count FROM research_papers`);

console.log(`\nFinal counts:`);
console.log(`  news_items: ${newsCount[0][0].count}`);
console.log(`  research_papers: ${researchCount[0][0].count}`);

await connection.end();
console.log('\nMigration complete!');
