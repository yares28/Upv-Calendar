import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection config
const dbConfig = {
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432'),
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DATABASE || 'upv_calendar'
};

async function executeScriptFile(filePath: string): Promise<void> {
  console.log(`Executing SQL script: ${filePath}`);
  
  try {
    // Read SQL file content
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Fix CASCADE syntax for compatibility (remove CASCADE if causing issues)
    const fixedSql = sqlContent.replace(/CASCADE/g, '');
    
    // Create a client
    const client = new Client(dbConfig);
    await client.connect();
    
    // Execute SQL statements
    console.log('Executing SQL...');
    await client.query(fixedSql);
    
    console.log('SQL script executed successfully');
    await client.end();
  } catch (error) {
    console.error('Error executing SQL script:', error);
    throw error;
  }
}

async function setupDatabase(): Promise<void> {
  try {
    // Execute schema script
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    await executeScriptFile(schemaPath);
    
    // Execute seed script
    const seedPath = path.join(__dirname, '../db/seed.sql');
    await executeScriptFile(seedPath);
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase(); 