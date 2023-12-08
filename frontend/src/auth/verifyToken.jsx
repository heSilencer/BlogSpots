const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ Error: "Unauthorized" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: "Invalid token" });
        }

        // Attach user information to the request for further use
        req.user = decoded;
        next();
    });
};