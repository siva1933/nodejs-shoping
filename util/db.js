
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@demoapps.qaxs4.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(process.env.PORT)
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
exports.uri = uri;