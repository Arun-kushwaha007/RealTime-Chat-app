const User = require("../model/userModel");
const bcrypt = require("bcrypt");
 
module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        
        if (username.length < 3)
            return res.json({ msg: "Username should be at least 3 characters long.", status: false });
        if (password.length < 8)
            return res.json({ msg: "Password should be at least 8 characters long.", status: false });
        if (!email)
            return res.json({ msg: "Email is required.", status: false });

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
        const userObj = user.toObject();
        delete userObj.password;

        return res.json({ status: true, user: userObj });
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
        const userObj = user.toObject();
        delete userObj.password;
        return res.json({ status: true, user: userObj });
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

module.exports.getAllUsers = async(req, res, next) =>{
    try{
        const users = await User.find({ _id: {$ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    }catch (ex){
        next(ex);
    }
};