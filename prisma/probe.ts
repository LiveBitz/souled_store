import { Pool } from "pg";

const regions = [
  "ap-south-1",
  "ap-southeast-1",
  "us-east-1",
  "us-west-1",
  "eu-central-1",
  "eu-west-1",
];

const password = "%40Live7014167848"; // Encoded @Live7014167848
const projectRef = "zjhxlwanzqdigsvqxzau";

async function testConnection() {
  console.log("Starting regional connection probe...");

  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres?pgbouncer=true`;
    
    console.log(`Testing region: ${region} (${host})...`);
    
    const pool = new Pool({ 
      connectionString,
      connectionTimeoutMillis: 5000,
    });

    try {
      const client = await pool.connect();
      console.log(`✅ SUCCESS! Project ${projectRef} is in region: ${region}`);
      const res = await client.query('SELECT current_database()');
      console.log(`Database confirmed: ${res.rows[0].current_database}`);
      client.release();
      await pool.end();
      return region;
    } catch (err: any) {
      if (err.message.includes("Tenant or user not found")) {
        console.log(`❌ Incorrect region (${region}).`);
      } else if (err.message.includes("timeout")) {
        console.log(`❌ Timeout for ${region}.`);
      } else {
        console.log(`❌ Error for ${region}: ${err.message}`);
      }
    } finally {
      await pool.end();
    }
  }

  console.log("🏁 Probe finished. No matching region found in common list.");
  return null;
}

testConnection();
