const express = require("express");
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cors = require('cors')
app.get('/',(req,res)=>{
	fs.readFile('./docs/apiDocs.json',(err,data)=>{
		if(err)
		{
			res.status(400).json({error: err})
		}
		const docs = JSON.parse(data)
		res.json(docs)
	})
})

const morgan = require("morgan")
const dotenv = require('dotenv')
const expressValidator = require('express-validator')
dotenv.config();
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true }).then(()=>{console.log("DB connected")});

mongoose.connection.on('error', err =>{console.log(`DB connection error ${err.message}`)})

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors())
app.use('/',postRoutes);
app.use('/',authRoutes)
app.use('/',userRoutes)
app.use(function (err,req,res,next){
	if(err.name === 'UnauthorizedError'){
		res.status(401).json({error: 'Unauthorized'});
	}
});

const port = process.env.PORT || 8080 ;
app.listen(port,()=>{console.log(`Listening on port: ${port}`)});
