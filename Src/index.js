const express = require("express")
const mongoose = require("mongoose")
const route= require("./route/route")
const app=express();

app.use(express.json());

mongoose.connect('mongodb+srv://functionup-uranium-cohort:q8znVj4ly0Fp0mpU@cluster0.0wdvo.mongodb.net/GeeksAssignment', {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})