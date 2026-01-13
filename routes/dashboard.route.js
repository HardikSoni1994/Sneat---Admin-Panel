const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');


const isLogin = (req, res, next) => {
    if(req.cookies.adminData) {
        next();
    } else {
        res.redirect('/');
    }
};

// Controller import kiya
const dashboardController = require('../controllers/dashboard.controller');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

// Admin route
router.get('/', dashboardController.dashboardPage);
router.get('/dashboard', isLogin, dashboardController.dashboardPage);
router.get('/addAdmin', isLogin, dashboardController.addAdminPage);
router.post('/insert-admin', upload.single('avatar'), dashboardController.insertAdmin);
router.get('/view-admin', isLogin, dashboardController.viewAdminPage);
router.get('/delete-admin/:id', dashboardController.deleteAdmin);
router.get('/edit-admin/:id', isLogin, dashboardController.editAdminPage);
router.post('/update-admin', upload.single('avatar'), dashboardController.updateAdmin);

// User route
router.get('/addUser', isLogin, dashboardController.addUserPage);
router.post('/insert-user', upload.single('avatar'), dashboardController.insertUser);
router.get('/view-user', isLogin, dashboardController.viewUserPage);
router.get('/delete-user/:id', dashboardController.deleteUser);
router.get('/edit-user/:id', isLogin, dashboardController.editUserPage);
router.post('/update-user', upload.single('avatar'), dashboardController.updateUser);

// Search Route
router.get('/search', isLogin, dashboardController.searchResult);

// Change Password Routes (Protected by isLogin)
router.get('/change-password', isLogin, dashboardController.changePasswordPage);
router.post('/change-password', isLogin, dashboardController.changePassword);

// my Profile Routes
router.get('/my-profile', isLogin, dashboardController.myProfilePage);
router.post('/update-my-profile', upload.single('image'), dashboardController.updateMyProfile); 

module.exports = router;