const express = require("express");
const compute = require("./compute/compute");

const app = express();

const PORT = process.env.PORT || 3069;

app.use(express.json());

app.post("/split-payments/compute", (req, res) => {
  //intentional syntax for performance purpose ========> speed +++
  const result = compute.split(req.body.Amount, req.body.SplitInfo);
  const data = {
    ID: req.body.ID,
    Balance: result.amount,
    SplitBreakdown: result.splitBreakdown,
  };
  res.json(data);
});

app.listen(PORT, () => {
  console.log("server up");
});
