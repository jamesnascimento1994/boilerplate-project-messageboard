'use strict';
const ThreadModel = require("../models").Thread;
const ReplyModel = require("../models").Reply;
const BoardModel = require("../models").Board;

module.exports = function (app) {
  
  app.route('/api/threads/:board').post((req, res) => {
    const { text, delete_password } = req.body;
    let board = req.body.board;
    if (!board) {
      board = req.params.board;
    }
    console.log("post", req.body);
    const newThread = new ThreadModel({
      text: text,
      delete_password: delete_password,
      replies: []
    });
    console.log("new thread", newThread);
    BoardModel.findOne({ name: board }).then(boardData => {
      if (!boardData) {
        const newBoard = new BoardModel({
          name: board,
          threads: []
        });
        console.log("new board", newBoard);
        newBoard.threads.push(newThread);
        newBoard.save().then((err, data) => {
          console.log("new board data", data);
          if (err || !data) {
            console.log(err);
            res.send("There was an error saving post.");
          } else {
            res.json(newThread);
          }
        });
      } else {
        boardData.threads.push(newThread);
        boardData.save().then((err, data) => {
          if (err || !data) {
            console.log(err);
            res.send("There was an error saving post.");
          } else {
            res.json(newThread);
          }
        });
      }
    });
  });
  app.route('/api/replies/:board');
}
