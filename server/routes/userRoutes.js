const {
  register,
  login,
  setAvatar,
  getAllUsers,
  searchUsers,
  sendFriendRequest,
  getFriendRequests,
  respondToRequest,
} = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.get("/searchusers/:username", searchUsers);
router.post("/friendrequest", sendFriendRequest);
router.get("/friendrequests/:id", getFriendRequests);
router.post("/friendrequest/respond", respondToRequest);

module.exports = router;
