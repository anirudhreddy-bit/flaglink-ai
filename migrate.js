import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  console.log("🔄 Initializing database...");

  const dbPath = path.join(__dirname, "flaglink.db");
  const sqlite = new Database(dbPath);

  try {
    // Create tables using raw SQL
    const createTablesSql = `
      -- Users table
      CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        emailVerified TEXT,
        image TEXT,
        password TEXT
      );

      -- Accounts table (for OAuth)
      CREATE TABLE IF NOT EXISTS account (
        userId TEXT NOT NULL,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        providerAccountId TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        PRIMARY KEY (provider, providerAccountId),
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
      );

      -- Sessions table
      CREATE TABLE IF NOT EXISTS session (
        sessionToken TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        expires TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
      );

      -- Verification tokens table
      CREATE TABLE IF NOT EXISTS verificationToken (
        email TEXT NOT NULL,
        token TEXT NOT NULL,
        expires TEXT NOT NULL,
        PRIMARY KEY (email, token)
      );

      -- Scans table
      CREATE TABLE IF NOT EXISTS scan (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        input TEXT NOT NULL,
        website TEXT,
        riskLevel TEXT NOT NULL,
        score INTEGER NOT NULL,
        redFlags TEXT NOT NULL,
        advice TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
      );

      -- Create indexes for common queries
      CREATE INDEX IF NOT EXISTS idx_user_email ON user(email);
      CREATE INDEX IF NOT EXISTS idx_scan_userId ON scan(userId);
      CREATE INDEX IF NOT EXISTS idx_scan_createdAt ON scan(createdAt DESC);
      CREATE INDEX IF NOT EXISTS idx_session_userId ON session(userId);
    `;

    // Split by semicolon and execute each statement
    const statements = createTablesSql.split(";").filter((s) => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        sqlite.exec(statement);
      }
    }

    console.log("✅ Database tables created successfully!");
    console.log(`📁 Database location: ${dbPath}`);

    // Show table info
    const tables = sqlite
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
      )
      .all();

    console.log("\n📊 Tables created:");
    tables.forEach((table) => {
      console.log(`  ✓ ${table.name}`);
    });

    sqlite.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    sqlite.close();
    process.exit(1);
  }
}

migrate();
