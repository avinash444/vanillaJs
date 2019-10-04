require('dotenv').config()
const express = require('express')
const app = express()
const { getRates } = require('./public/lib/service');
const port = process.env.PORT || 3000

app.use(express.static('public'))

app.use('/scripts',express.static(`${__dirname}/node_modules/`))

app.use((req,res) => res.sendFile(`${__dirname}/public/index.html`))
app.listen(port)
