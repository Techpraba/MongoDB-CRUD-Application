const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const exhbrs = require('express-handlebars');
const dbo = require('./db');
const Obj = dbo.Objid;

app.engine('hbs', exhbrs.engine({
    layoutsDir: 'views/', defaultLayout: 'main', extname: 'hbs', helpers: {
        inc: function (value, startIndex) {
            return value + startIndex;
        }
    }
}))
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', async (req, res) => {
    let database = await dbo.getDatabase();
    const collection = database.collection('books');
    const cursor = collection.find({})
    let books = await cursor.toArray();
    let message = '';
    let edit_id, edit_book;
    if (req.query.edit_id) {
        edit_id = req.query.edit_id;
        edit_book = await collection.findOne({ _id: new Obj(edit_id) });
    }
    if (req.query.delete_id) {
        await collection.deleteOne({ _id: new Obj(req.query.delete_id) })
        res.redirect('/?status=3')
    }
    switch (req.query.status) {
        case '1':
            message = "inserted Succcessfully";
            break;
        case '2':
            message = "update Succcessfully";
            break;
        case '3':
            message = "delete Succcessfully";
            break;
        default:
            break;
    }
    res.render('main', { message, books, edit_id, edit_book, startIndex: 1 })
})
app.post('/store', async (req, res) => {


    let database = await dbo.getDatabase();
    const collection = database.collection('books');
    let book = { title: req.body.title, author: req.body.author, startIndex: 1 }
    if (book.title && book.author) {
        console.log(book.title.length)
        await collection.insertOne(book);
        return res.redirect('/?status=1')
    }



})
app.post('/update/:edit_id', async (req, res) => {
    let database = await dbo.getDatabase();
    const collection = database.collection('books');
    let book = { title: req.body.title, author: req.body.author }
    let edit_id = req.params.edit_id;
    await collection.updateOne({ _id: new Obj(edit_id) }, { $set: book });
    return res.redirect('/?status=2')

})
app.listen(8000, () => console.log("succsess"));