const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        console.log("Received registration request:", req.body);
        
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            console.log("Username already used");
            return res.json({ msg: "Username already used", status: false });
        }

        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            console.log("Email already used");
            return res.json({ msg: "Email already used", status: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Avoid sending the password back in the response
        const userResponse = user.toObject();
        delete userResponse.password;

        console.log("User created successfully:", userResponse);
        return res.json({ status: true, user: userResponse });
    } catch (ex) {
        console.error("Error in register controller:", ex);
        next(ex);
    }
};
