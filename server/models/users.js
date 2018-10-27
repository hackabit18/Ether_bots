const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    accountAddr: {
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('users',UserSchema);
