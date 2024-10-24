const db = require('../db');
const { hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { SECRET } = require('../constants');
const { differenceInDays } = require('date-fns');

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
    const today = new Date();
    try {
        const hashedPassword = await hash(password, 10);

        await db.query('INSERT INTO users(email, password, username, last_login_date) VALUES($1, $2, $3, $4)', 
            [email, hashedPassword, username, today]
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
      const today = new Date();
      
      // Check the user's last login and login streak
      const userData = await db.query('SELECT last_login_date, login_streak FROM users WHERE user_id = $1', [user.user_id]);
      
      let lastLogin = userData.rows[0].last_login_date;
      let loginStreak = userData.rows[0].login_streak;
  
      // If user has logged in before, check the difference in days
      if (lastLogin) {
        const daysSinceLastLogin = differenceInDays(today, new Date(lastLogin));
  
        if (daysSinceLastLogin === 1) {
          // If it's the next day, increment the login streak
          loginStreak += 1;
        } else if (daysSinceLastLogin > 1) {
          // If it's more than 1 day, reset the streak
          loginStreak = 1;
        }
        // If they logged in the same day, do nothing with the streak
      } else {
        // First time login, initialize login streak
        loginStreak = 1;
      }
  
      // Update the user's last login date and login streak
      await db.query('UPDATE users SET last_login_date = $1, login_streak = $2 WHERE user_id = $3', [today, loginStreak, user.user_id]);
  
      // Generate token for login
      const token = await sign(payload, SECRET);
  
      return res.status(200).cookie('token', token, {httpOnly: true}).json({
        success: true,
        message: 'Logged in successfully',
        loginStreak: loginStreak // Return the updated login streak
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: err.message
      });
    }
  };

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
            courses: user.rows[0].courses
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
    try {
        await db.query('UPDATE users SET courses = $1 WHERE user_id = $2', 
            [courses, identifier.id]
        );
        console.log(req.body);
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

exports.getStreak = async (req, res) => {
    const userId = req.user.id; // Assuming you have middleware to extract the user's ID
  
    try {
      const user = await db.query('SELECT login_streak FROM users WHERE user_id = $1', [userId]);
      
      if (user.rows.length > 0) {
        return res.status(200).json({ loginStreak: user.rows[0].login_streak });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching login streak' });
    }
  }
  