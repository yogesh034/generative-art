import fs from 'fs';
import  generateMetadata from './generateMetadata'
const basePath = process.cwd();
const Moralis = require("moralis/node");
const { default: axios } = require("axios");
const {saveToMoralis} = require("../moralis/saveToMoralis");

const {writeMetaData} = require('./writeMetaData');

const generateJson = async (
  editionSize,
  imageDataArray
) => {
  var ipfsArray:any = []; // holds all IPFS data
  var metadataList:any = []; // holds metadata for all NFTs (could be a session store of data)
  var promiseArray:any = []; // array of promises so that only if finished, will next promise be initiated
  var filepath ;
  for (let i = 0; i < editionSize + 1; i++) {
    let id = i.toString();
    let paddedHex = (
      "0000000000000000000000000000000000000000000000000000000000000000" + id
    ).slice(-64);
    let filename = i.toString() + ".json";
var imageCID = '';

    let filetype = "base64";
    
    imageDataArray[
      i
    ].filePath = `https://ipfs.moralis.io:2053/ipfs/images/${paddedHex}.png`;
    //imageDataArray[i].image_file = res.data[i].content;
    // do something else here after firstFunction completes
    let nftMetadata = generateMetadata(
      imageDataArray[i].newDna,
      imageDataArray[i].editionCount,
      imageDataArray[i].attributesList,
      imageDataArray[i].filePath
    );
    metadataList.push(nftMetadata);


    // save locally as file
    fs.writeFileSync(
      `${basePath}/output/${filename}`,
      JSON.stringify(metadataList.find((meta) => meta.edition == i))
    );

   
  }
  console.log('metadataList', metadataList)

};

export default generateJson