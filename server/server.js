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
// Updated CORS middleware
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  };
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database');
    } else {
        console.log('Connected to the database');
    }
});
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ Error: 'Unauthorized' });
    }
  
    let secretKey;
    if (token.startsWith('USER_TOKEN')) {
      secretKey = process.env.USER_TOKEN_SECRET;
    } else if (token.startsWith('ADMIN_TOKEN')) {
      secretKey = process.env.ADMIN_TOKEN_SECRET;
    } else {
      return res.status(401).json({ Error: 'Invalid token type' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ Error: 'Invalid token' });
      }
  
      req.user = decoded;
  
      if (req.path.startsWith('/admin') && req.user.role !== 'admin') {
        return res.status(403).json({ Error: 'Access forbidden for this role' });
      }
  
      next();
    });
  };
// Registration
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
//Login
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

                    // Set the appropriate secret key based on the user role
                    let secretKey;
                    if (userRole === 'admin') {
                        secretKey = process.env.ADMIN_TOKEN;
                    } else if (userRole === 'user') {
                        secretKey = process.env.USER_TOKEN;
                    } else {
                        return res.json({ Error: "Invalid user role" });
                    }
                    
                    // Sign the token using the selected secret key and include role information
                    const token = jwt.sign({ name, role: userRole }, secretKey, { expiresIn: '1d' });
                    res.cookie('token', token);

                    return res.json({ Status: "Success", Role: userRole });
                } else {
                    return res.json({ Error: "Password not matched" });
                }
            });
        } else {
            return res.json({ Error: "No email existed" });
        }
    });
});

//Logout
app.post('/logout', (req, res) => {
    res.cookie('token', '', { expires: new Date(0) });
    return res.json({ Status: 'Success' });
});
//get all user
app.get('/data', (req, res) => {
    const query = 'SELECT * FROM users'; // Replace with your actual table name
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      res.json(result);
    });
  });
//get Content
app.get('/content', (req, res) => {
    const query = 'SELECT * FROM content';
    
    db.query(query, (err, result) => {
        if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
        }
    
        res.json(result);
        });
    });
//add Content
app.post('/add_content', async (req, res) => {
    const checkContentQuery = "SELECT * FROM content WHERE title = ?";
    const insertContentQuery = "INSERT INTO content (`title`, `description`, `author`, `image`) VALUES (?)";
  
    try {
      // Check if the product name already exists
      db.query(checkContentQuery, [req.body.title], (errtitle, resultTitle) => {
        if (errtitle) {
          console.error("Error checking content name:", errtitle);
          return res.status(500).json({ Error: "Internal Server Error" });
        }
  
        if (resultTitle.length > 0) {
          return res.json({ Status: "Content name already exists" });
        }
  
        // Product name doesn't exist, proceed to insert the product into the database
        const values = [
          req.body.title,
          req.body.description,
          req.body.author,
          req.body.image,
        ];
  
        // Insert the product into the database
        db.query(insertContentQuery, [values], (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting content:", insertErr);
            return res.status(500).json({ Error: "Internal Server Error" });
          }
  
          return res.status(201).json({ Status: "Content added successfully" });
        });
      });
    } catch (error) {
      console.error('Error adding content:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
});
app.delete('/delete/:itemType/:itemId', (req, res) => {
    const { itemType, itemId } = req.params;
    let tableName;

    if (itemType === 'user') {
        tableName = 'users';
    } else if (itemType === 'content') {
        tableName = 'content';
    } else {
        return res.status(400).json({ Error: 'Invalid item type' });
    }

    const deleteQuery = `DELETE FROM ${tableName} WHERE ${itemType === 'user' ? 'id' : 'id'} = ?`;

    db.query(deleteQuery, [itemId], (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            return res.status(500).json({ Error: 'Internal Server Error' });
        }

        return res.json({ Status: 'Item deleted successfully' });
    });
});



// Update content
app.put('/update_content/:contentId', verifyToken, (req, res) => {
  console.log('Received update request with headers:', req.headers);
  const contentId = req.params.contentId;
  const updateQuery = "UPDATE content SET title = ?, description = ?, author = ?, image = ? WHERE id = ?";

  const values = [
      req.body.title,
      req.body.description,
      req.body.author,
      req.body.image,
      contentId
  ];

  db.query(updateQuery, values, (updateErr, updateResult) => {
      if (updateErr) {
          console.error("Error updating content:", updateErr);
          return res.status(500).json({ Error: "Internal Server Error" });
      }

      return res.json({ Status: "Content updated successfully" });
  });
});


//navagite to read More
app.get('/content/:contentId', (req, res) => {
    const contentId = req.params.contentId;
    const query = 'SELECT * FROM content WHERE id = ?';

    db.query(query, [contentId], (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (result.length === 0) {
            res.status(404).json({ error: 'Content not found' });
            return;
        }

        res.json(result[0]); // Return the first (and only) result
    });
});


////Adding comment
// Import the authenticateUser middleware
const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.USER_TOKEN);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
  
  // ...
  
  // Adding comment
//   app.post('/add_comment/:contentTitle', authenticateUser, (req, res) => {
//     const { contentId } = req.params;
//     const { comment } = req.body;
  
//     const { name } = req.user;
  
//     const insertCommentQuery = "INSERT INTO comments (`content_id`, `user_name`, `comment_text`) VALUES (?, ?, ?)";
  
//     db.query(insertCommentQuery, [contentId, name, comment], (insertErr, insertResult) => {
//       if (insertErr) {
//         console.error("Error inserting comment:", insertErr);
//         return res.status(500).json({ Error: "Internal Server Error" });
//       }
  
//       return res.json({ Status: "Success", message: "Comment added successfully"});
//     });
//   });
  ////get comments

  // Modify the existing route to fetch comments for a content
app.get('/comments/:contentId', (req, res) => {
    const { contentId } = req.params;
    const getCommentsQuery = "SELECT comments.*, users.name AS user_name FROM comments INNER JOIN users ON comments.user_id = users.id WHERE comments.content_id = ?";
  
    // Fetch comments with user information from the database
    db.query(getCommentsQuery, [contentId], (err, result) => {
      if (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      res.json(result);
    });
});

  

  
app.listen(3000, () => {
    console.log("Server is running...");
})
