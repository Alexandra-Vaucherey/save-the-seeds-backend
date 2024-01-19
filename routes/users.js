var express = require('express');
var router = express.Router();

const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const fs = require('fs');
const Grid = require('gridfs-stream');
//const conn = mongoose.connection;
//Grid.mongo = mongoose.mongo;


/* s'enregister*/
router.post('/signup', function(req, res, next) {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  
const hash = bcrypt.hashSync(req.body.password, 10);



  const newUser = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    birthday: new Date(req.body.birthday +" UTC"),
    phone: req.body.number,
    email: req.body.email,
    picture: req.body.picture,
    password: hash,
    token: uid2(32),
   });
   // Initialize the GridFS stream
  const gfs = Grid(conn.db);

  if (req.body.picture) {
    const base64Data = req.body.picture.replace(/^data:image\/png;base64,/, "");

    // Decode the base64 data and create a Buffer from it
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Create a new file in GridFS stream
    const writestream = gfs.createWriteStream({
      filename: `${newUser._id}.png`
    });

    writestream.on('error', function(err) {
      console.error(err);
      res.json({ result: false, error: 'Failed to save picture' });
    });

    writestream.on('close', function(file) {
      // Set the picture field in newUser with the file ID
      newUser.picture = file._id;

      // Save the newUser object
      newUser.save().then(doc => {
        res.json({ result: true, token: doc.token });
      });
    });

    // Write the image data to the GridFS stream
    writestream.write(base64Data, 'base64');
    writestream.end();
  } else {
    // Save the newUser object without a picture
   newUser.save().then(doc => {
    res.json({result: true, token: doc.token})
            
        });
}})



//se connecter
router.post('/signin', function(req, res, next) {

  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }


  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true,token: data.token });
    } else {
      res.json({ result: false });
    }
   });


  });


  module.exports = router;