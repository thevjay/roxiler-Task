const express=require('express')
const mongoose=require('mongoose')
const app=express()


const bodyParser = require('body-parser');
const route = require('./route/transationRoute');

const PORT = 5000;
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/transactions', { useNewUrlParser: true, useUnifiedTopology: true });

app.use("/",route)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });