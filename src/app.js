import express from 'express';
import cors from 'cors';
import connect from './database/db.js'; // Importa a conexão
import authRoutes from './routes/authRoutes.js';
import tweetRoutes from './routes/tweetRoutes.js';
import 'dotenv/config'; // Carrega as variáveis do .env

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o DB antes das rotas
connect()
  .then(() => console.log('📦 Banco de dados pronto!'))
  .catch(err => console.error('💥 Falha no banco de dados:', err));

// Rotas
app.use(authRoutes);
app.use(tweetRoutes);

// Middleware de erro (simplificado)
app.use((err, req, res, next) => {
  console.error('🔥 Erro:', err);
  res.status(500).send('Algo quebrou!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}!`));