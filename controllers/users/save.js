const mongoose = require('mongoose');
const respondeManager = require('../../utilities/responseManager');
const constants = require('../../utilities/constants');
const bcrypt = require('bcrypt');
const usermodel = require('../../models/users.model');

const saveuser = async (req, res) => {
    const { userId, fullname, email, password } = req.body;
    try {
        if (fullname && fullname !== null && fullname !== undefined && typeof fullname === 'string' && fullname.trim() !== '') {
            if (email && email !== null && email !== undefined && typeof email === 'string' && email.trim() !== '') {
                const existingemail = await usermodel.findOne(email)
                if (existingemail) {
                    return respondeManager.badrequest(res, "email is already in use...!");
                }
                if (password && password !== null && password !== undefined && typeof password === 'string' && password.trim() !== '' && password >= 8) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
                        const updatefield = { fullname, email, password };
                        const updateuser = await usermodel.findByIdAndUpdate(userId, updatefield, { new: true })
                        if (updatefield !== null) {
                            return respondeManager.onsuccess(res, updateuser, "updated successfully...!");
                        } else {
                            return respondeManager.badrequest(res, "user not found...!");
                        }
                    }
                    const createuser = await usermodel({
                        fullname,
                        email,
                        password: hashedPassword
                    });
                    await createuser.save();
                    return respondeManager.created(res, "user created successfully...!");
                } else {
                    return respondeManager.badrequest(res, "password is required...!");
                }
            } else {
                return respondeManager.badrequest(res, "email is required...!");
            }
        } else {
            return respondeManager.badrequest(res, "full is required...!");
        }
    } catch (error) {
        return respondeManager.servererror(res, constants.RESPONSE_MESSAGES.SERVER_ERROR);
    }
}

module.exports = saveuser