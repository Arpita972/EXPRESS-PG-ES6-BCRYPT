//const client = require("./connection.js");
import client from "./connection.js"

//const express = require("express");
import express from "express"
const app = express();

// const cors = require("cors");
import cors from "cors"
app.use(cors());

import bcrypt from "bcrypt"

//const bodyParser = require("body-parser");
import bodyParser from "body-parser";
var urlencodedParser = bodyParser.urlencoded({ extended: false });  

//import bodyParser from 'body-parser';
app.use(bodyParser.json());
client.connect();

//get all users
app.get("/users",urlencodedParser, (req, res) => {
  client.query(`Select * from users`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});




app.post("/userinsert", async (req, res) => {
  const user = req.body;
  console.log(user);
  let hashedPassword = await myBcrypt(user.upassword);
  let insertQuery = `insert into users(uname, upassword) 
                       values('${user.uname}', '${hashedPassword}')`;
                       console.log(insertQuery);

  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});



async function checkPassword(plaintextPassword,hashedPassword) {
  bcrypt.compare(plaintextPassword, hashedPassword, (err, res) => {
    if (err) {
      console.error(err);
    } else if (res) {
      console.log("The passwords match.");
    } else {
      console.log("The passwords do not match.");
    }
  });
}

async function myBcrypt(plaintextPassword) {
  const hash = await bcrypt.hash(plaintextPassword, 10); // Store hash in the database
  return hash;
}

app.listen(8000, () => {
  console.log("Server has Started");
});
