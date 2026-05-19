const express = require("express");

const router = express.Router();

const {
  projectsView,
  addProject,
  editProject,
  deleteProject,
  exportProjects,
} = require("../controllers/projectController");

router.get("/export", exportProjects);
router.get("/", projectsView);
router.post("/", addProject);
router.patch("/:id", editProject);
router.delete("/:id", deleteProject);

module.exports = router;
