import bcrypt from "bcrypt";
import { saltRounds, pool } from "../config/config.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

export const login_credential = async function (req, res, next) {
    try {
        const { email, password, type } = req.body;

        if (type === 'Sign-In') {
            const result = await pool.query(
                "SELECT id, email, password FROM users WHERE email = $1",
                [email]
            );
            if (result.rows.length === 0) {
                return res.status(401).json({ success: false, message: "User not found" });
            }

            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Wrong password" });
            }

            const access_token = generateAccessToken(user.id, user.email);
            const refresh_token = generateRefreshToken(user.id);

            await pool.query(
                "UPDATE users SET refresh_token = $1 WHERE id = $2",
                [refresh_token, user.id]
            );

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                success: true,
                access_token,
                user: { id: user.id, email: user.email }
            });
        }

        else if (type === 'Sign-Up') {
            const existing = await pool.query(
                "SELECT email FROM users WHERE email = $1",
                [email]
            );
            if (existing.rows.length > 0) {
                return res.status(400).json({ success: false, output: true });
            }

            const hash = await bcrypt.hash(password, saltRounds);
            const newUser = await pool.query(
                "INSERT INTO users(email, password) VALUES($1, $2) RETURNING id, email",
                [email, hash]
            );
            const user = newUser.rows[0];

            const refresh_token = generateRefreshToken(user.id);
            const access_token = generateAccessToken(user.id, user.email);

            await pool.query(
                "UPDATE users SET refresh_token = $1 WHERE id = $2",
                [refresh_token, user.id]
            );

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                success: true,
                output: false,
                access_token,
                user: { id: user.id, email: user.email }
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
}

export const deleteuser = async function (req, res, next) {
    try {
        const token = req.cookies.refresh_token;
        if (!token) return res.status(401).json({ message: "Logged Out" });

        await pool.query(
            "UPDATE users SET refresh_token = null WHERE refresh_token = $1",
            [token]
        );

        res.clearCookie('refresh_token');
        return res.status(200).json({ message: "Logged Out" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
}