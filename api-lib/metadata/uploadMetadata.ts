import fs from 'fs';
const basePath = process.cwd();
const Moralis = require("moralis/node");
const { default: axios } = require("axios");
const {saveToMoralis} = require("../moralis/saveToMoralis");

const {writeMetaData} = require('./writeMetaData');
const generateMetadata = require('./generateMetadata');

const uploadMetadata = async (
  apiUrl,
  xAPIKey,
  imageCID,
  editionSize,
  imageDataArray
) => {
  var ipfsArray:any = []; // holds all IPFS data
  var metadataList:any = []; // holds metadata for all NFTs (could be a session store of data)
  var promiseArray:any = []; // array of promises so that only if finished, will next promise be initiated

  for (let i = 1; i < editionSize + 1; i++) {
    let id = i.toString();
    let paddedHex = (
      "0000000000000000000000000000000000000000000000000000000000000000" + id
    ).slice(-64);
    let filename = i.toString() + ".json";

    let filetype = "base64";
    imageDataArray[
      i
    ].filePath = `https://ipfs.moralis.io:2053/ipfs/${imageCID}/images/${paddedHex}.png`;
    //imageDataArray[i].image_file = res.data[i].content;

    // do something else here after firstFunction completes
    let nftMetadata = generateMetadata(
      imageDataArray[i].newDna,
      imageDataArray[i].editionCount,
      imageDataArray[i].attributesList,
      imageDataArray[i].filePath
    );
    metadataList.push(nftMetadata);

    // upload metafile data to Moralis
    const metaFile = new Moralis.File(filename, {
      base64: Buffer.from(
        JSON.stringify(metadataList.find((meta) => meta.edition == i))
      ).toString("base64"),
    });

    // save locally as file
    fs.writeFileSync(
      `${basePath}/output/${filename}`,
      JSON.stringify(metadataList.find((meta) => meta.edition == i))
    );

    // reads output folder for json files and then adds to IPFS object array
    promiseArray.push(
      new Promise((res, rej) => {
        fs.readFile(`${basePath}/output/${id}.json`, (err, data) => {
          if (err) rej();
          ipfsArray.push({
            path: `metadata/${paddedHex}.json`,
            content: data.toString("base64"),
          });
          //res();
        });
      })
    );
  }

  // once all promises back then save to IPFS and Moralis database
  Promise.all(promiseArray).then(() => {
    axios
      .post(apiUrl, ipfsArray, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          "X-API-Key": xAPIKey,
          "content-type": "application/json",
          accept: "application/json",
        },
      })
      .then((res) => {
        let metaCID = res.data[0].path.split("/")[4];
        console.log("META FILE PATHS:", res.data);
        saveToMoralis(metaCID, imageCID, editionSize);
        writeMetaData(metadataList);
        return metadataList;
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

module.exports = {
  uploadMetadata,
};