const express = require("express");
const path = require('path');
//init express
const app = express();

const PORT = process.env.PORT || 5000;
app.set("view engine", 'ejs');
app.use(express.static("public")); //makes this folder static
//create app
app.get('/', (req, res) => {
    res.render('index')
})
app.get('/management', (req, res) => {
    res.render('management')
})
app.get('/development', (req, res) => {
    res.render('development')
})
app.get('/approve', (req, res) => {
    res.render('approve')
})
app.get('/purchase', (req, res) => {
    res.render('purchase')
})
app.get('/reference', (req, res) => {
    res.render('reference')
})
app.get('/finances', (req, res) => {
    res.render('finances')
})
app.get('/success', (req, res) => {
    res.render('success')
})
app.post('/', (req, res) => {
    console.log(req.body)
})
app.listen(PORT, () => console.log("Server started on port " + PORT));