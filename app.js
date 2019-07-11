//Requiring Dependencies
const express= require('express'),
      ejs    = require('ejs'),
      multer = require('multer'),
      path   = require('path');

const port=3000; 

//Init app
const app=express();

//Set up View Engine
app.set("view engine","ejs");

//static folder
app.use(express.static('./public'))

//set up storage enginre
const storage=multer.diskStorage({
  destination:'./public/uploads/',
  filename: function(req,file,cb){
  	cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname))
  }
})

//Init Upload
const uploads= multer({
	storage:storage,
	limits:{fileSize:1000000},
	fileFilter: function(req,file,cb){
		checkFileType(file,cb)
	}
}).single('myImage')

//check file type
function checkFileType(file,cb){
	const filetypes= /jpg|jpeg|png|gif/
	const extname  = filetypes.test(path.extname(file.originalname).toLowerCase())
	const mimetype = filetypes.test(file.mimetype)

	if(extname && mimetype){
		return cb(null,true)
	}
	else{
		cb('Error: Only Images allowed !')
	}
}

//get route
app.get("/",(req,res)=>{
	res.render('index');
});

//post route
app.post("/",(req,res)=>{
	uploads(req,res,(err)=>{
		if(err){
			//error
			res.render("index",{msg:err})
		}
		else{
			//no file selected
			if(req.file== undefined){
				res.render("index",{msg:"No file selected"})
			}
			else{
				res.render("index",{msg:"File Uploaded",file:`uploads/${req.fieldname}`})
			}
		}
	})
})

//Server
app.listen(port,()=> console.log(`Server started at port number ${port}`));