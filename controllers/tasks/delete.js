const mongoose = require('mongoose');
const responseManager = require('../../utilities/responseManager');
const tasksmodel = require('../../models/tasks.model');
const constants = require('../../utilities/constants');


const deleted = async (req, res) => {
    const { tasksId } = req.body;
    const { userId } = req.user;
    try {
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            if (tasksId && mongoose.Types.ObjectId.isValid(tasksId)) {
                const task = await tasksmodel.findByIdAndUpdate(tasksId, { deleted: true }, { new: true });
                if (task) {
                    return responseManager.onsuccess(res, "deleted successfully...!");
                } else {
                    return responseManager.badrequest(res, "task is not found...!");
                }
            } else {
                return responseManager.badrequest(res, "userId is Invalid...!");
            }
        } else {
            return responseManager.badrequest(res, "userId is Invalid...!");
        }
    } catch (error) {
        return responseManager.servererror(res, constants.RESPONSE_MESSAGES.SERVER_ERROR);
    }
}

module.exports = deleted;