const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/", (req, res) => {
  console.log("Received request:", req.body);
  res.json({
    challenge: req.body.challenge,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
