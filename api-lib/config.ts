import fs from 'fs';

const basePath = process.cwd();
const dotenv = require('dotenv');
dotenv.config(); // setup dotenv
/*******************************************************************
 * UTILITY FUNCTIONS
 * - scroll to BEGIN COLLECTION CONFIG to provide the config values
 ******************************************************************/
//const dir = __dirname + '/api/layers';

//const _dir = `${basePath}/public/layers`;

const addRarity = (_id, _from, _to) => {
  const _rarityWeight = {
    value: _id,
    from: _from,
    to: _to,
    layerPercent: {},
  };
  return _rarityWeight;
};

// get the name without last 4 characters -> slice .png from the name
const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  return name;
};

// reads the filenames of a given folder and returns it with its name and path
const getElements = (_path, _elementCount) => {
  return fs
    .readdirSync(_path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i) => {
      return {
        id: _elementCount,
        name: cleanName(i),
        path: `${_path}/${i}`,
      };
    });
};

// adds a layer to the configuration. The layer will hold information on all the defined parts and
// where they should be rendered in the image
// @param _id - id of the layer
// @param _position - on which x/y value to render this part
// @param _size - of the image
// @return a layer object used to dynamically generate the NFTs

// adds layer-specific percentages to use one vs another rarity
// @param _rarityId - the id of the rarity to specifiy
// @param _layerId - the id of the layer to specifiy
// @param _percentages - an object defining the rarities and the percentage with which a given rarity for this layer should be used
const addRarityPercentForLayer = (_rarityId, _layerId, _percentages) => {
  let _rarityFound = false;
  rarityWeights.forEach((_rarityWeight) => {
    if (_rarityWeight.value === _rarityId) {
      let _percentArray: any = [];
      for (let percentType in _percentages) {
        _percentArray.push({
          id: percentType,
          percent: _percentages[percentType],
        });
      }
      _rarityWeight.layerPercent[_layerId] = _percentArray;
      _rarityFound = true;
    }
  });
  if (!_rarityFound) {
    console.log(
      `rarity ${_rarityId} not found, failed to add percentage information`
    );
  }
};

/**************************************************************
 * BEGIN COLLECTION CONFIG
 *************************************************************/

// image width in pixels
const width = 1000;
// image height in pixels
const height = 1000;
// description for NFT in metadata file
const description = 'Moralis Mutants - Survivors of Rekt City';
// base url in case no unique metadata file i.e IPFS
const baseImageUri = process.env.SERVER_URL;
// id for edition to start from
const startEditionFrom = 1;
// amount of NFTs to generate in edition
const editionSize = 1000;
// prefix to add to edition dna ids (to distinguish dna counts from different generation processes for the same collection)
const editionDnaPrefix = 0;

// create required weights
// for each weight, call 'addRarity' with the id and from which to which element this rarity should be applied
let rarityWeights = [
  /* 
  addRarity("super_rare", 1, 1),
  addRarity("rare", 1, 1),
  */
  addRarity('original', 1, editionSize),
];

// create required layers
// for each layer, call 'addLayer' with the id and optionally the positioning and size
// the id would be the name of the folder in your input directory, e.g. 'ball' for ./input/ball


// provide any specific percentages that are required for a given layer and rarity level
// all provided options are used based on their percentage values to decide which layer to select from
addRarityPercentForLayer('original', 'Eyes', {
  super_rare: 0,
  rare: 0,
  original: 100,
});

const format = {
  width: 512,
  height: 512,
  smoothing: false,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: false,
  color: '#ffffff',
  size: 20,
  xGap: 40,
  yGap: 40,
  align: 'left',
  baseline: 'top',
  weight: 'regular',
  family: 'Courier',
  spacer: ' => ',
};

const pixelFormat = {
  ratio: 2 / 128,
};

const preview_gif = {
  numberOfImages: 5,
  order: 'ASC', // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: 'preview.gif',
};

export {
  width,
  height,
  description,
  baseImageUri,
  editionSize,
  startEditionFrom,
  rarityWeights,
  pixelFormat,
  format,
  preview_gif,
  
  getElements
};
