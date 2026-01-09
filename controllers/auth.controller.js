const Admin = require('../models/admin.model'); // model import


// 1. Login Page
const loginPage = (req, res) => {
    if(req.cookies.adminData) {
        return res.redirect('/dashboard');
    }
    res.render('auth/login');
}

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email: email });

        if (!admin) {
            console.log("Email not found!");
            return res.redirect('/');
        }

        if (admin.password != password) {
            console.log("Password wrong!");
            return res.redirect('/');
        }

        // COOKIE

        res.cookie('adminData', admin); 

        console.log("Login Success!");
        return res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
};

// Logout Function
const logout = (req, res) => {
    res.clearCookie('adminData');
    res.redirect('/');
};

// 1. Register Page
const registerPage = (req, res) => {
    res.render('auth/register');
}

// 2. Register User Logic
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check: Email pehle se hai ya nahi
        const existingUser = await Admin.findOne({ email: email });
        
        if (existingUser) {
            console.log("Email already exists!");
            return res.redirect('/'); 
        }

        // Naya Admin banao (Missing fields ke sath)
        const newAdmin = new Admin({
            name: name,
            email: email,
            password: password,
            
            // ✅ Fix: Ye fields required hain, isliye default value de di
            image: "",       
            city: "Surat",   
            phone: "0000000000", 
            
            role: "Admin"
        });

        await newAdmin.save();
        console.log("User Registered Successfully!");
        
        return res.redirect('/'); // Ab Login page par jayega

    } catch (error) {
        console.log(error); // Error terminal me dikhega
        return res.redirect('/register'); // Error aayi to wapis register par
    }
};

// 1. Forget Password Page Show Karo
const forgetPasswordPage = (req, res) => {
    return res.render('auth/forgetPassword');
}

// 2. Generate OTP Logic
const generateOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // A. Check karo user hai ya nahi
        const user = await Admin.findOne({ email: email });

        if (!user) {
            console.log("User not found!");
            return res.redirect('/forget-password');
        }

        // B. OTP Generate (Random 6 digit)
        const otp = Math.floor(100000 + Math.random() * 900000);
        
        // stored in database
        await Admin.findByIdAndUpdate(user._id, { otp: otp });

        // D. Console show
        console.log("Apka OTP hai: " + otp);

        res.cookie('userEmail', email);

        return res.redirect('/otp-verify'); 

    } catch (error) {
        console.log(error);
        return res.redirect('/forgot-password');
    }
};

    // 3. OTP Page
const otpPage = (req, res) => {
    return res.render('auth/otp');
}

// 4. Verify OTP Logic 
const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const cookieEmail = req.cookies.userEmail; // Email cookie se lo

        if (!cookieEmail) {
            console.log("Session Expired!");
            return res.redirect('/forgot-password');
        }

        // Database me check karo
        const user = await Admin.findOne({ email: cookieEmail });

        if (user.otp == otp) {
            console.log("OTP Match! ✅");
            res.clearCookie('userEmail'); // Kaam ho gaya, purani cookie hata do
            res.cookie('id', user._id);   // ID save kar lo password reset ke liye
            
            // Abhi 'reset-password' page nahi bana, par hum redirect wahin karenge
            return res.redirect('/reset-password'); 
        } else {
            console.log("Wrong OTP! ❌");
            return res.redirect('/otp-verify');
        }

    } catch (error) {
        console.log(error);
        return res.redirect('/otp-verify');
    }
}

module.exports = { loginPage, loginAdmin, logout, registerPage, registerUser, forgetPasswordPage, generateOtp, otpPage, verifyOtp };