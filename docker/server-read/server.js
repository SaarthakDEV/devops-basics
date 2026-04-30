const express = require('express');
const cors = require('cors');
const fs = require("fs");

const app = express();
const PORT = 8080;

app.get('/', async (req,res) => {
  const file = fs.readFileSync("/app/data/notes.txt");

  return res.status(200).send(file)
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
