const express = require("express")
const mongoose = require("mongoose")
const path= require("path")
const hbs = require("hbs")
const route= require("./route/route")
const app=express();

app.use(express.json());

mongoose.connect('mongodb+srv://functionup-uranium-cohort:q8znVj4ly0Fp0mpU@cluster0.0wdvo.mongodb.net/GeeksAssignment', {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

 const static_path = path.join(__dirname, "../public")
 const template_path = path.join(__dirname, "../templates/views")
 const partials_path = path.join(__dirname, "../tempaltes/partials")


app.use(express.static(static_path))
app.set("view engine", "hbs")
app.set("views",template_path)
hbs.registerPartials(partials_path)

app.get("/",(req,res)=>{
    res.render("indexx")
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})