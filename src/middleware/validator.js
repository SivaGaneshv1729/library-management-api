const validateBook = (req, res, next) => {
    const { isbn, title, author, total_copies } = req.body;
    
    if (!isbn || !title || !author || total_copies === undefined) {
        return res.status(400).json({ error: "Missing required book fields: isbn, title, author, total_copies" });
    }

    if (total_copies < 1) {
        return res.status(400).json({ error: "Total copies must be at least 1" });
    }
    
    next();
};

const validateMember = (req, res, next) => {
    const { name, email, membership_number } = req.body;
    
    if (!name || !email || !membership_number) {
        return res.status(400).json({ error: "Missing required member fields: name, email, membership_number" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    next();
};

module.exports = { validateBook, validateMember };