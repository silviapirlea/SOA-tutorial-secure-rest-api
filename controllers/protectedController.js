exports.getSecretData = (req, res) => {
    res.json({ message: 'This is protected data', userId: req.userId });
};
