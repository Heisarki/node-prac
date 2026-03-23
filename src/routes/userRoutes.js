const { Router } = require("express");
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
} = require("../controllers/userController");
const { authenticateToken } = require("../auth/authHelper");

const router = Router();

router.get("/", authenticateToken, getUsers);
router.get("/:id", authenticateToken, getUserById);
router.post("/", createUser);         // No auth — registration
router.post("/login", loginUser);     // No auth — login, returns accessToken
router.patch("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

module.exports = router;
