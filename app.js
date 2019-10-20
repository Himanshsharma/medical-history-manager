var express=require("express")
var app=express()
app.set('view engine','ejs')
app.use('/news', express.static('news'))
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var session = require('express-session')
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 1160000 } }))


const _ = require("lodash")
var multer = require('multer')
var i=0;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        // should be a very very random string
        let ext = file.originalname.split('.')[1]
        i=i+1
        
        let filename = file.fieldname + '-' + req.session.user._id + i + Date.now() + '.' + ext
        cb(null, filename)
    }
})


var singleupload = multer({ storage: storage }).single('file')



var multipleupload = multer({ storage: storage }).array('file')

var bodyParser = require("body-parser")
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var to=new Schema({
    doctor:String,
    disease:String,
    hospital:String,
    c:String,
    l:ObjectId,


})
const lo=mongoose.model("pim",to)
var fo=new Schema({
    name:String,
    age:Number,
    height:Number,
    weight:Number,
    gender:String,
    address:String,
    pincode:String,
    c:ObjectId,
})
app.get('/in',(req,res)=>{
    res.render("form2")
})
const frm=mongoose.model("tom",fo)

var doc=new Schema({
    name:String,
    special:String,
    hospital:String,
    register:Number,
    state:String,
    email:String,
    password:String,
})
var user=new Schema({
    email:String,
    password:String,

})
const users=mongoose.model("him",user)
const docs=mongoose.model("sim",doc)

app.get('/',(req,res)=>{
    res.render("index")
})
app.get('/user',(req,res)=>{
    res.render("user")
})
app.post('/user', urlencodedParser, (req, res) => {
    switch (req.body.action) {
        case 'signup':
            users.findOne({ email: req.body.email }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/user')
                    return
                }
                if (_.isEmpty(doc)) {
                    let newUser = new users();
                    newUser.email = req.body.email;
                    newUser.password = req.body.password;
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err, 'error')
                            return
                        }
                        res.render('user', { message: "Sign Up Successful. Please log in." })
                    });

                } else {
                    res.render('user', { message: "User already exists" })
                }
            })
            break;
        case 'login':
            users.findOne({ email: req.body.email, password: req.body.password }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/user')
                    return
                }
                if (_.isEmpty(doc)) {
                    res.render('user', { message: "Please check email/password" })
                } else {
                    req.session.user = doc
                    res.redirect('/user/dash')
                }
            })
            break;
    }

})

app.get('/doct',(req,res)=>{
    res.render("doct")
    

})
app.post('/doct', urlencodedParser, (req, res) => {
    switch (req.body.action) {
        case 'signup':
            docs.findOne({ email: req.body.email }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/doct')
                    return
                }
                if (_.isEmpty(doc)) {
                    let newUser = new docs();
                    newUser.name= req.body.name;
                    newUser.special= req.body.special;
                    newUser.hospital= req.body.hospital;
                    newUser.register= req.body.register;
                    newUser.state= req.body.state;
                    newUser.email = req.body.email;
                    newUser.password = req.body.password;
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err, 'error')
                            return
                        }
                        res.render('doct', { message: "Sign Up Successful. Please log in." })
                    });

                } else {
                    res.render('doct', { message: "User already exists" })
                }
            })
            break;
        case 'login':
            docs.findOne({ email: req.body.email, password: req.body.password }, function (err, doc) {
                if (err) {
                    console.log(err, 'error')
                    res.redirect('/doct')
                    return
                }
                if (_.isEmpty(doc)) {
                    res.render('doct', { message: "Please check email/password" })
                } else {
                    req.session.user = doc
                    res.redirect('/doct/dass')
                }
            })
            break;
    }

})
app.get('/user/dash',(req,res)=>{
    lo.find({ l:req.session.user._id },function(err,doc){
if(err){
    console.log("error")
}i=0
frm.find({c:req.session.user._id},function(err,doc1){
    res.render("dash",{ad:doc,hah:doc1})
})

    })

   
})
app.post('/user/dash',urlencodedParser,multipleupload,(req,res)=>{
    let kl=new lo()
    kl.doctor=req.body.doctor
    kl.disease=req.body.disease
    kl.hospital=req.body.hospital
    kl.c=req.body.date
    kl.l=req.session.user._id
    kl.save(function(err){
        if(err){
            console.log("jk")
        }
        res.redirect("/user/dash")
    })
})
app.get("/doct/dass",(req,res)=>{
    
    frm.find({c:req.query.objec},function(err,doc){
        if(err){console.log(err)}
        lo.find({l:req.query.objec},(err,him)=>{
            if(err){}res.render("dass",{hah:doc,jim:him})
        })
        

    })
})
app.get("/user/form",(req,res)=>{
    res.render("form")
})
app.post('/user/form',urlencodedParser,(req,res)=>{
    let k= new frm()
    k.name = req.body.name
    k.weight=req.body.weight
    k.height=req.body.height
    k.age=req.body.age
    k.gender=req.body.gender
    k.address=req.body.address
    k.pincode=req.body.pincode 
    k.c=req.session.user._id
    k.save(function(err){
        if(err){
            console.log(err)

        }
        res.redirect("/user/dash")
    })

})
app.get('/user/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.listen(3890)