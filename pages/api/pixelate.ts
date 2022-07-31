import type { NextApiRequest, NextApiResponse } from 'next';
import {
  saveImage,
  draw,
  loadImgData,
  getImages,
} from './../../api-lib/utils/pixelate';
const basePath = process.cwd();
const inputDir = `${basePath}/output`;

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
  const startCreating = async () => {
    const images: any = getImages(inputDir);
    if (images == null) {
      console.log('Please generate collection first.');
      return;
    }
    let loadedImageObjects: any[] = [];
    images.forEach((imgObject) => {
      loadedImageObjects.push(loadImgData(imgObject));
    });
    await Promise.all(loadedImageObjects).then((loadedImageObjectArray) => {
      loadedImageObjectArray.forEach((loadedImageObject) => {
        draw(loadedImageObject);
        saveImage(loadedImageObject);
      });
    });
    console.log('loadedImageObjects :>> ', loadedImageObjects);
  };

  startCreating();
  res.status(200).json({ name: 'Image upload successfully' });
}
