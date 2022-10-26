import { Router } from "express";
import { pool } from "../utils/db.js";

const commentRouter = Router();

commentRouter.post("/", async (req, res) => {
  const newComment = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };

  await pool.query(
    `insert into comments (user_id, post_id, comment, likes,created_at, updated_at)
  values ($1, $2, $3, $4, $5 ,$6)`,
    [
      // 1,
      // 1,
      newComment.user_id,
      newComment.post_id,
      newComment.comment,
      newComment.likes,
      newComment.created_at,
      newComment.updated_at,
    ]
  );
  return res.json({
    message: "Comment has been created.",
  });
});

commentRouter.put("/:id", async (req, res) => {
  const updatedComment = {
    ...req.body,
    updated_at: new Date(),
  };
  const commentId = req.params.id;
  console.log(updatedComment)

  await pool.query(
    `UPDATE comments
      SET comment = $2 
      WHERE comment_id = $1`,
    [
      commentId,
      updatedComment.comment,
     
    ]
  );
  return res.json({
    message: `Comment ${commentId} has been updated.`,
  });
});

commentRouter.delete("/:id", async (req, res) => {
  const commentId = req.params.id;

  await pool.query(`DELETE FROM comments WHERE comment_id  =  $1`, [
  commentId,
  ]);

  return res.json({
    message: `Comment ${commentId} has been deleted.`,
  });
});

export default commentRouter;
