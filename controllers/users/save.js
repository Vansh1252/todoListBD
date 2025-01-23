const mongoose = require('mongoose');
const responseManager = require('../../utilities/responseManager');
const constants = require('../../utilities/constants');
const bcrypt = require('bcrypt');
const usermodel = require('../../models/users.model');
const nodemailer = require('nodemailer');
const userverificationmodel = require('../../models/userverfication.model');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    }
});
transporter.verify((error, success) => {
    if (error) {
        console.log("object");
        console.log(error);
    } else {
        console.log("Ready to send emails...!");
    }
});
const sendVerificationEmail = async ({ _id, email }, res) => {
    const currentUrl = "http://localhost:3000/";
    const uniqueString = uuidv4() + _id;

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Verify your email address to complete signup and log in to your account.</p>
        <p>This link <b>expires in 6 hours</b>.</p>
        <p>Click <a href="${currentUrl}verify/${_id}/${uniqueString}">here</a> to verify your email.</p>`,
    };

    try {
        const hashedUniqueString = await bcrypt.hash(uniqueString, 10);

        const newVerification = new userverificationmodel({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 6 * 60 * 60 * 1000,
        });

        await newVerification.save();
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error in sendVerificationEmail:", error);
        return { success: false, error: "Failed to send verification email!" };
    }
};

const verifyEmail = async (req, res) => {
    const { userId, uniqueString } = req.params;

    try {
        const verificationRecord = await userverificationmodel.findOne({ userId });
        if (!verificationRecord) {
            return responseManager.badrequest(res, "Verification record not found!");
        }

        if (verificationRecord.expiresAt < Date.now()) {
            await userverificationmodel.deleteOne({ userId });
            return responseManager.badrequest(res, "Verification link has expired!");
        }

        const isStringValid = await bcrypt.compare(uniqueString, verificationRecord.uniqueString);
        if (!isStringValid) {
            return responseManager.badrequest(res, "Invalid verification link!");
        }

        await usermodel.findByIdAndUpdate(userId, { verified: true });
        await userverificationmodel.deleteOne({ userId });

    } catch (error) {
        console.error("Error in verifyEmail:", error);
        return responseManager.servererror(res, constants.RESPONSE_MESSAGES.SERVER_ERROR);
    }
};

const registeruser = async (req, res) => {
    const { userId, fullname, email, password } = req.body;
    try {
        if (fullname && fullname !== null && fullname !== undefined && typeof fullname === 'string' && fullname.trim() !== '') {
            if (email && email !== null && email !== undefined && typeof email === 'string' && email.trim() !== '') {
                const existingemail = await usermodel.findOne({ email });
                if (existingemail) {
                    return responseManager.badrequest(res, "email is already in use...!");
                }
                if (password && password !== null && password !== undefined && typeof password === 'string' && password.trim() !== '' && password.length >= 8) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
                        const updatefield = { fullname, email, password: hashedPassword };
                        const updateuser = await usermodel.findByIdAndUpdate(userId, updatefield, { new: true })
                        if (updatefield !== null) {
                            return responseManager.onsuccess(res, updateuser, "updated successfully...!");
                        } else {
                            return responseManager.badrequest(res, "user not found...!");
                        }
                    }
                    const createuser = await usermodel({
                        fullname,
                        email,
                        password: hashedPassword,
                    });
                    const savedUser = await createuser.save();
                    await sendVerificationEmail(savedUser, res);
                    return responseManager.created(res, "User created successfully!");
                } else {
                    return responseManager.badrequest(res, "password is required...!");
                }
            } else {
                return responseManager.badrequest(res, "email is required...!");
            }
        } else {
            return responseManager.badrequest(res, "full is required...!");
        }
    } catch (error) {
        console.log(error);
        return responseManager.servererror(res, constants.RESPONSE_MESSAGES.SERVER_ERROR);
    }
}



module.exports = { registeruser, verifyEmail }