import fs from 'fs';
const extract = require('extract-zip');
const basePath = process.cwd();
const path = require('path');

const getDirlist = async (file) => {
  const data = fs.readFileSync(file.filepath);
  const ext = path.extname(file.originalFilename);
    if(ext == '.zip'){
        fs.writeFileSync(`./public/${file.originalFilename}`, data);
        try {
            const extractData = await extract(
            `${basePath}/public/${file.originalFilename}`,
            {
                dir: `${basePath}/public`,
            }
            );
            fs.unlinkSync(`${basePath}/public/${file.originalFilename}`);
            const folderName = path.parse(file.originalFilename).name;
            const listDir = getDirectories(`${basePath}/public/${folderName}`);
            return listDir;
        } catch (err) {
            // handle any errors
            console.log('err', err);
        }
       
    }
    else{
        return 'error'
    }
};
const getDirectories = (path) => {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
};

export default getDirlist;
