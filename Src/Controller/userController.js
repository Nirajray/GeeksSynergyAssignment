const userModel = require("../Models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")

// objectid validation
const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

//Own validation function
const isValid = function(value) {
    if (typeof(value) === 'undefined' || typeof(value) === null) {
        return false
    }
    if (typeof(value) === "number" && (value).toString().trim().length > 0) {
        return true
    }
    if (typeof(value) === "string" && (value).trim().length > 0) {
        return true
    }
}


const createUser = async function(req, res) {
    try {

        let body = req.body
        if (Object.keys(body).length === 0) {
            return res.status(400).send({ Status: false, message: " Sorry Body can't be empty" })
        }

        const { Name, Email, Password, PhoneNo, Profession } = body
    
        if (!isValid(Name)) {
            return res.status(400).send({ status: false, msg: "name is required" })
        }
    
        // Email is Mandatory...
        if (!isValid(Email)) {
            return res.status(400).send({ status: false, msg: "Email is required" })
        };
        // For a Valid Email...
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(Email))) {
            return res.status(400).send({ status: false, message: ' Email should be a valid' })
        }

        // Email is Unique...
        let duplicateEmail = await userModel.findOne({ Email: Email })
        if (duplicateEmail) {
            return res.status(400).send({ status: false, msg: 'Email already exist' })
        }

           // //password Number is Mandatory...
           if (!isValid(Password)) {
            return res.status(400).send({ Status: false, message: " password is required" })
        }
        // password Number is Valid...
        if (Password.trim().length>15 || Password.trim().length<8 ) {
            return res.status(400).send({ Status: false, message: " Please enter a valid password, minlength 8, maxxlength 15" })
        }

        //generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        passwordValue = await bcrypt.hash(Password, salt);

        // phone Number is Mandatory...
        if (!isValid(PhoneNo)) {
            return res.status(400).send({ status: false, msg: 'phone number is required' })
        };
        // phone Number is Valid...
        let Phoneregex = /^[6-9]{1}[0-9]{9}$/

        if (!Phoneregex.test(PhoneNo)) {
            return res.status(400).send({ Status: false, message: " Please enter a valid phone number" })
        }


        // phone Number is Unique...
        let duplicateMobile = await userModel.findOne({ PhoneNo:PhoneNo })
        if (duplicateMobile) {
            return res.status(400).send({ status: false, msg: 'phoneNo number already exist' })
        };


        if (!isValid(Profession)) {
            return res.status(400).send({ status: false, msg: "Profession is required" })
        }

        let filterBody={Name:Name, Email:Email, Password:passwordValue, PhoneNo:PhoneNo, Profession:Profession}

        let userCreated = await userModel.create(filterBody)
        res.status(201).send({ status: true, msg: "user registered successfully", data: userCreated })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message }) 
    }
}

//====================================================login ============================================

const login = async function(req, res) {
    try {

        let body = req.body

        if (Object.keys(body).length === 0) {
            return res.status(400).send({ Status: false, message: " Sorry Body can't be empty" })
        }

        //****------------------- Email validation -------------------****** //

        if (!isValid(body.Email)) {
            return res.status(400).send({ status: false, msg: "Email is required" })
        };

        // For a Valid Email...
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(body.Email))) {
            return res.status(400).send({ status: false, message: ' Email should be a valid' })
        };


        //******------------------- password validation -------------------****** //

        if (!isValid(body.Password)) {
            return res.status(400).send({ Status: false, message: " password is required" })
        }

        //******------------------- checking User Detail -------------------****** //


        let checkUser = await userModel.findOne({ Email: body.Email });

        if (!checkUser) {
            return res.status(401).send({ Status: false, message: "email is not correct" });
        }

        let passwordMatch = await bcrypt.compare(body.Password, checkUser.Password)
        if (!passwordMatch) {
            return res.status(401).send({ status: false, msg: "incorect password" })
        }
        //******------------------- generating token for user -------------------****** //
        let userToken = jwt.sign({

            userId: checkUser._id,
            batch: "Uranium"

        }, 'somesecure@*&645', { expiresIn: '86400s' }); // token expiry for 24hrs

        return res.status(200).send({ status: true, message: "User login successfull", data: { userId: checkUser._id, token: userToken } });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

