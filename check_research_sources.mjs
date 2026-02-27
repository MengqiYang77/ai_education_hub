import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const result = await db.execute(sql`
  SELECT source, COUNT(*) as count 
  FROM research_papers 
  GROUP BY source 
  ORDER BY count DESC
`);

console.log('Research papers by source:');
result[0].forEach(row => {
  console.log(`  ${row.source}: ${row.count}`);
});

console.log(`\nTotal sources: ${result[0].length}`);
console.log(`Total papers: ${result[0].reduce((sum, row) => sum + Number(row.count), 0)}`);

await connection.end();
