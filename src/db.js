const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const Objid = mongodb.ObjectId;

async function getDatabase() {
    const client = await mongodb.MongoClient.connect('mongodb://127.0.0.1:27017');
    database = client.db('library');
    try {
        if (!database) {
            console.log("Database is not Connected")
        }
    } catch (error) {
        console.log(error)
    }
    return database;

}
module.exports = {
    getDatabase,
    Objid
}