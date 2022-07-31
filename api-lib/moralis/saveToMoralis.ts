import type { NextApiRequest, NextApiResponse } from 'next';

const Moralis = require("moralis/node");
const request = require("request");


const saveToMoralis = async (metaHash, imageHash, editionSize) => {
  for (let i = 1; i < editionSize + 1; i++) {
    let id = i.toString();
    let paddedHex = (
      "0000000000000000000000000000000000000000000000000000000000000000" + id
    ).slice(-64);
    let url = `https://ipfs.moralis.io:2053/ipfs/${metaHash}/metadata/${paddedHex}.json`;
    let options = { json: true };

    request(url, options, (error, res, body) => {
      if (error) {
        return console.log(error);
      }

      if (!error && res.statusCode == 200) {
        // Save file reference to Moralis
        const FileDatabase = new Moralis.Object("Metadata");
        FileDatabase.set("edition", body.edition);
        FileDatabase.set("name", body.name);
        FileDatabase.set("dna", body.dna);
        FileDatabase.set("image", body.image);
        FileDatabase.set("attributes", body.attributes);
        FileDatabase.set("meta_hash", metaHash);
        FileDatabase.set("image_hash", imageHash);
        FileDatabase.save();
      }
    });
  }
};

module.exports = {
  saveToMoralis
};
