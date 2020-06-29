import path from 'path'
import multer = require("multer");

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");
export default {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const filename = `${file.originalname}`;
      return callback(null, filename)
    }
  })
}