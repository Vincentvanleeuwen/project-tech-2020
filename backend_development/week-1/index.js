let express = require('express');
let app = express();

app.get("/", (req, res) => {
  res.send("yeet");
});
app.get("/about", (req, res) => {
  res.send("yeet2");
});




app.listen(4000, () => {
  console.log("Example Port 4000");
});
