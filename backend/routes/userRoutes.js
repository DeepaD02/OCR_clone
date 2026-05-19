const express = require("express");
const router = express.Router();

const {
  viewUsers,
  addUser,
  editUser,
  deleteUser,
  filterUsers,
  exportUsers,
} = require("../controllers/userController");

// Add team controller
const {
  getProjectHeads,
  getTeamLeads,
} = require("../controllers/addteamController");

router.get("/filter", filterUsers);
router.get("/export", exportUsers);
router.get("/", viewUsers);
router.post("/", addUser);
router.patch("/:id", editUser);
router.delete("/:id", deleteUser);

// Addteam users projecthead and lead
router.get("/project-heads", getProjectHeads);
router.get("/team-leads", getTeamLeads);

module.exports = router;
