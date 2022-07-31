import type { NextApiRequest, NextApiResponse } from 'next';

const fs = require("fs");
const basePath = process.cwd();

const writeMetaData = (metadataList) => {
  fs.writeFileSync(`${basePath}/output/_metadata.json`, JSON.stringify(metadataList));
};

module.exports = {
  writeMetaData,
};