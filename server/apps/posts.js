import { Router } from "express";
import { pool } from "../utils/db.js";

const postRouter = Router();

postRouter.get("/", async (req, res) => {
  const keywords = req.query.keywords || "";
  const category = req.query.category || "";
  const page = req.query.page || 1;
  // console.log(keywords);
  let query = "";
  let values = [];

  const PAGE_SIZE = 20;
  const offset = (page - 1) * PAGE_SIZE;

  if (keywords && category) {
    query =
      "select * from posts where title =$1 and category =$2 limit $3 offset $4";
    values = [keywords, category, PAGE_SIZE, offset];
  } else if (keywords) {
    query = "select * from posts where title =$1 limit $2 offset $3";
    values = [keywords, PAGE_SIZE, offset];
  } else if (category) {
    query = "select * from posts where category =$1 limit $2 offset $3";
    values = [category, PAGE_SIZE, offset];
  } else {
    query = "select * from posts limit $1 offset $2";
    values = [PAGE_SIZE, offset];
  }

  // const results = await pool.query("select * from posts", []);
  const results = await pool.query(query, values);

  return res.json({
    data: results.rows,
  });
});

postRouter.get("/:id", async (req, res) => {
  const postId = req.params.id;
  const result = await pool.query("select * from posts where post_id = $1", [
    postId,
  ]);

  return res.json({
    data: result.rows[0],
  });
});

postRouter.post("/", async (req, res) => {
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };

  await pool.query(
    `insert into posts (user_id, title, content, likes, category, created_at, updated_at)
  values ($1, $2, $3, $4, $5, $6, $7)`,
    [
      // 1,
      newPost.user_id,
      newPost.title,
      newPost.content,
      newPost.likes,
      newPost.category,
      newPost.created_at,
      newPost.updated_at,
    ]
  );

  return res.json({
    message: "Post has been created.",
  });
});

// postRouter.post("/comments", async (req, res) => {
//   const newComment = {
//     ...req.body,
//     created_at: new Date(),
//     updated_at: new Date(),
//   };

//   await pool.query(
//     `insert into comments (user_id, post_id, comment, likes,created_at, updated_at)
//   values ($1, $2, $3, $4, $5 ,$6)`,
//     [
//       1,
//       1,
//       newComment.comment,
//       newComment.likes,
//       newComment.created_at,
//       newComment.updated_at,
//     ]
//   );
//   return res.json({
//     message: "Comment has been created.",
//   });
// });

postRouter.put("/:id", async (req, res) => {
  const updatedPost = {
    ...req.body,
    updated_at: new Date(),
  };
  const postId = req.params.id;
  // console.log(postId)

  await pool.query(
    `UPDATE posts
      SET title = $2,
      content= $3,
      likes=$4,
      updated_at=$5, 
      category=$6
      WHERE post_id = $1`,
    [
      postId,
      updatedPost.title,
      updatedPost.content,
      updatedPost.likes,
      updatedPost.updated_at,
      updatedPost.category,
    ]
  );
  return res.json({
    message: `Post ${postId} has been updated.`,
  });
});


// postRouter.put("/a/:id", async (req, res) => {
//   const updatedComment = {
//     ...req.body,
//     updated_at: new Date(),
//   };
//   const commentId = req.params.id;
//   console.log(updatedComment)

//   await pool.query(
//     `UPDATE comments
//       SET comment = $2 
//       WHERE comment_id = $1`,
//     [
//       commentId,
//       updatedComment.comment,
     
//     ]
//   );
//   return res.json({
//     message: `Comment ${commentId} has been updated.`,
//   });
// });

postRouter.delete("/:id", async (req, res) => {
  const postId = req.params.id;

  await pool.query(`DELETE FROM posts WHERE post_id  =  $1`, [
    postId,
  ]);

  return res.json({
    message: `Post ${postId} has been deleted.`,
  });
});

export default postRouter;
