import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

const router = express.Router();

router.route('/').get((req,res) =>{
    res.status(200).json({ message : "Hello from DALL.E Routes"})
})
router.route('/').post(async (req,res) => {
  try{
    const {prompt} = req.body;
    const response = await openai.createImage({
      prompt,
      n:1,
      size:'1024x1024',
      response_format: 'b64_json'
    });
    const image = response.data.data[0].b64_json;
    res.status(200).json({photo:image});
  }
  catch(error){
        console.error(error);  // Log the error for debugging
        res.status(500).json({ message: "Something went wrong with the DALL-E API" });
  }
})
export default router;