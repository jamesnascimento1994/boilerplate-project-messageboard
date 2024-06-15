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
        newBoard.save().then(data => {
          console.log("new board data", data);
          res.json(newThread);
        }).catch(err => {
          console.log(err);
          res.send("There was an error saving post.");
        });
      } else {
        boardData.threads.push(newThread);
        boardData.save().then(data => {
          console.log("new board data", data);
          res.json(newThread);
        }).catch(err => {
          console.log(err);
          res.send("There was an error saving post.");
        });
      }
    }).catch(() => res.send("Could not create board."));
  }).get((req, res) => {
    const board = req.params.board;
    BoardModel.findOne({ name: board }).then(data => {
      console.log("data", data);
        const threadsObj = data.threads.map(thread => {
          const {
            _id,
            text,
            created_on,
            bumped_on,
            reported,
            delete_password,
            replies
          } = thread;
          return {
            _id,
            text,
            created_on,
            bumped_on,
            reported,
            delete_password,
            replies,
            replycount: replies.length
          };
        });
        res.json(threadsObj);
    }).catch(() => res.json({ error: "No board with this name." }));
  }).put((req, res) => {
    console.log("put", req.body);
    const { report_id } = req.body;
    const board = req.params.board;
    BoardModel.findOne({ name: board }).then(boardData => {
      const date = new Date();
      let reportedThread = boardData.threads.id(report_id);
      reportedThread.reported = true;
      reportedThread.bumped_on = date;
      boardData.save()
      .then(() => res.send("Update successful"))
      .catch(() => res.json({error: "Could not update"}));
    }).catch(() => res.json({ error: "Board not found"}));
  })
  app.route('/api/replies/:board');
}
