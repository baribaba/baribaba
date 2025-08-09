const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const propertyRoutes = require("./routes/properties");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/properties", propertyRoutes);

app.listen(5000, () => {
  console.log("BariBaba server running on http://localhost:5000");
});
