import { MongoClient } from 'mongodb';

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/tweteroo';
let db = null;

async function connect() {
  if (db) return db;

  try {
    const client = new MongoClient(DATABASE_URL);
    await client.connect();
    db = client.db();
    console.log('✅ Conectado ao MongoDB!');

    // --- Código movido para DENTRO da função connect --- //
    // Teste rápido de conexão + criação de coleções
    await testConnection(db);
    await createCollectionsIfNeeded(db);
    // ------------------------------------------------ //

    return db;
  } catch (err) {
    console.error('❌ Erro ao conectar:', err);
    process.exit(1);
  }
}

// Função separada para testar a conexão
async function testConnection(db) {
  const users = await db.collection('users').findOne();
  console.log('📦 Primeiro usuário no banco:', users || 'Coleção vazia!');
}

// Função separada para criar coleções
async function createCollectionsIfNeeded(db) {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);

  if (!collectionNames.includes('users')) {
    await db.createCollection('users');
    console.log('🆕 Coleção "users" criada!');
  }

  if (!collectionNames.includes('tweets')) {
    await db.createCollection('tweets');
    console.log('🆕 Coleção "tweets" criada!');
  }
}

export default connect;