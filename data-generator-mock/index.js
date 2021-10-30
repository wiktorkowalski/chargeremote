const express = require('express');
const fs = require('fs')

const app = express();

app.get('/evs', (req, res) => {
    console.log('GET /evs');
    const response = fs.readFileSync('./responses/evs.json');
    return res.status(200).send(response);
})

app.get('/evs/:vin', (req, res) => {
    const vin = req.params.vin;
    console.log(`GET /evs/${vin}`);
    const response = fs.readFileSync(`./responses/${vin}.json`);
    return res.status(200).send(response);
})

app.listen(3211);
