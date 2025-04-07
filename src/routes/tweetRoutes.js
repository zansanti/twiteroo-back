import express from 'express';
import { getTweets, postTweet, updateTweet, deleteTweet } from '../controllers/tweetController.js';


const router = express.Router();
router.post('/tweets', postTweet);
router.get('/tweets', getTweets); 
router.put('/tweets/:id', updateTweet);
router.delete('/tweets/:id', deleteTweet);
export default router;