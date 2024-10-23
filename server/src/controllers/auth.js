const db = require('../db');
const { hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { SECRET } = require('../constants');

exports.getUsers = async (req, res) => {
    try {
        const {rows} = await db.query('SELECT user_id, email FROM users');
        return res.status(200).json({
            sucess: true,
            users: rows
        })
    } catch (err) {
        console.error(err);
    }
}

exports.register = async (req, res) => {
    const {email, password, username} = req.body;
    try {
        const hashedPassword = await hash(password, 10);

        await db.query('INSERT INTO users(email, password, username) VALUES($1, $2, $3)', 
            [email, hashedPassword, username]
        );

        return res.status(200).json({
            success: true,
            message: 'The registration was sucessful'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err.message
        });
    }
}

exports.login = async (req, res) => {
let user = req.user;
let payload = {
    id: user.user_id,
    email: user.email
}

    try {
        const token = await sign(payload, SECRET);

        return res.status(200).cookie('token', token, {httpOnly: true}).json({
            success: true,
            message: 'Logged in succesfully'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: error.message
        });
    }
}

exports.protected = async (req, res) => {
    let identifier = {
        id: req.user.id,
        email: req.user.email
    }
    try {
        const user = await db.query('SELECT * FROM users WHERE user_id = $1', 
            [identifier.id]
        );
        return res.status(200).json({
            info: user.rows[0].username
        })
    } catch (err) {
        console.error(err);
    }
}

exports.logout = async (req, res) => {
    try {
        return res.status(200).clearCookie('token', {httpOnly: true}).json({
            success: true,
            message: 'Logged out succesfully'
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        })
    }
}

exports.getCourses = async (req, res) => {
    let identifier = {
        id: req.user.id,
        email: req.user.email
    }
    try {
        const user = await db.query('SELECT * FROM users WHERE user_id = $1', 
            [identifier.id]
        );

        return res.status(200).json({
            info: user.rows[0].courses
        })
    } catch (err) {
        console.error(err);
    }
}

exports.addCourses = async (req, res) => {
    let identifier = {
        id: req.user.id,
        email: req.user.email
    }
    const {courses} = req.body
    console.log(courses)
    try {

        await db.query('UPDATE users SET courses = $1 WHERE user_id = $2', 
            [courses, identifier.id]
        );
        return res.status(200).json({
            success: true,
            message: 'Course added'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err.message
        });
    }
}