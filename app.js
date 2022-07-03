const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const adminRoutes = require('./routes/adminRoutes')
const blogRoutes = require('./routes/blogRoutes')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const {requireAuth,checkUser} = require('./middlewares/authMiddleware')
const app = express()

const dbURL = 'mongodb+srv://alihan:alihan@nodeblog.uiswn.mongodb.net/node-blog?retryWrites=true&w=majority'
mongoose.connect(dbURL) //videoda bağlantı olmazsa bunu yaz dedi -> dbURL, {useNewUrlParser: true , useUnifiedTopology: true}
    .then((result) => console.log('Bağlantı kuruldu.'))
    .catch((err) => console.log(err))

app.set('view engine','ejs')

app.listen(3000)

// app.get('/', (req,res) => {
//     res.send('<h1>Anasayfa</h1>')
// })

// app.get('/', (req,res) => {
//     res.sendFile('./views/index.html',{root: __dirname})
// })

// app.get('/about', (req,res) => {
//     res.sendFile('./views/about.html',{root: __dirname})
// })

// app.get('/about-us', (req,res) => {
//     res.redirect('/about')
// })

// //tüm işlemlerden sonra yazılmalı.
// app.use((req,res) => {
//     res.status(404).sendFile('./views/404.html',{root: __dirname})
// })

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cookieParser())

app.get('*',checkUser)

app.get('/add', (req,res) => {
    const blog = new Blog({
        title: 'yeni yazı 2',
        short: 'kısa açıklama',
        long: 'uzun açıklama'
    })

    blog.save()
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log(err)
    })
})

app.get('/all', (req,res) => {
    Blog.find()
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log(err)
    })
})

app.get('/single', (req,res) => {
    Blog.findById('62c1ab206943e5d2541a9b23')
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log(err)
    })
})

app.get('/', (req,res) => {
    res.redirect('/blog')
})

app.use('/',authRoutes)
app.use('/blog',blogRoutes)
app.use('/admin',requireAuth,adminRoutes)

// app.use((req,res,next) => { //ara katman - middleware
//     console.log(req.path)
//     next();
// })

app.get('/about', (req,res) => {
    res.render('about',{title:'Hakkımızda'})
})

app.get('/about-us', (req,res) => {
    res.redirect('/about')
})

app.use((req,res) => {
    res.status(404).render('404',{title:'404'})
})