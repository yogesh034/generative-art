import formidable from 'formidable';
import getDirlist from '../../api-lib/moralis/getDirlist';

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    //const responceData = await saveFile(files.file);
    const responceData = await getDirlist(files.file);
    //return res.status(201).send('File Upload successfully');
    if(responceData === 'error'){
      return res.status(500).json({
        status: 500,
        message: 'File Format not supported',
        sucess: false,
      });
    }
    else{
      return res.status(201).json({
        status: 201,
        message: 'File upload successfully',
        sucess: true,
        data: responceData,
      });
    }
   
  });
};

const result = (req, res) => {
  req.method === 'POST'
    ? post(req, res)
    : req.method === 'PUT'
    ? console.log('PUT')
    : req.method === 'DELETE'
    ? console.log('DELETE')
    : req.method === 'GET'
    ? console.log('GET')
    : res.status(404).send('test');
};
export default result;
