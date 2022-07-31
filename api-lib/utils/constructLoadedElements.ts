import type { NextApiRequest, NextApiResponse } from 'next';

// import canvas
const {loadLayerImg} = require("./canvas");

// import dna
const { constructLayerToDna, createUniqueDna } = require("./dna.ts");

// import rarity
const { createDnaListByRarity, getRarity } = require("./rarity");


const constructLoadedElements = (
  layers,
  editionCount,
  editionSize,
  rarityWeights
) => {
  let dna:any = {
    loadedElements: [],
    newDna: null
  };

  // holds which dna has already been used during generation and prepares dnaList object
  const dnaListByRarity = createDnaListByRarity(rarityWeights);

  // get rarity from to config to create NFT as
  let rarity = getRarity(editionCount, editionSize);

  // create unique Dna
  dna.newDna = createUniqueDna(layers, rarity, rarityWeights, dnaListByRarity);
  dnaListByRarity[rarity].push(dna.newDna);

  // propagate information about required layer contained within config into a mapping object
  // = prepare for drawing
  let results = constructLayerToDna(dna.newDna, layers, rarity);

  // load all images to be used by canvas
  results.forEach((layer: any) => {
    dna.loadedElements.push(loadLayerImg(layer));
  });

  return dna;
};
module.exports = {
  constructLoadedElements
};
