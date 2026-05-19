const express = require("express");
const ExcelJS = require("exceljs");
const router = express.Router();

const {
  addClient,
  viewClients,
  editClient,
  deleteClient,
  exportClients,
} = require("../controllers/clientsController");


router.get("/export", exportClients);
router.post("/", addClient);
router.get("/", viewClients);
router.patch("/:id", editClient);
router.delete("/:id", deleteClient);

module.exports = router;
