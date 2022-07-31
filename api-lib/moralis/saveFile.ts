import fs from 'fs';
import startCreating from '../../api-lib/utils/startCreating';
const extract = require('extract-zip');
const basePath = process.cwd();
const path = require('path');
import addLayers from './../metadata/addLayers'

const saveFile = async (filename,editionSize) => {
   try {
    const folderName = path.parse(filename).name;
    const dirPath = `${basePath}/public/${folderName}`;
    const listDir = getDirectories(`${basePath}/public/${folderName}`);
    const layers1: any[] = [];
    console.log('listDir', listDir)
    listDir.forEach((data) => {
      layers1.push(addLayers(data, '', '', dirPath));
    });
    console.log('layers1', layers1)
    const createFileval = await startCreating(layers1, editionSize);
    console.log('createFileval', createFileval)
  //  // return listDir;
  } catch (err) {
    // handle any errors
    console.log('err', err);
  }
 // await fs.unlinkSync(file.filepath);
};
const getDirectories = (path) => {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
};

export default saveFile;
