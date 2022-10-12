const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },
    Password: {
        type: String,
        required: true,
        match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/, 'Please enter valid Password'],
        minlen: 8,
        maxlen: 15
    },
    PhoneNo: {
        type: Number,
        required: true,
        match: [/^[6-9]\d{9}$/, "please fill a valid mobile Number"],
        unique: true
    },
    Profession: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    }
},
    { timestamps: true })

module.exports = mongoose.model("User", UserSchema)