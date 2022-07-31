import type { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas } from 'canvas';
import createFile from './../../api-lib/utils/createFile';
import { width, height, rarityWeights } from './../../api-lib/config';
import dotenv from 'dotenv';
import compileMetadata from '../metadata/compileMetadata';
import generateJson from './../metadata/genrateJson';

dotenv.config(); // setup dotenv

type Data = {
  name: any;
};
type imageData = {
  name: any;
};

// setup canvas
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const startCreating = async (layers1, editionSize) => {
  // image data collection
  let imageDataArray: imageData[] = [];

  // create NFTs from startEditionFrom to editionSize
  let editionCount = 0;

  while (editionCount <= editionSize) {
    const handleFinal = async () => {
      // create image files and return object array of created images
      [...imageDataArray] = await createFile(
        canvas,
        ctx,
        layers1,
        width,
        height,
        editionCount,
        editionSize,
        rarityWeights,
        imageDataArray
      );
    };

    await handleFinal();
    //To upload image/json in moralis server
   
    // iterate
    editionCount++;
  }
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.API_KEY;
  await generateJson(editionSize,imageDataArray)
 //To upload image/json in moralis server
//  await compileMetadata(
//   apiUrl,
//   apiKey,
//   editionCount,
//   editionSize,
//   imageDataArray
// );
  return imageDataArray;
};
export default startCreating;
