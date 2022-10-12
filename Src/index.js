const express = require("express")
const mongoose = require("mongoose")
const route= require("./route/route")
const app=express();

app.use(express.json());

app.use("/", route)

mongoose.connect('mongodb+srv://Nirajkumar:2gkjm25Aa8wh01yS@cluster0.kzih8.mongodb.net/GeeksAssignment?authSource=admin&replicaSet=atlas-11shqf-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})