const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5

const upload = multer()

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))


app.use(express.static('static'))

app.get('/', (req, res) => {
  res.sendFile('/static/index.html')
})

app.post('/u', upload.single('img_data'), (req, res) => {
    var fcontent = req.file.buffer
    var bytesWritten = fs.writeFileSync('./uploads/my-uploaded-image.jpg', fcontent)
    console.log('wrote file to disk')

    res.send({status: "success", statusCode: 0})
})

app.listen(port, () => {
  console.log(`Image server http://localhost:${port}`)
})
