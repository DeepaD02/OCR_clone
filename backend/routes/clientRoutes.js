const express = require("express");
const ExcelJS = require("exceljs");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  addClient,
  viewClients,
  editClient,
  deleteClient,
  exportClients,
} = require("../controllers/clientsController");

router.get("/export",authMiddleware, exportClients);
router.post("/",authMiddleware, addClient);
router.get("/",authMiddleware, viewClients);
router.patch("/:id",authMiddleware, editClient);
router.delete("/:id",authMiddleware, deleteClient);

module.exports = router;
