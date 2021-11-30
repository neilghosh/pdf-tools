var express = require("express");
var uuid = require("node-uuid");
const fs = require("fs");
const ImageMagick = require("imagemagick");
var glob = require("glob");
const path = require("path");

var router = express.Router();

function convertImage(source, path_to, density) {
  return new Promise((resolve, reject) => {
    ImageMagick.convert(
      ["-density", density, "uploads/" + source, "results/" + path_to],
      function (err, stdout) {
        if (err) {
          reject(err);
        }
        resolve(stdout);
      }
    );
    console.log("file converted to JPEG");
  });
}

function convertPdf(source, path_to) {
  return new Promise((resolve, reject) => {
    ImageMagick.convert(
      ["results/" + source, "results/" + path_to],
      function (err, stdout) {
        if (err) {
          reject(err);
        }
        resolve(stdout);
      }
    );
    console.log("file converted to PDF");
  });
}
/* GET users listing. */
router.post("/", async function (req, res, next) {
  console.log(req.files.foo); // the uploaded file object
  let sampleFile = req.files.foo;
  let density = req.body.density;
  let fileId = uuid.v4();
  let fileName = fileId + ".pdf";
  try {
    await sampleFile.mv("uploads/" + fileName);
    console.log("File uploaded! " + fileId);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }

  let result = fileId + ".jpg";
  try {
    let output = await convertImage(fileName, result, density);
    console.log(output);
    fs.unlinkSync("uploads/" + fileName);
    console.log("cleaned up upload");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Unable to convert");
  }

  let jpegFilePattern = fileId + "*.jpg";
  let pdfFileName = fileId + "_output.pdf";
  try {
    let output = await convertPdf(jpegFilePattern, pdfFileName);
    console.log(output);
    glob("results/" + jpegFilePattern, {}, function (er, files) {
      files.forEach(function (file) {
        fs.unlinkSync(file);
        console.log("Deleting " + file);
      });
      console.log("cleaned up jpegs asynchronously");
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Unable to generate pdf");
  }
  let fname = path.join(__dirname, "/../results", pdfFileName);
  res.setHeader("Content-Type", "application/octet-stream");
  res.on("finish", function () {
    try {
      fs.unlink(fname);
      console.log(`cleaned up response file`+fname)
    } catch (e) {
      console.log("error removing ", fname);
    }
  });
  return res.status(200).sendFile(fname);
});

module.exports = router;
