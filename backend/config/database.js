// database.js - Gerenciador de Banco de Dados com Suporte MySQL 9 e Fallback Resiliente

const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let dbDriver = 'mysql';
let mysqlPool = null;
let sqliteDb = null;

// Configurações do MySQL (variáveis de ambiente ou padrões locais)
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'conecta_doacoes',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function initDatabase() {
  try {
    // 1. Tentar conexão inicial sem especificar o DB para criar o schema se necessário
    const conn = await mysql.createConnection({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      port: DB_CONFIG.port
    });
    
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conn.end();

    // 2. Conectar com o Pool MySQL
    mysqlPool = mysql.createPool(DB_CONFIG);
    const testConn = await mysqlPool.getConnection();
    testConn.release();

    dbDriver = 'mysql';
    console.log('✅ Conectado com SUCESSO ao Banco de Dados MySQL!');
    await setupMySQLSchema();
    return;
  } catch (err) {
    console.warn('⚠️ Não foi possível conectar ao servidor MySQL local (' + err.message + '). Ativando modo Fallback SQLite3.');
    setupSQLite();
  }
}

async function setupMySQLSchema() {
  const schemaPath = path.join(__dirname, '../db/schema.sql');
  if (fs.existsSync(schemaPath)) {
    const sql = fs.readFileSync(schemaPath, 'utf8');
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const stmt of statements) {
      try {
        await mysqlPool.query(stmt);
      } catch (e) {
        // Ignorar erros de tabelas já existentes
      }
    }
  }
}

function setupSQLite() {
  dbDriver = 'sqlite';
  const dbPath = path.join(__dirname, '../db/database.sqlite');
  sqliteDb = new sqlite3.Database(dbPath);

  sqliteDb.serialize(() => {
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'alimentos',
        description TEXT NOT NULL,
        target_amount REAL DEFAULT 0.00,
        current_amount REAL DEFAULT 0.00,
        target_items INTEGER DEFAULT 0,
        current_items INTEGER DEFAULT 0,
        unit TEXT DEFAULT 'unidades',
        image_url TEXT,
        creator_name TEXT NOT NULL,
        creator_phone TEXT,
        is_verified INTEGER DEFAULT 1,
        location TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deadline DATE
      )
    `);

    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS donations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign_id INTEGER NOT NULL,
        donor_name TEXT DEFAULT 'Doador Anônimo',
        amount REAL DEFAULT 0.00,
        items_qty INTEGER DEFAULT 0,
        payment_method TEXT DEFAULT 'pix',
        support_message TEXT,
        pix_code TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  console.log('✅ Banco de dados local SQLite3 inicializado com sucesso.');
}

// Métodos Unificados de Consulta (Database Abstraction)
async function query(sql, params = []) {
  if (dbDriver === 'mysql') {
    const [rows] = await mysqlPool.execute(sql, params);
    return rows;
  } else {
    return new Promise((resolve, reject) => {
      // Ajustar sintaxe de parâmetros MySQL (?) para SQLite
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

async function execute(sql, params = []) {
  if (dbDriver === 'mysql') {
    const [result] = await mysqlPool.execute(sql, params);
    return { insertId: result.insertId, affectedRows: result.affectedRows };
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ insertId: this.lastID, affectedRows: this.changes });
      });
    });
  }
}

module.exports = {
  initDatabase,
  query,
  execute,
  getDriver: () => dbDriver
};
