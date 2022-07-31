import fs from 'fs';
import { format, width, height } from './../config';
const path = require('path');
const basePath = process.cwd();

const buildDir = `${basePath}/output/pixelate`;
const inputDir = `${basePath}/output`;
// setup canvas

const { createCanvas, loadImage } = require('canvas');
const console = require('console');

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const getImages = (_dir) => {
  try {
    return fs
      .readdirSync(_dir)
      .filter((item) => {
        let extension = path.extname(`${_dir}${item}`);
        if (extension == '.png' || extension == '.jpg') {
          return item;
        }
      })
      .map((i) => {
        return {
          filename: i,
          path: `${_dir}/${i}`,
        };
      });
  } catch {
    return null;
  }
};

const loadImgData = async (_imgObject) => {
  try {
    const image: any = await loadImage(`${_imgObject.path}`);
    return {
      imgObject: _imgObject,
      loadedImage: image,
    };
  } catch (error) {
    console.error('Error loading image:', error);
  }
};
const pixelFormat = {
  ratio: 2 / 128,
};

const draw = (_imgObject) => {
  let size = pixelFormat.ratio;
  let w = canvas.width * size;
  let h = canvas.height * size;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(_imgObject.loadedImage, 0, 0, w, h);
  ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
};

const saveImage = (_loadedImageObject) => {
  fs.writeFileSync(
    `${buildDir}/${_loadedImageObject.imgObject.filename}`,
    canvas.toBuffer('image/png')
  );
};

export { saveImage, draw, loadImgData, getImages };
