const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/multer') 
  .then(() => {
    console.log("mongodb connected")
  })
  .catch(() => {
    console.log("connection failed");
  });

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

const productcollection = require('./models/images');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads');
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname.replace(/\.[^/.]+$/,'') + '_' + Date.now() + path.extname(file.originalname));
    }
})

const maxsize = 2 * 1000 * 1000;

const upload = multer({
    storage :storage,
    limits :{
        fileSize: maxsize //5mb 1024*1024*5
    },
    fileFilter: (req,file,cb)=>{

        let filetype = /jpeg|jpg|png|webp/;
        let mimetype = filetype.test(file.mimetype);
        let extname = filetype.test(path.extname(file.originalname).toLocaleLowerCase());
        if(mimetype && extname){
            return cb(null,true);
        }
        cb('Error: File upload only supports the following file types' +filetype)
    }
})
// const upload = multer({
//     dest: '/uploads',  
//     limits: {
//         fileSize: 2 * 1024 * 1024, 
//     fileFilter: (req, file, cb) => {
//         // Check if the uploaded file is an image
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only images are allowed.'));
//         }
//     },
// }
// })


app.get('/',(req,res)=>{
    res.render('signup',{msg:''});
})
// app.post('/upload', upload.array('file'), async (req, res) => {
//     if (req.fileValidationError) {
//         if (req.fileValidationError === 'LIMIT_FILE_SIZE') {
//             return res.render('signup', { msg: 'File size is more than 2MB' });
//         }
//         return res.render('signup', { msg: 'Only accept images.' });
//     }

//     const files = req.files;
//     const data = { image: files.map(file => file.filename) };

//     // Assuming productcollection is defined and working correctly
//     await productcollection.insertMany([data]);

//     res.render('signup', { msg: 'Image added successfully' });
// });

app.post('/upload',upload.array('file'), async(req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            //console.log(err);
            if( err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'){
               return res.render('signup',{msg:"File size is more than 2mb"});
            }
             res.render('signup',{msg:"only accepct images."});
        }

        // Image uploaded successfully
    });
    const files = req.files
    res.render('signup',{msg:"Image added successfully"});
    const data = {  image:files.map(file => file.filename)}
    await productcollection.insertMany([data])
});



app.listen(2000,()=>{
    console.log('Server started on port 2000');
})