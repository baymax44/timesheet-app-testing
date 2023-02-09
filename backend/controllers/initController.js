const projectData = require('./projects.json');
const Project = require('../models/projects');

const init = async() => {
    for await ( let project of projectData){
        await Project.findOneAndUpdate({projectName: project.projectName}, project, {upsert: true});
    }

}

module.exports = init;