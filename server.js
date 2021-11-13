const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: "String",
  log: [{
    description: {type: "String", required: true}, 
    duration: {type: "Number", required: true}, 
    date: {type: "Date", required: true}
  }]
});
const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({extended: false}));

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", function(req, res) {
  var userParam = req.body.username;
  var user = new User({username: userParam});
  user.save(function(err, data) {
    res.json({username: data.username, _id: data.id});
  });
});

app.get("/api/users", function(req, res) {
  var usersArray = [];
  User.find({}, function(err, users) {
    if(err) {
      res.json({err: "error"});
    }
    else if(users) {
      users.forEach(function(user) {
        usersArray.push({
          _id: user._id,
          username: user.username
        });
      });
      res.json(usersArray);
    }
    else {
      res.json({response: "no users"});
    }
  });
});

app.post("/api/users/:_id/exercises", function(req, res) {
  var idParam = req.params._id;
  var descriptionParam = req.body.description;
  var durationParam = req.body.duration;
  var dateParam = req.body.date;
  var positionLog;

  if(!dateParam) {
    dateParam = Date.now();
  }
  dateParam = new Date(dateParam);

  User.findById(idParam, function(err, user) {
    if(err) {
      res.json({err: "error"});
    }
    else if(user) {
      positionLog = user.log.length;
      user.log[positionLog] = {};

      if(descriptionParam) user.log[positionLog].description = descriptionParam;
      if(durationParam) user.log[positionLog].duration = durationParam;
      if(dateParam && dateParam instanceof Date) user.log[positionLog].date = dateParam;

      if(descriptionParam && durationParam && dateParam) {
        user.save(function(err, data) {
          if(err) res.json({error: "error"});
          else {
            res.json({
              _id: data.id, 
              username: data.username, 
              description: data.log[positionLog].description, 
              duration: data.log[positionLog].duration, 
              date: data.log[positionLog].date.toDateString()
            });
          }
        });
      }
      else {
        res.json({ error: "Error. You need to provide description and duration" });
      }
    }
  });
});

app.get("/api/users/:_id/logs", function(req, res) {
  var idParam = req.params._id;
  var fromQuery = req.query.from;
  var toQuery = req.query.to;
  var limitQuery = req.query.limit;
  if (limitQuery) limitQuery = parseInt(limitQuery);

  User.findById(
    idParam
  ).lean().exec(function(err, data) {
    var newLog = [];

    if(fromQuery) fromQuery = new Date(fromQuery);
    if(toQuery) toQuery = new Date(toQuery);

    if(err) res.json({error: "error"});
    else if(data) {
      data.log.forEach(function(log, i) {
        if(fromQuery && toQuery) {
          if(log.date.getTime() >= fromQuery && log.date.getTime() <= toQuery) {
            data.log[i].date = log.date.toDateString();
            newLog.push({
              description: log.description,
              duration: log.duration,
              date: log.date
            });
          }
        }
        else if(fromQuery) {
          if(log.date.getTime() >= fromQuery) {
            newLog.push({
              description: log.description,
              duration: log.duration,
              date: log.date.toDateString()
            });
          }
        }
        else if(toQuery) {
          if(log.date.getTime() <= toQuery) {
            newLog.push({
              description: log.description,
              duration: log.duration,
              date: log.date.toDateString()
            });
          }
        }
        else {
          newLog.push({
            description: log.description,
            duration: log.duration,
            date: log.date.toDateString()
          });
        }
      });

      if(limitQuery && typeof limitQuery == "number") newLog.splice(limitQuery, newLog.length - limitQuery);
      
      res.json({
        _id: data._id,
        username: data.username,
        count: newLog.length,
        log: newLog
      });
    }
    else {
      res.json({error: "error"});
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
