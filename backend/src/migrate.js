/**
 * Database migration — run once on VPS to create tables.
 * Usage: npm run migrate
 */
import pool from './db.js';

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Document types (e.g. "Certificate Attestation")
    await client.query(`
      CREATE TABLE IF NOT EXISTS document_types (
        id         SERIAL PRIMARY KEY,
        name       TEXT NOT NULL,
        slug       TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Steps per document type
    await client.query(`
      CREATE TABLE IF NOT EXISTS step_definitions (
        id               SERIAL PRIMARY KEY,
        document_type_id INT  REFERENCES document_types(id) ON DELETE CASCADE,
        label            TEXT NOT NULL,
        "order"          INT  NOT NULL,
        created_at       TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Tracking records (admin-created entries)
    await client.query(`
      CREATE TABLE IF NOT EXISTS tracking_records (
        id               SERIAL PRIMARY KEY,
        tracking_id      TEXT UNIQUE NOT NULL,
        document_type_id INT  REFERENCES document_types(id) ON DELETE SET NULL,
        current_step_id  INT  REFERENCES step_definitions(id) ON DELETE SET NULL,
        status           TEXT NOT NULL DEFAULT 'Pending'
                           CHECK (status IN ('Pending','In Progress','Completed','On Hold')),
        remarks          TEXT,
        created_at       TIMESTAMPTZ DEFAULT NOW(),
        updated_at       TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Auto-update updated_at trigger
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE 'plpgsql';
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS trg_tracking_updated_at ON tracking_records;
      CREATE TRIGGER trg_tracking_updated_at
        BEFORE UPDATE ON tracking_records
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // Indexes for common queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tracking_id ON tracking_records(tracking_id);
      CREATE INDEX IF NOT EXISTS idx_tracking_status ON tracking_records(status);
      CREATE INDEX IF NOT EXISTS idx_steps_doc_type ON step_definitions(document_type_id, "order");
    `);

    await client.query('COMMIT');
    console.log('✅ Migration completed successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
