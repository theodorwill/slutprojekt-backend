const fs = require('fs')
const path = require('path')
const {InvalidFile, FileExists} = require('../errors')

module.exports = {
  getAll: (req, res) => {
    const images = fs.readdirSync(path.join(__dirname, '..', 'public', 'images'))
    res.json({ images })
  },

  upload: (req, res) => {
    
    let sampleFile = req.files.image;

    if(!sampleFile.mimetype.startsWith('image/')){
        throw new InvalidFile('Invaild file, must be an image') 
    } else if(fs.existsSync(path.join(__dirname, '..', 'public', 'images', sampleFile.name))){
        throw new FileExists(sampleFile.name)
    } else{
        sampleFile.mv(path.join(__dirname, '..', 'public', 'images', sampleFile.name), function(err) {
            if(err)
            return res.status(500).send(err);
    
            res.json({ message: 'Image uploaded' })
        })     
    }
  },
}
