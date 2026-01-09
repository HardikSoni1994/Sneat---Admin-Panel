const db = require('./config/db.config');
const express = require('express'); // Express library ko project me import kiya..
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();  // Express ka App object banaya..

const PORT = 3000;      // port number define kiya.. (Browser isi port se connect karega..)

app.set('view engine', 'ejs');   // step-2

// middleware for static public & uploads
app.use(express.static(path.join(__dirname, 'public')));

// call middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global Middleware: Har page par User ka data bhejne ke liye
app.use((req, res, next) => {
    // 'locals' ka matlab ye variable har EJS file me direct milega
    res.locals.user = req.cookies.adminData || null; 
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