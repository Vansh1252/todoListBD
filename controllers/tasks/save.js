const mongoose = require('mongoose');
const responseManager = require('../../utilities/responseManager');
const tasksmodel = require('../../models/tasks.model');
const constants = require('../../utilities/constants');


const savetask = async (req, res) => {
    const { userId } = req.user;
    const { tasksId, title, description, dueDate } = req.body;
    try {
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            if (title && title != null && title != undefined && typeof title === 'string' && title.trim() != '') {
                if (description && description != null && description != undefined && typeof description === 'string' && description.trim() != '') {
                    if (dueDate && dueDate != null && dueDate != undefined && dueDate instanceof Date && !isNaN(dueDate.getTime()) && dueDate.getTime() >= Date.now()) {
                        if (tasksId && mongoose.Types.ObjectId.isValid(tasksId)) {
                            const updatefields = { title, description, dueDate };
                            const existingtask = await tasksmodel.findById(tasksId, updatefields, { new: true })
                            if (existingtask) {
                                return responseManager.onsuccess(res, "task updated successfully...!");
                            } else {
                                return responseManager.badrequest(res, "there is no existing task...!");
                            }
                        } else {
                            const createtask = new tasksmodel({
                                userId,
                                title,
                                description,
                                dueDate,
                            });
                            await createtask.save();
                            return responseManager.created(res, 1, "task created successfully...!");
                        }
                    } else {
                        return responseManager.badrequest(res, "date is Invaild...!")
                    }
                } else {
                    return responseManager.badrequest(res, "description is needed...!");
                }
            } else {
                return responseManager.badrequest(res, "title is needed...!");
            }
        } else {
            return responseManager.badrequest(res, "userId is Invaild...!");
        }
    } catch (error) {
        return responseManager.servererror(res, constants.RESPONSE_MESSAGES.SERVER_ERROR);
    }
}
module.exports = savetask