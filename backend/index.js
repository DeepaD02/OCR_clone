const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const clientRoutes = require("./routes/clientRoutes");
const projectRoutes = require("./routes/projectRoutes");
const teamRoutes = require("./routes/teamRoutes");
const diagnosesRoutes = require("./routes/diagnosesRoutes");

const app = express();

app.use(cors());
app.use(express.json());

//CacheClear 

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/diagnoses", diagnosesRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
