const express = require('express')
const app = express()
const port = 3000

app.use(express.static('static'))

app.get('/', (req, res) => {
  res.sendFile('/static/index.html')
})

app.post('/u', (req, res) => {

    res.send({status: "success", statusCode: 0})
})

app.listen(port, () => {
  console.log(`Image server http://localhost:${port}`)
})
