const fs = require("fs");

const deleteFile = (filePath: any) => {
  fs.unlink(filePath, (err: any) => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
