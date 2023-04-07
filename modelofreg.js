const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    blogs: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

UserSchema.statics.addBlog = async function(username, blog) {
    const user = await this.findOneAndUpdate({ username }, { $push: { blogs: blog } }, { new: true }, ).sort({ updatedAt: -1 });
    return user.blogs;
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;