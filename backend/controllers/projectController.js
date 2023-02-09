const Project = require('../models/projects');
const User = require('../models/users');
const { sendError } = require('../utils/utils');
const mongoose = require('mongoose');

exports.getAllProjects = async(req, res) => {
    try {
        let projects = await Project.find().populate("tasks.Devs", {email:1}).populate("tasks.entries.userId", {email:1});
        return res.status(200).json({
            success: true,
            projects
        })
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error')
    }
}

exports.getProjectsByUserId = async (req, res) => {
    let {userId} = req.params;
    try {
        let projects = await Project.find({"tasks.Devs": userId}).populate("tasks.Devs", {email:1}).populate("tasks.entries.userId", {email:1});
        return res.status(200).json({
            success: true,
            projects
        });
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid User Id');
    }
}

exports.getTasksByUserId = async( req, res ) => {
    let {userId} = req.params;
    try {
        let tasks = await Project.aggregate([
            { $unwind: "$tasks"},
            { $match: {"tasks.Devs": mongoose.Types.ObjectId(userId)} }
        ]);
        return res.status(200).json({
            success: true,
            tasks
        })
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid User Id');
    }
}

exports.addEntry = async( req, res ) => {
    let { taskId, userId, comment, duration, regDate } = req.body;
    try {
        let project = await Project.findOne({"tasks._id": taskId });
        let length = project.tasks.length;

        for (let i = 0 ; i < length; i++){
            if ( project.tasks[i]._id == taskId){ 
                project.tasks[i].entries.push({userId, comment, duration, regDate});
            }
        }
        await project.save();
        
        return res.status(200).json({
            success: true
        })
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Data');
    }
}

exports.updateEntry = async(req, res) => {
    let { entryId, userId, comment, duration, regDate } = req.body;
    try {
        let project = await Project.findOne({"tasks.entries._id": entryId });
        if (!project) return sendError(req, res, 400, 'Invalid EntryId');
        let length = project.tasks.length;

        for (let i = 0 ; i < length; i++){
            let task = project.tasks[i];
            for ( let j = 0; j < task.entries.length; j++){
                if (task.entries[j]._id == entryId ) {
                    task.entries[j] = {userId, comment, duration, regDate};
                }
            }
        }
        await project.save();
        
        return res.status(200).json({
            success: true
        })
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Data');
    }
}

exports.deleteEntry = async (req, res) => {
    let { entryId } = req.params;
    try {
        let project = await Project.findOne({"tasks.entries._id": entryId });
        if (!project) return sendError(req, res, 400, 'Invalid EntryId');
        let length = project.tasks.length;
        for (let i = 0 ; i < length; i++){
            let task = project.tasks[i];
            for ( let j = 0; j < task.entries.length; j++){
                if (task.entries[j]._id == entryId ) {
                    task.entries.splice(j);
                }
            }
        }
        await project.save();
        return res.status(200).json({
            success: true
        });
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid EntryId');
    }
}

exports.getProjectDetail = async(req, res) => {
    let { userId, fromDate, toDate } = req.body;
    try {
        let projects = await Project.aggregate([
            {
                $unwind: "$tasks"
            },
            {
                $unwind: "$tasks.entries"
            },
            {
                $match: { 
                    "tasks.entries.userId": mongoose.Types.ObjectId(userId)
                }
            },
            {
                $match: {
                    "tasks.entries.regDate":{
                        $gte: new Date(fromDate),
                        $lte: new Date(toDate)
                    }
                }
            }
        ]);

       

        let newProjects = [];
        let length =  projects.length;
        for ( let i = 0 ; i < length; i++ ){
            let len = newProjects.length;
            let flag = false;
            for ( let j = 0; j < len; j++ ){
                if (projects[i]._id == newProjects[j]._id && projects[i].tasks._id == newProjects[j].tasks._id){
                    newProjects[j].tasks.entries.push(projects[i].tasks.entries);
                    flag = true;
                    break;
                }
            }
            if (!flag){
                let temp = JSON.parse(JSON.stringify(projects[i]));
                temp.tasks.entries = [];
                temp.tasks.entries.push(projects[i].tasks.entries);
                newProjects.push(temp);
            }
        }

        return res.status(200).json({
            success: true,
            projects: newProjects
        });

    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Data');
    }
}



