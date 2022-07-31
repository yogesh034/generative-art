import type { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas } from 'canvas';
import createFile from './../../api-lib/utils/createFile';
import { width, height, rarityWeights } from './../../api-lib/config';
import dotenv from 'dotenv';
const basePath = process.cwd();

dotenv.config(); // setup dotenv

type Data = {
  name: any;
};
type imageData = {
  name: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // setup canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const startCreating = async () => {
    // image data collection
    let imageDataArray: imageData[] = [];

    // create NFTs from startEditionFrom to editionSize
    let editionCount = 1;
    const _dir = `${basePath}/public/layers`;

    let editionSize = 11;
    // const layers: any = [
    //   addLayer('background', '', '', _dir),
    //   addLayer('skin', '', '', _dir),
    //   addLayer('cloth', '', '', _dir),
    //   addLayer('eyes', '', '', _dir),
    //   addLayer('hair', '', '', _dir),
    //   addLayer('lips', '', '', _dir),
    //   addLayer('nose', '', '', _dir),
    // ];
    let layers = '';
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
    return imageDataArray;
  };
  const result = await startCreating();
  res.status(200).json({ name: result });
}
