const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ Error: "Unauthorized" });
    }

    let secretKey;
    // Check the role based on the token type and set the appropriate secret key
    if (token.startsWith('USER_TOKEN')) {
        secretKey = process.env.USER_TOKEN;
    } else if (token.startsWith('ADMIN_TOKEN')) {
        secretKey = process.env.ADMIN_TOKEN;
    } else {
        return res.status(401).json({ Error: "Invalid token type" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: "Invalid token" });
        }

        // Attach user information to the request for further use
        req.user = decoded;

        // Check user role and restrict access to admin routes for 'user' role
        if (req.path.startsWith('/admin') && req.user.role !== 'admin') {
            return res.status(403).json({ Error: "Access forbidden for this role" });
        }

        next();
    });
};
