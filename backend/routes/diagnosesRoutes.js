const express = require("express");

const router = express.Router();

const {
  addDiagnoses,
  viewDiagnoses,
  editDiagnoses,
  deleteDiagnoses,
} = require("../controllers/diagnosesController");

router.post("/", addDiagnoses);
router.get("/", viewDiagnoses);
router.patch("/:id", editDiagnoses);
router.delete("/:id", deleteDiagnoses);

module.exports = router;
