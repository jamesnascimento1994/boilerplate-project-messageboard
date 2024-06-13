const mongoose = require('mongoose');
const { Schema } = mongoose;

const date = new Date();

const threadSchema = new Schema({
    text: { type: String },
    delete_password: { type: String },
    reported: { type: Boolean, default: false },
    created_on: { type: date, default: date },
    bumped_on: { type: date, default: date },
    replies: { type: [replySchema]}
});
const replySchema = new Schema({
    text: { type: String },
    delete_password: { type: String },
    reported: { type: Boolean, default: false },
    created_on: { type: date, default: date },
    bumped_on: { type: date, default: date },
});
const boardSchema = new Schema({
    name: { type: String },
    threads: { type: [threadSchema] }
});

const Thread = mongoose.model("Thread", threadSchema);
const Reply = mongoose.model("Reply", replySchema);
const Board = mongoose.model("Board", boardSchema);

exports.Thread = Thread;
exports.Reply = Reply;
exports.Board = Board;