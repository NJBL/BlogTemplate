const express = require('express');
const basicAuth = require('express-basic-auth');
const mongodb = require('mongodb');
var crypto = require('crypto');
const app = express();
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT ||  5000;
const dbo = require("./db/conn");

// const adminRoutes = require("./routes/admin");
// const blogRoutes = require("./routes/blog");

// app.use('*', adminRoutes);
// app.use('*', blogRoutes);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
});

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

/**
 * ADMIN
 */

const auth = basicAuth({
  users: {
    admin: 'tempPassword123!',
  },
});

const saveToken = (token, user) => {
  let db_connect = dbo.getDb("blog");
  let myquery = { user: user };
  let newvalues = {
    $set: {
      token: token,
      user: user,
    },
  };
  db_connect
    .collection("auth")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log(res);
    });
}

const retrieveToken = (user) => {
  let db_connect = dbo.getDb("blog");
  db_connect
    .collection("auth")
    .find({user:user});
}

app.get('/login', auth, async (req, res) => {
  if (req.auth.user === 'admin') {
    const token = crypto.randomBytes(64).toString('hex');
    saveToken(token, req.auth.user);
    res.send({
      // 'message': 'admin',
      'token': token,
    });
  }
});



/**
 * 
 * BLOG
 * 
 */


 // get blog posts
 app.route("/blog_posts").get(function (req, res) {
   let db_connect = dbo.getDb("blog");
   db_connect
     .collection("posts")
     .find({})
     .toArray(function (err, result) {
       if (err) throw err;
       res.json(result);
     });
 });

 // get specific blog post by id
 app.route("/blog_post/:id").get(function (req, res) {
  let obj_id = new mongodb.ObjectId(req.params.id);
  let db_connect = dbo.getDb("blog");
  db_connect
    .collection("posts")
    .findOne({_id: obj_id})
    .then((result) => {
      res.json(result);
    }, (err) => {
      if (err) throw err;
    });
});
 
 // create a new blog post
 app.route("/blog_posts/add").post(async function (req, res) {
   let db_connect = await dbo.getDb("blog"); 
   let myobj = {
     title: req.body.title,
     subtitle: req.body.subtitle,
     img: req.body.path,
     type: req.body.type,
     content: req.body.content,
   };
   db_connect.collection("posts").insertOne(myobj, function (err, obj) {
     if (err) { console.error(err); }
     else {res.json({ success: true });}
   });
 });
 
 // update a blog post
 app.route("/update/:id").post(function (req, res) {
   let db_connect = dbo.getDb("blog");
   let myquery = { id: req.body.id };
   let newvalues = {
     $set: {
      title: req.body.title,
      subtitle: req.body.subtitle,
      img: req.body.path,
      type: req.body.type,
      content: req.body.content,
     },
   };
   db_connect
     .collection("posts")
     .updateOne(myquery, newvalues, function (err, res) {
       if (err) {console.error(err);}
       else {res.json({ success: true });
       console.log("1 document updated");}
     });
 });
 
 // delete a blog post
 app.route("/delete/:id").post(function(req, res) {
   let db_connect = dbo.getDb("blog");
   var myquery = { id: req.body.id };
   db_connect.collection("posts").deleteOne(myquery, function (err, obj) {
     if (err) {
       console.error(err);
     } else {
       console.log("1 document deleted");
       res.json({ success: true });
     }
   });
 });
 
