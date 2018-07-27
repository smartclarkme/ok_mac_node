const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(express.static(__dirname + '/../public'))
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/book-db')


const {Book}   = require('./model/books')
const {Store}  = require('./model/stores')

app.post('/api/add/store',(req,res)=>{
    // console.log('Getting a post req')
    // console.log(req.body)

    const store = new Store({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    })

    store.save((err,doc)=> {
        if(err) res.status(400).send(err)
        res.status(200).send()
    })
})

app.get('/api/stores',(req,res)=>{
    Store.find((err,doc)=>{
        if(err) res.status(400).send(err)
        res.status(200).send(doc)
    })
})

app.post('/api/add/books',(req,res)=>{

    const book = new Book({
        name: req.body.name,
        author: req.body.author,
        pages:  req.body.pages,
        price:  req.body.price,
        stores:  req.body.stores
    });

    book.save((err,doc)=>{
        console.log("/api/add/books:" +err)
        if(err) res.status(400).send(err);
        res.status(200).send(doc);
    })

})


app.get('/api/books',(req,res)=>{

    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let order = req.query.ord ? req.query.ord : 'asc';

    // Book.find().sort({_id:order}).limit(limit).exec((err,doc)=>{
    //     if(err) res.status(400).send(err);
    //     res.send(doc)
    // })

    // Book.find((err,doc)=>{
    //     if(err) res.status(400).send(err);
    //     res.send(doc)
    // })

    // Book.find().limit(limit).exec((err,doc)=>{
    //     if(err) res.status(400).send(err);
    //     res.send(doc)
    // })

    Book.find().sort({price:order}).limit(limit).exec((err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc)
    })

})

app.get('/api/books/:id',(req,res)=>{
    Book.findById(req.params.id,(err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc)
    })
})


/// PATCH

app.patch('/api/add/books/:id',(req,res)=>{

    Book.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true},(err,doc)=>{
        if(err) res.status(400).send(err);
        res.send(doc)
    })

})

/// DELETE

app.delete('/api/delete/books/:id',(req,res)=>{

    Book.findByIdAndRemove(req.params.id,(err,doc)=>{
        if(err) res.status(400).send(err);
        res.status(200).send();
    })

})


const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`started at port ${port}`)
})


