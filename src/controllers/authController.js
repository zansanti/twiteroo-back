import { userSchema } from '../models/User.js'; // Criaremos esse arquivo depois
import connectToDatabase from '../database/db.js';

export async function signUp(req, res) {
  // Validação com Joi
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(422).send(error.details[0].message);

  try {
    const db = await connectToDatabase();
    // Verifica se usuário já existe
    const userExists = await db.collection('users').findOne({ 
      username: req.body.username 
    });
    if (userExists) return res.status(409).send("Usuário já existe!");

    // Insere no banco
    await db.collection('users').insertOne(req.body);
    res.sendStatus(201); // Created
  } catch (err) {
    res.status(500).send(err.message);
  }
}