//====================================== Get User =============================================

const getUser = async function(req, res) {
    try {
        const user = await userModel.find({ isDeleted: false }).select({Name:1,_id:0})
        if (!user) {
            return res.status(404).send({ status: false, message: "user not found" });
        }
        //return user in response
        return res.status(200).send({ status: true,message:"Success" ,data: user });


    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}



//--------------------------------------------------------------------

const updateUser = async function(req, res) {
    try {
        let requestBody = req.body
        let user_id = req.params.userId
        let Passwordregex = /^[A-Z0-9a-z]{1}[A-Za-z0-9.@#$&]{7,14}$/
        let Phoneregex = /^[6-9]{1}[0-9]{9}$/

        let { Name, Email, PhoneNo, Password, Profession} = requestBody
        

        let filterBody = {};

        //========================================================================

        if ("Name" in requestBody) {

            if (!isValid(Name)) {
                return res.status(400).send({ status: false, message: "give name in the request body " })
            }

            filterBody["Name"] = Name

        }
        if ("Email" in requestBody) {
            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: "give email in request body" })
            }
            if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
                return res.status(400).send({ status: false, message: ' Email should be a valid' })
            };
            //unique email============
            let uniqueEmail = await userModel.findOne({ Email: Email })
            if (uniqueEmail) {
                return res.status(400).send({ status: false, message: ' This Email is already present' })
            }

            filterBody["Email"] = Email

        }
        if ("PhoneNo" in requestBody) {
            if (!isValid(PhoneNo)) {
                return res.status(400).send({ status: false, message: "give phone no. in request body" })
            }
            if (!Phoneregex.test(PhoneNo)) {
                return res.status(400).send({ status: false, message: ' phone no. should be a valid' })
            };
            //unique phone no.===============
            let uniqueNumber = await userModel.findOne({ PhoneNo: PhoneNo })
            if (uniqueNumber) {
                return res.status(400).send({ status: false, message: ' This Phone no. is already present' })
            }

            filterBody["PhoneNo"] = PhoneNo

        }

        if ("Password" in requestBody) {
            if (!isValid(Password)) {
                return res.status(400).send({ Status: false, message: " password is required" })
            }
            // password Number is Valid...
            if (!Passwordregex.test(Password)) {
                return res.status(401).send({ Status: false, message: " Please enter a valid password, minlength 8, maxxlength 15" })
            }

            //generate salt to hash password
            const salt = await bcrypt.genSalt(10);
            // now we set user password to hashed password
            password = await bcrypt.hash(Password, salt);

            filterBody["Password"] = password

        }
        if ("Profession" in requestBody) {

            if (!isValid(Profession)) {
                return res.status(400).send({ status: false, message: "give Profession in the request body " })
            }

            filterBody["Profession"] = Profession

        }
           
        let updates = await userModel.findOneAndUpdate({ _id: user_id }, { $set: filterBody }, { new: true })
        res.status(200).send({ status: true, message: "User profile updated", data: updates })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

const deleteUser = async function(req, res) {
    try {
        //reading userid from path
        const _id = req.params.userId;

        //id format validation
            if (!isValidObjectId(_id)) {
                return res
                    .status(400)
                    .send({ status: false, message: "Invalid userId" });
            }
      

        const user = await userModel.findOne({ _id:_id }, { isDeleted: false })
            //no users found
        if (!user) {
            return res.status(404).send({ status: false, message: "user not found" });
        }
        //return user in response
        const deleteuser = await userModel.findOneAndUpdate({ _id: _id }, {$set:{ isDeleted: true} },{new:true})
        return res.status(200).send({ status: true, message:"User deleted successfully" });


    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}




module.exports = { createUser, login, updateUser, getUser, deleteUser }