exports.getProjectDetailbyTime = async(req, res) => {
    let { userId, fromDate, toDate } = req.body;
    try {
        let projects = await Project.aggregate([
            {
                $unwind: "$tasks"
            },
            {
                $unwind: "$tasks.entries"
            },
            {
                $match: { 
                    "tasks.entries.userId": mongoose.Types.ObjectId(userId)
                }
            },
            {
                $match: {
                    "tasks.entries.regDate":{
                        $gte: new Date(fromDate),
                        $lte: new Date(toDate)
                    }
                }
            }
        ]);

        let newProjects = [];
        let length =  projects.length;
        for ( let i = 0 ; i < length; i++ ){
            newProjects.push({
                regDate: projects[i].tasks.entries.regDate,
                entryId: projects[i].tasks.entries._id,
                projectName: projects[i].projectName,
                projectId: projects[i]._id,
                taskId: projects[i].tasks._id,
                taskName: projects[i].tasks.taskName,
                duration: projects[i].tasks.entries.duration,
                status: projects[i].tasks.entries.status,
                comment: projects[i].tasks.entries.comment,
            })
        }
        newProjects.sort(function(a,b){
            var c = new Date(a.regDate);
            var d = new Date(b.regDate);
            return c-d;
        });
        return res.status(200).json({
            success: true,
            projects: newProjects
        });

    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Data');
    }
}



exports.changeEntryStatus = async(req, res) => {
    let { userId, entryId, status, feedback} = req.body;
    try {
        let user = await User.findOne({_id: userId});
        if (!user) return sendError(req, res, 400, 'Invalid Data');
        if (user.role === "USER") return sendError(req, res, 401, "UnAuthorized User");

        let project = await Project.findOne({"tasks.entries._id": entryId });
        if (!project) return sendError(req, res, 400, 'Invalid EntryId');
        let length = project.tasks.length;

        for (let i = 0 ; i < length; i++){
            let task = project.tasks[i];
            for ( let j = 0; j < task.entries.length; j++){
                if (task.entries[j]._id == entryId ) {
                    task.entries[j].status = status;
                    task.entries[j].feedback = feedback || '';
                }
            }
        }
        await project.save();
        
        return res.status(200).json({
            success: true
        })
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Data');
    }
}

exports.setStatusPending = async(req, res) => {
    let {userId, fromDate, toDate} = req.body;
    try {
        let projects = await Project.aggregate([
            {
                $unwind: "$tasks"
            },
            {
                $unwind: "$tasks.entries"
            },
            {
                $match: { 
                    "tasks.entries.userId": mongoose.Types.ObjectId(userId)
                }
            },
            {
                $match: {
                    "tasks.entries.regDate":{
                        $gte: new Date(fromDate),
                        $lte: new Date(toDate)
                    }
                }
            },
            {
                $match: {
                    $or : [{"tasks.entries.status":"NONE"}, {"tasks.entries.status": "REJECT"}] 
                }
            }
        ]);

        for ( let i = 0; i < projects.length; i++){
            let project = await Project.findOne({"tasks.entries._id": projects[i].tasks.entries._id});
            let len = project.tasks.length;
            for (let j = 0; j < len; j++){
                let length = project.tasks[j].entries.length;
                for ( let k = 0; k < length; k++){
                    if (project.tasks[j].entries[k]._id.equals(projects[i].tasks.entries._id)){
                        project.tasks[j].entries[k].status = "PENDING";
                        await project.save();
                        break;
                    }
                }

            }
            
        }

        return res.status(200).json({
            success: true,
        })
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Data');
    }
    


}

exports.addProject = async( req, res ) => {
    let { projectName } = req.body;
    try {
        let project = await Project.create({
            projectName
        });
        return res.status(200).json({
            success: true
        })
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Data');
    }
}

