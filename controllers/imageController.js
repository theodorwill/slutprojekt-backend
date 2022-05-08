const fs = require('fs')
const path = require('path')

module.exports = {
  getAll: (req, res) => {
    const images = fs.readdirSync(path.join(__dirname, '..', 'public', 'images'))
    res.json({ images })
  },

  upload: (req, res) => {
    
    let sampleFile = req.files.image;
    console.log(req.files)

    sampleFile.mv(path.join(__dirname, '..', 'public', 'images', sampleFile.name), function(err) {
        if(err)
        return res.status(500).send(err);

        res.json({ message: 'Image uploaded' })
    })

  },
}
