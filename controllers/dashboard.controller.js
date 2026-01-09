const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');

// dashboardPage step-6
const dashboardPage = (req, res) => {
    res.render('dashboard/index', { page: 'dashboard' });
};

const addAdminPage = (req, res) => {
    res.render('dashboard/addAdmin', { page: 'addAdmin'});
};

// Admin Controller Logic
// Insert Admin Data
const insertAdmin = async (req, res) => {
    try {
        let image = "";
        if (req.file) {
            image = req.file.filename;
        }

        const { name, email, password, city, contact, phone } = req.body;

        await Admin.create({
            name: name,
            email: email,
            password: password,
            city: city,
            contact: contact,
            phone: phone,
            image: image
        });

        console.log("Admin Data Added Successfully! ✅");
        res.redirect('/addAdmin'); 

    } catch (error) {
        console.log("Error inserting data: ", error);
    }
};

// View Admin
const viewAdminPage = async (req, res) => {
    try {
        const data = await Admin.find({}); 
        res.render('dashboard/viewAdmin', { data, page: 'viewAdmin' });
    } catch (error) {
        console.log(error);
    }
};

// Delete Admin

const deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await Admin.findById(id);

        if (data) {

            const image = path.join('public/uploads', data.image);

            fs.unlink(image, (err) => {
                if (err) {
                    console.log("Image Deletion failed..", err);
                } else {
                    console.log("Image Deleted Successfully! 🗑️");
                }
            });

            await Admin.findByIdAndDelete(id);
            
            console.log("Admin Record Deleted Successfully! ✅");
            res.redirect('/view-admin');
        } else {
            console.log("Admin record nahi mila");
            res.redirect('/view-admin');
        }

    } catch (error) {
        console.log("Delete error:", error);
    }
};

// Edit Admin
const editAdminPage = async (req, res) => {
    try {
        const data = await Admin.findById(req.params.id);
        
        res.render('dashboard/editAdmin', { data, page: 'viewAdmin' }); 
        
    } catch (error) {
        console.log(error);
    }
};

// Update Admin
const updateAdmin = async (req, res) => {
    try {
        const { id, name, email, password, city, contact, phone } = req.body;

        const oldData = await Admin.findById(id);

        if (!oldData) {
            console.log("Record not found");
            return res.redirect('/view-admin');
        }

        let image = oldData.image;

        if (req.file) {
            image = req.file.filename;

            const oldImage = path.join('public/uploads', oldData.image);

            fs.unlink(oldImage, (err) => {
                if (err) {
                    console.log("Old Image Deletion failed..", err);
                } else {
                    console.log("Old Image Deleted Successfully! 🗑️");
                }
            });
        }

        // Database Update
        await Admin.findByIdAndUpdate(id, {
            name: name,
            email: email,
            password: password,
            city: city,
            contact: contact,
            phone: phone,
            image: image
        });

        console.log("Admin Data Updated Successfully! ✅");
        res.redirect('/view-admin');

    } catch (error) {
        console.log("Update error:", error);
    }
};

// USER Controller Logic START 
const addUserPage = (req, res) => {
    res.render('dashboard/addUser', {page: 'addUser'});
};

// Insert User Data
const insertUser = async (req, res) => {
    try {
        let image = "";
        if (req.file) {
            image = req.file.filename;
        }
        const { username, email, password, phone, city } = req.body;
        await User.create({
            username: username,
            email: email,
            password: password,
            phone: phone,
            city: city,
            user_image: image
        });

        console.log("User Added Successfully! ✅");
        res.redirect('/addUser'); 

    } catch (error) {
        console.log(error);
    }
};

// View User Page
const viewUserPage = async (req, res) => {
    try {
        const data = await User.find({});
        res.render('dashboard/viewUser', { data, page: 'viewUser' });
    } catch (error) {
        console.log(error);
    }
};

// Delete User Function
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await User.findById(id);

        if (data) {

            const image = path.join('public/uploads', data.user_image);
            
            fs.unlink(image, (err) => {
                if (err) {
                    console.log("User Image delete error:", err);
                }    
                else {
                    console.log("User Image Deleted! 🗑️");
                }
            });

            // 3. Data Delete from Database
            await User.findByIdAndDelete(id);
            
            console.log("User Deleted Successfully! ✅");
            res.redirect('/view-user');
        } else {
            console.log("User not found");
            res.redirect('/view-user');
        }

    } catch (error) {
        console.log(error);
    }
};

// Edit User Page
const editUserPage = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await User.findById(id);
        res.render('dashboard/editUser', { data, page: 'viewUse' });
    } catch (error) {
        console.log(error);
    }
};

// Update User Data
const updateUser = async (req, res) => {
    try {
        const { id, username, email, password, phone, city } = req.body;

        const oldData = await User.findById(id);

        let image = oldData.user_image; 

        if (req.file) {
            image = req.file.filename;

            const oldImage = path.join('public/uploads', oldData.user_image);
            
            fs.unlink(oldImage, (err) => {
                if (err) console.log("Old user Image Deletion failed..:", err);
                else console.log("Old User Image Deleted! 🗑️");
            });
        }

        // 3. Database Update
        await User.findByIdAndUpdate(id, {
            username: username,
            email: email,
            password: password,
            phone: phone,
            city: city,
            user_image: image
        });

        console.log("User Updated Successfully! ✅");
        res.redirect('/view-user');

    } catch (error) {
        console.log(error);
    }
};

// Simple Backend Search Function
const searchResult = async (req, res) => {
    try {
        const query = req.query.q; // Form se jo naam aya
        
        // 1. Admins Table me dhundo (Bilkul same naam hona chahiye)
        const admins = await Admin.find({ 
            name: query 
        });

        // 2. Users Table me dhundo (Bilkul same username hona chahiye)
        const users = await User.find({ 
            username: query 
        });

        // 3. Result Page par bhej do
        res.render('dashboard/searchResults', { 
            admins, 
            users,
            query 
        });
        
    } catch (error) {
        console.log(error);
    }
}


// Admin & User data exports
module.exports = {dashboardPage, addAdminPage, insertAdmin, viewAdminPage, deleteAdmin, editAdminPage, updateAdmin, addUserPage, insertUser, viewUserPage, deleteUser, editUserPage, updateUser, searchResult};   // step-7

