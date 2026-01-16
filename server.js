const db = require('./config/db.config');
const express = require('express'); // Express library ko project me import kiya..
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();  // Express ka App object banaya..

const PORT = 3000;      // port number define kiya..

app.set('view engine', 'ejs');   // step-2

// call middleware
app.use(express.urlencoded({ extended: true }));

// middleware for static public & uploads
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

// Global Middleware: Har page par User ka data bhejne ke liye
app.use((req, res, next) => {
    // 'locals' ka matlab ye variable har EJS file me direct milega
    res.locals.user = req.cookies.adminData || null;
    res.set('Cache-Control', 'no-store'); // back browing lock
    next();
});

// Routes use karo
app.use('/', require('./routes/auth.route'));      // <-- Login ke liye (Sabse pehle check karega)
app.use('/', require('./routes/dashboard.route')); // <-- Dashboard ke liye

// server (PORT) start 🚀
app.listen(PORT, (error) => {
   if (error) {
    console.log("Sneat - Server does not statred", error);
    return false;
   }
   else {
    console.log(`Sneat - Server started at port : ${PORT}`);
   }
});