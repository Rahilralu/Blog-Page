import { pool } from "../config/config.js";
import { generateSlug } from "../utils/slugify.js";

export const create_post = async function (req,res,next) {
    try{
        const { title,content,published } = req.body;
        const userId = req.user.userId;
        const slug = `${generateSlug(title)}-${userId}`;
        const newPost = await pool.query(
            "INSERT INTO posts(user_id,title,slug,content,published) VALUES($1, $2, $3, $4, $5) RETURNING id,slug,created_at",
            [userId,title,slug,content,published]
        );
        const post = newPost.rows[0]

        return res.status(201).json({success: true,data: post});
    }
    catch(err){
        if(err.code === '23505'){
            return res.status(409).json({success: false, message: "Post with similar title already exists"})
        }
        console.error(err);
        return res.status(500).json({success: false , message: "Error in adding the post"});
    }
}

export const update_post = async function (req,res,next) {
    try{
        const { title,content } = req.body;
        const userId = req.user.userId;
        const id = req.params.id
        const updatepost = await pool.query(
            "UPDATE posts SET title = COALESCE($1, title),content = COALESCE($2, content),updated_at = now() where id = $3 and user_id = $4 RETURNING id,slug,updated_at",
            [title,content,id,userId]
        );

        if(updatepost.rows.length === 0){
            return res.status(404).json({success : false,message : "Post not found or unauthorized"})
        }
        const post = updatepost.rows[0]
        return res.status(200).json({success: true,data: post});
    }
    catch(err){
        if(err.code === '23505'){
            return res.status(409).json({success: false, message: "Duplicate value (slug already exists)"})
        }
        console.error(err);
        return res.status(500).json({success: false , message: "Error in updating the post"});
    }
}

export const delete_post = async function (req,res) {
    try{
        const id = req.params.id
        const userId = req.user.userId;

        const deletepost = await pool.query(
            "DELETE FROM posts where id = $1 and user_id = $2",
            [id,userId]
        );
        if(deletepost.rowCount === 0){
            return res.status(404).json({
                success: false,
                message: "Post not found or unauthorized"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        })

    }
    catch(err){
        console.error(err);
        return res.status(500).json({success:false,message:"Error deleting post"})
    }
}

export const get_all_posts = async function (req, res, next) {
    try{
        const result = await pool.query(
                    "SELECT * FROM posts order by created_at desc"
                );   
        return res.status(200).json({
            success: true,
            data :result.rows
        })
    }     
    catch(err){
        console.error(err);
        return res.status(500).json({success:false,message:"Failed to fetch posts"});
    }   

}
