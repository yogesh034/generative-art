import fs from 'fs';
const basePath = process.cwd();
const { default: axios } = require("axios");
const {uploadMetadata} = require('./uploadMetadata');

const compileMetadata = async (
  apiUrl,
  xAPIKey,
  editionCount,
  editionSize,
  imageDataArray
) => {
 var ipfsArray:any[] = [];
 var promiseArray:any[] = [];

  for (let i = 0; i < editionCount; i++) {
    let id = i.toString();
    let paddedHex = (
      "0000000000000000000000000000000000000000000000000000000000000000" + id
    ).slice(-64);
    console.log("run compile file");
    // reads output folder for images and adds to IPFS object metadata array (within promise array)
    promiseArray.push(
      new Promise((res, rej) => {
        fs.readFile(`${basePath}/output/${id}.png`, (err, data) => {
          if (err) {
            console.log(`err`, err)
          }
          ipfsArray.push({
            path: `images/${paddedHex}.png`,
            content: data?.toString("base64"),
          });
         // res();
        });
      })
    );
  }
console.log('promiseArray', promiseArray)
console.log('ipfsArray', ipfsArray)

  // once all promises then upload IPFS object metadata array
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
        console.log("IMAGE FILE PATHS:", res.data);
       // return res.data
        let imageCID = res.data[0].path.split("/")[4];
        console.log("IMAGE CID:", imageCID);
        // pass folder CID to meta data
        uploadMetadata(apiUrl, xAPIKey, imageCID, editionSize, imageDataArray);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};


export default compileMetadata;