
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const uri = "mongodb+srv://siva_1933:C26qgYsY6Akb7QR@demoapps.qaxs4.mongodb.net/shoping-app?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let _db;

const mongoConnect = (cb) => {
  client.connect().then(client => {
    _db = client.db()
    cb(_db, null)
  }).catch((err) => {
    cb(null, err)
  })
}

const getDB = () => {
  if (_db) {
    return _db;
  }

  throw 'No Database Found!'
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
exports.ObjectId = ObjectId;