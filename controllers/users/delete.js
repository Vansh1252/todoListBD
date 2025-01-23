const constants = require('../../utilities/constants');
const bcrypt = require('bcrypt');
const usermodel = require('../../models/users.model');
const responseManger = require('../../utilities/responseManager');

const deleteuser = async (req, res) => {
    try {
        const { userId } = req.user;
        const { userid } = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return responseManger.Authorization(res, "adminId is Invalid..!");
        }
        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return responseManger.badrequest(res, "userid is Invalid...!");
        }
        const user = await usermodel.findByIdAndUpdate(userid, { deleted: true }, { new: true });
        if (user === null) {
            return responseManger.badrequest(res, "there is no user...!");
        }
        await user.save();
        return responseManger.onsuccess(res, user, "successfully deleted...!");
    } catch (error) {
        return responseManger.servererror(res, constants.RESPONSE_MESSAGES.SERVER_ERROR);
    }
};

module.exports = deleteuser;