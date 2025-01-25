const mongoose = require('mongoose');
const responseManager = require('../../utilities/responseManager');
const tasksmodel = require('../../models/tasks.model');
const constants = require('../../utilities/constants');


const statuschangetocompleted = async (req, res) => {
    const { tasksId } = req.body;
    const { userId } = req.user;
    try {
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            if (tasksId && mongoose.Types.ObjectId.isValid(tasksId)) {
                const task = await tasksmodel.findById(tasksId);
                if (task) {
                    task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
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

const statuschangetocancelled = async (req, res) => {
    const { tasksId } = req.body;
    const { userId } = req.user;
    try {
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            if (tasksId && mongoose.Types.ObjectId.isValid(tasksId)) {
                const task = await tasksmodel.findById(tasksId);
                if (task) {
                    task.status = task.status === 'Cancelled' ? 'Pending' : 'Cancelled';
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


module.exports = { statuschangetocancelled, statuschangetocompleted }