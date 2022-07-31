import fs from 'fs';
import generateMetadata from '../metadata/generateMetadata';
const basePath = process.cwd();

// import canvas
const {
  signImage,
  drawBackground,
  drawElement
} = require("./canvas");

const {constructLoadedElements} = require('./constructLoadedElements');

// create image files and return back image object array
const createFile = async (
  canvas,
  ctx,
  layers,
  width,
  height,
  editionCount,
  editionSize,
  rarityWeights,
  imageDataArray
) => {
  const dna = constructLoadedElements(
    layers,
    editionCount,
    editionSize,
    rarityWeights
  );

  let attributesList:any[] = [];
  var metadataList:any = [];
  
  await Promise.all(dna.loadedElements).then(elementArray => {
    // create empty image
    ctx.clearRect(0, 0, width, height);
    // draw a random background color
    drawBackground(ctx, width, height);
    // store information about each layer to add it as meta information
    attributesList = [];
    // draw each layer
    elementArray.forEach(element => {
      drawElement(ctx, element);
      let selectedElement:any = element.layer.selectedElement;
      attributesList.push({
        name: selectedElement.name,
        rarity: selectedElement.rarity
      });
    });
    // add an image signature as the edition count to the top left of the image
    signImage(ctx, `#${editionCount}`);
    // write the image to the output directory
  });

  const base64ImgData = canvas.toBuffer();
  const base64 = base64ImgData.toString("base64");

  let filename = editionCount.toString() + ".png";
  let filetype = "image/png";

  // save locally as file
  fs.writeFileSync(`${basePath}/output/${filename}`, canvas.toBuffer(filetype));


  console.log(`Created #${editionCount.toString()}`);

  imageDataArray[editionCount] = {
    editionCount: editionCount,
    newDna: dna.newDna,
    attributesList: attributesList
  };

  return imageDataArray;
};

export default createFile