const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Plase provide a valid email']
    },
    password: {
        type: String,
        minlength: 6,
        select: false
    },
    role: {
        type:String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
},
{timestamps: true});


userSchema.index({email: 1}, {unique: true});

userSchema.pre('save', async function(next){
    //Only run this function if password was modified
    if (!this.isModified('password')) return next();

    //Hash the password with a cost of 10
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

module.exports = mongoose.model('users', userSchema);


