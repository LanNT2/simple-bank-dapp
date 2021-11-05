var express = require('express');
var app = express();
app.use(express.static("./src"));
app.use(express.static("./node_modules/w3/dist"))
console.log("aaaaaaaaaaaaaaaaaa");
//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('./src/index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});
app.listen('3300');
console.log('Running at\nhttp://localhost:3300');
