const express = require("express");
const router = express.Router();

const {
  addTeam,
  viewTeam,
  editTeam,
  deleteTeam,
} = require("../controllers/teamController");

router.post("/", addTeam);
router.get("/", viewTeam);
router.patch("/:id", editTeam);
router.delete("/:id", deleteTeam);

module.exports = router;
