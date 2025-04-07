import { tweetSchema } from '../models/Tweet.js';
import connectToDatabase from '../database/db.js';
import { ObjectId } from 'mongodb';

export async function postTweet(req, res) {
  // 1. Validar o body com Joi
  const { error } = tweetSchema.validate(req.body);
  if (error) return res.status(422).send(error.details[0].message);

  try {
    const db = await connectToDatabase();
    
    // 2. Verificar se o usuário existe
    const user = await db.collection('users').findOne({ username: req.body.username });
    if (!user) return res.status(401).send("Usuário não cadastrado!");

    // 3. Salvar o tweet
    await db.collection('tweets').insertOne({
      username: req.body.username,
      tweet: req.body.tweet,
      createdAt: new Date()
    });

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getTweets(req, res) {
    try {
      const db = await connectToDatabase();
      
      // 1. Busca tweets ordenados por data (mais novos primeiro)
      const tweets = await db.collection('tweets')
        .find()
        .sort({ createdAt: -1 })  // -1 = decrescente
        .limit(10)
        .toArray();
  
      // 2. Para cada tweet, busca o avatar do usuário
      const tweetsWithAvatar = await Promise.all(
        tweets.map(async (tweet) => {
          const user = await db.collection('users').findOne({ 
            username: tweet.username 
          });
          return {
            ...tweet,
            avatar: user.avatar  // Adiciona o avatar ao tweet
          };
        })
      );
  
      res.send(tweetsWithAvatar);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  export async function updateTweet(req, res) {
    const { id } = req.params;  // Pega o ID da URL
    const { tweet } = req.body; // Novo texto
  
    // 1. Valida o novo tweet
    const { error } = tweetSchema.validate({ username: "placeholder", tweet }); // Username fictício para validação
    if (error) return res.status(422).send(error.details[0].message);
  
    try {
      const db = await connectToDatabase();
      
      // 2. Verifica se o tweet existe
      const existingTweet = await db.collection('tweets').findOne({ 
        _id: new ObjectId(id) 
      });
      if (!existingTweet) return res.status(404).send("Tweet não encontrado!");
  
      // 3. Atualiza o tweet
      await db.collection('tweets').updateOne(
        { _id: new ObjectId(id) },
        { $set: { tweet } }
      );
  
      res.sendStatus(204);  // 204 No Content = sucesso sem retorno
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  export async function deleteTweet(req, res) {
    try {
      const db = await connectToDatabase();
      const { id } = req.params;
  
      // 1. Verifica se o tweet existe
      const tweet = await db.collection('tweets').findOne({ 
        _id: new ObjectId(id) 
      });
      if (!tweet) return res.status(404).send("Tweet não encontrado!");
  
      // 2. Deleta
      await db.collection('tweets').deleteOne({ 
        _id: new ObjectId(id) 
      });
  
      res.sendStatus(204);  // 204 No Content = sucesso sem retorno
    } catch (err) {
      res.status(500).send(err.message);
    }
  }