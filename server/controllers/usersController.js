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
        // const userResponse = user.toObject();
        // delete userResponse.password;
        delete user.password;

        // console.log("User created successfully:", userResponse);
        // return res.json({ status: true, user: userResponse });
        return res.json({ status: true, user});
    } catch (ex) {
        console.error("Error in register controller:", ex);
        next(ex);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username,  password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ msg: "Incorrect username or password", status: false });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid)
            return res.json({ msg: "Incorrect username or password", status: false });
        delete user.password;
        return res.json({ status: true, user});
    } catch (ex) {
        console.error("Error in register controller:", ex);
        next(ex);
    }
};


module.exports.setAvatar = async (req, res, next) => {
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        })

    }catch(ex){
        next(ex);
    }
};