const userModel = require('../models/userModel');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { uploadFiles } = require('../aws/aws');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config');

// const { ObjectIdCheck } = require('../utils/validations');

const createUser = async (req, res) => {
    try {
        const files = req.files

        const { fname, lname, phone, email, password, address } = req.body;
        // console.log(req.body)
        
        if (password.length <= 8 || password.length >= 15) {
            return res.status(400).json({ status: false, message: 'Please enter valid password' });
        }

        if (files.length === 0) {
            return res.status(400).json({ status: false, message: 'Please upload profile image' });
        }
        else {
            const phoneCheck = await userModel.findOne({ $or: [{ phone }, { email }] });
            if (phoneCheck) {
                return res.status(400).json({ status: false, message: 'Phone number or email already exists' });
            }
            const url = await uploadFiles(files[0]);
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            const userDetail = {
                fname: fname,
                lname: lname,
                phone: phone,
                email: email,
                password: hashedPassword,
                address: {
                    shipping: {
                        street: address.shipping.street,
                        city: address.shipping.city,
                        pincode: address.shipping.pincode
                    },
                    billing: {
                        street: address.billing.street,
                        city: address.billing.city,
                        pincode: address.billing.pincode
                    }
                },
                profileImage: url
            }

            const user = await userModel.create(userDetail);
            return res.status(201).json({ status: true, message: 'User created successfully', data: user });
        }
    } catch (error) {
        if (error.message.includes('duplicate')) {
            return res.status(400).json({ status: false, message: error.message });
        }
        else if (error.message.includes('validation')) {
            return res.status(400).json({ status: false, message: error.message });
        }
        else {
            return res.status(500).json({ status: false, message: error.message });
        }
    }
}



module.exports = {
    createUser
}
