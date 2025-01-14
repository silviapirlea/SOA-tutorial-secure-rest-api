# Securing a REST API with JSON Web Tokens (JWTs)

This tutorial will guide you through implementing authentication and authorization for a REST API using JSON Web Tokens (JWTs). A working example can be found in the following GitHub repository: [SecuringRESTAPI-JWT](https://github.com/silviapirlea/SOA-tutorial-secure-rest-api).

---

## **1. Overview**

Securing APIs is essential to prevent unauthorized access and ensure data integrity. JWTs are a compact and self-contained way to transmit data between parties securely. This tutorial demonstrates:

1. How to create a REST API.
2. Implementing user authentication.
3. Generating and validating JWTs for secure access.

### **Pre-requisites**
- Basic understanding of REST APIs.
- Node.js and npm installed on your system.
- Postman or any API testing tool.

---

## **2. Setting Up the Project**

### **Step 1: Initialize a Node.js Project**
Run the following commands to create a project directory and initialize it:
```bash
mkdir secure-rest-api
cd secure-rest-api
npm init -y
```

### **Step 2: Install Dependencies**
Install essential packages:
```bash
npm install express jsonwebtoken bcryptjs dotenv body-parser
npm install --save-dev nodemon
```

### **Step 3: Configure Directory Structure**
Create the following file structure:
```
secure-rest-api/
├── .env
├── app.js
├── routes/
│   ├── auth.js
│   └── protected.js
├── controllers/
│   ├── authController.js
│   └── protectedController.js
└── utils/
    └── verifyToken.js
```

---

## **3. Implementing Authentication**

### **Step 1: Set Up the Environment**
Create a `.env` file to store environment variables securely:
```plaintext
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

### **Step 2: Creating the Server**
In `app.js`, set up the Express server:
```javascript
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### **Step 3: Creating the Authentication Route**
In `routes/auth.js`:
```javascript
const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);

module.exports = router;
```

In `controllers/authController.js`:
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const users = [
    { id: 1, username: 'user1', password: bcrypt.hashSync('password123', 10) },
];

exports.login = (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    res.json({ token });
};
```

---

## **4. Protecting the API with JWTs**

### **Step 1: Create the Middleware**
In `utils/verifyToken.js`:
```javascript
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
};
```

### **Step 2: Creating Protected Routes**
In `routes/protected.js`:
```javascript
const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { getSecretData } = require('../controllers/protectedController');
const router = express.Router();

router.get('/data', verifyToken, getSecretData);

module.exports = router;
```

In `controllers/protectedController.js`:
```javascript
exports.getSecretData = (req, res) => {
    res.json({ message: 'This is protected data', userId: req.userId });
};
```

---

## **5. Testing the Implementation**

1. **Login**: Use Postman to send a `POST` request to `/auth/login` with:
   ```json
   {
       "username": "user1",
       "password": "password123"
   }
   ```
   Copy the token from the response.

2. **Access Protected Data**: Use the token in the `Authorization` header to send a `GET` request to `/protected/data`:
   ```json
   Authorization: Bearer <your-token>
   ```

3. **Observe the Response**: If authenticated, you’ll receive the protected data.

---

## **6. Enhancements and Best Practices**

1. **Use HTTPS**: Always use HTTPS in production to secure token transmission.
2. **Token Expiry**: Implement token refresh for seamless user experience.
3. **Error Handling**: Provide detailed and user-friendly error messages.
4. **Role-based Access Control**: Extend JWT claims to manage roles and permissions.

---

## **Conclusion**

By implementing JWT-based authentication, you’ve secured your REST API against unauthorized access. You can expand this setup to include user registration, token refresh, and advanced access controls. 

---

# Additional Setup and Usage Steps


### Start the Server

#### Using Nodemon (Recommended)
```bash
npx nodemon app.js
```

#### Using Node
```bash
node app.js
```

You should see the following output in the terminal:
```plaintext
Server running on port 3000
```

