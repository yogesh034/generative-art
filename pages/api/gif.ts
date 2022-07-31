import type { NextApiRequest, NextApiResponse } from 'next';

const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const imageDir = `/var/www/qolaba_art_engine/pages/api/output`;
const buildDir = `/var/www/qolaba_art_engine/pages/api/output`;

//const { saveProjectPreviewGIF } = require("./utils/preview_gif");

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
  const loadImg = async (_img: any) => {
    return new Promise(async (resolve) => {
      const loadedImage = await loadImage(`${_img}`);
      resolve({ loadedImage: loadedImage });
    });
  };

  // read image paths
  const imageList: any = [];
  const rawdata = fs.readdirSync(imageDir).forEach((file: any) => {
    const img = loadImg(`${imageDir}/${file}`);
    imageList.push(img);
  });
  console.log('imageList :>> ', imageList);
  //saveProjectPreviewGIF(imageList);

  res.status(200).json({ name: 'true' });
}
