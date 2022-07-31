// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dotenv from 'dotenv';
dotenv.config(); // setup dotenv
import {createCanvas} from 'canvas';
import  createFile from './../../api-lib/utils/createFile'
import {width,height,rarityWeights} from './../../api-lib/config'
import  compileMetadata from './../../api-lib/metadata/compileMetadata'
const Moralis = require("moralis/node");




type Data = {
  name: any
}
type imageData = {
  name: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

// setup canvas
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Moralis creds
const serverUrl = process.env.SERVER_URL;
const appId = process.env.APP_ID;
const masterKey = process.env.MASTER_KEY;
const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

// Start Moralis session
Moralis.start({ serverUrl, appId, masterKey });

const startCreating = async () => {
    // image data collection
    let imageDataArray:imageData[] = [];
  
    // create NFTs from startEditionFrom to editionSize
    let editionCount = 1;

    let editionSize = 10;
  let layers
    while (editionCount <= editionSize) {
      const handleFinal = async () => {
        // create image files and return object array of created images
        [...imageDataArray] = await createFile(
          canvas,
          ctx,
          layers,
          width,
          height,
          editionCount,
          editionSize,
          rarityWeights,
          imageDataArray
        );
      };
  
      await handleFinal();
      // iterate
      editionCount++;
    }
  
      //To upload image/json in moralis server
      await compileMetadata(
      apiUrl,
      apiKey,
      editionCount,
      editionSize,
      imageDataArray
    );
    
};
startCreating();
res.status(200).json({ name: 'Image upload successfully' })
}
