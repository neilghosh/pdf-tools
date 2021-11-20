var express = require('express');
var uuid = require('node-uuid');
const ImageMagick = require('imagemagick');

var router = express.Router();

function convertImage(source, path_to, density){
    return new Promise((resolve, reject) => {
        ImageMagick.convert(
            [
                '-density',
                density,
                'uploads/'+ source,            
                'results/'+ path_to
            ],
            function(err, stdout){
                if(err) {
                    reject(err)
                }
                resolve(stdout);
            });
    })
}
/* GET users listing. */
router.post('/', async function(req, res, next) {
    console.log(req.files.foo); // the uploaded file object
    let sampleFile = req.files.foo;
    let density = req.body.density;
    let fileId = uuid.v4();
    let fileName = fileId+'.pdf';
    try {
        await sampleFile.mv('uploads/'+fileName);
        console.log('File uploaded! '+fileId);      
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }

    let result = fileId+'.jpg';
    try {
        let output = await convertImage(fileName, result, density);
        console.log(output);
    } catch(error) {
        console.log(error);
        return res.status(500).send("Unable to convert");        
    }
    return res.send(result);            
  });

module.exports = router;