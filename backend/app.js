/* --- Main app file --- */
const express = require('express');
const app = express();
const cors = require('./middlewares/cors.mdw')
const mongoose = require('mongoose');
const helmet = require('helmet')
const cookieParser = require('cookie-parser');

require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes')
const usersRoutes = require('./routes/user.routes')
const commentRoutes = require('./routes/comment.routes')
const adminRoutes = require('./routes/admin.routes')

const path = require('path');
//const { checkAuth, requireAuth } = require('./middlewares/auth.mdw');
const { requireAuth } = require('./middlewares/auth.mdw');

//Connect to the mongoDB DataBase
mongoose.connect(process.env.DBSERVER,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use(cors);
app.use(cookieParser());


//app.get('*', checkAuth);
app.get('*', requireAuth);
app.get('/jwtid', requireAuth, (req, res) => {
	res.status(200).send(res.locals.user._id)
});

//Use the routes to stock images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/user', usersRoutes);

app.use(`/${process.env.ADMIN}/user`, adminRoutes)

//Add Helmet to use some more protections
app.use(helmet());

module.exports = app;