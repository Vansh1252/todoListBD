const constants = require('../../utilities/constants');
const bcrypt = require('bcrypt');
const usermodel = require('../../models/users.model');
const responseManger = require('../../utilities/responseManager');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email && email !== null && email !== undefined && typeof email === 'string' && email.trim() !== '') {
            if (password && password !== null && password !== undefined && typeof password === 'string' && password.trim() !== '' && password >= 8) {
                const login = await usermodel.findOne({ email });
                if (login !== null) {
                    const comparepassword = await bcrypt.compare(password, login.password);
                    if (comparepassword) {
                        const token = jwt.sign(
                            { adminId: admin._id, email: admin.email },
                            process.env.JWT_SECRET,
                        );
                        return responseManger.onsuccess(res, token, "Login successful.");
                    }
                } else {
                    return responseManger.badrequest(res, "email iD is Invalid...!");
                }
            } else {
                return responseManger.badrequest(res, "password is required...!");
            }
        } else {
            return responseManger.badrequest(res, "email is required...!");
        }
    } catch (error) {
        return responseManger.servererror(res, constants.RESPONSE_MESSAGES.SERVER_ERROR);
    }
}

module.exports = login

return resopn