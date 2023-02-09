const mongoose = require('mongoose');
const { Schema } = mongoose

const projectSchema = new mongoose.Schema({
    projectName: {type: String, required: true},
    tasks: [{
        taskName : {type: String, required: true},
        Devs: [{ type: Schema.Types.ObjectId, ref: 'users' }],
        entries: [{
            userId: {type: Schema.Types.ObjectId, ref: 'users'},
            comment: {type: String, required: true},
            duration: {type: Number, required: true},
            status: {
                type: String,
                enum: ["NONE", "PENDING", "REJECT", "APPROVE"],
                default: "NONE"
            },
            regDate: {type: Date, default: Date.now}
        }]
    }]
});

module.exports = mongoose.model('projects', projectSchema);