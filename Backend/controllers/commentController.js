import { pool } from "../config/config.js";

export const get_comments = async function (req, res) {
    try {
        const { postId } = req.params;

        const result = await pool.query(
            `SELECT 
                c.id, c.body, c.created_at,
                u.email AS author
             FROM comments c
             JOIN users u ON u.id = c.user_id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC`,
            [postId]
        );

        return res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to fetch comments" });
    }
}

export const add_comment = async function (req, res) {
    try {
        const { postId } = req.params;
        const { body } = req.body;
        const userId = req.user.userId;

        const result = await pool.query(
            `INSERT INTO comments(post_id, user_id, body)
             VALUES($1, $2, $3)
             RETURNING id, body, created_at`,
            [postId, userId, body]
        );

        return res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to add comment" });
    }
}

export const delete_comment = async function (req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const result = await pool.query(
            `DELETE FROM comments WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Comment not found or unauthorized" });
        }

        return res.status(200).json({ success: true, message: "Comment deleted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to delete comment" });
    }
}