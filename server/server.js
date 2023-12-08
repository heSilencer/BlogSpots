import express, { response } from 'express';
import mysql from 'mysql';
import cors from 'cors'; 
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';

const salt = 10;
dotenv.config();

const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_DATABASE,
    // port: process.env.DB_PORT,

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydatabase'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database');
    } else {
        console.log('Connected to the database');
    }
});

app.post('/register', (req, res) => {
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    const checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
    const insertUserQuery = "INSERT INTO users (`name`, `username`, `birthdate`, `role`, `email`, `password`) VALUES (?)";

    // Check if the email already exists
    db.query(checkEmailQuery, [req.body.email], (errEmail, resultEmail) => {
        if (errEmail) {
            console.error("Error checking email:", errEmail);
            return res.status(500).json({ Error: "Internal Server Error" });
        }

        if (resultEmail.length > 0) {
            return res.json({ Status: "Email already exists" });
        }

        // Check if the username already exists
        db.query(checkUsernameQuery, [req.body.username], (errUsername, resultUsername) => {
            if (errUsername) {
                console.error("Error checking username:", errUsername);
                return res.status(500).json({ Error: "Internal Server Error" });
            }

            if (resultUsername.length > 0) {
                return res.json({ Status: "Username already exists" });
            }

            // Hash the password and insert the user into the database
            bcrypt.hash(req.body.password.toString(), salt, (hashErr, hash) => {
                if (hashErr) {
                    console.error("Error hashing password:", hashErr);
                    return res.status(500).json({ Error: "Internal Server Error" });
                }

                const values = [
                    req.body.name,
                    req.body.username,
                    req.body.birthdate,
                    req.body.role,
                    req.body.email,
                    hash
                ];

                // Insert the user into the database
                db.query(insertUserQuery, [values], (insertErr, insertResult) => {
                    if (insertErr) {
                        console.error("Error inserting user:", insertErr);
                        return res.status(500).json({ Error: "Internal Server Error" });
                    }

                    return res.json({ Status: "Success" });
                });
            });
        });
    });
});



app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Login error in server" });

        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" });

                if (response) {
                    const name = data[0].name;
                    const userRole = data[0].role;
                    if (userRole === 'admin') {
                        const token = jwt.sign({name}, process.env.SECRET_KEY , {expiresIn: '1d'});
                        res.cookie('token', token);
                        return res.json({ Status: "Success", Role: "admin" });
                    } else if (userRole === 'user') {
                        const token = jwt.sign({name}, process.env.SECRET_KEY , {expiresIn: '1d'});
                        res.cookie('token', token);
                        return res.json({ Status: "Success", Role: "user" });
                    } else {
                        return res.json({ Error: "Invalid user role" });
                    }
                } else {
                    return res.json({ Error: "Password not matched" });
                }
            });
        } else {
            return res.json({ Error: "No email existed" });
        }
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: 'Success' });
});

app.listen(3000, () => {
    console.log("Server is running...");
})
