// import dependencies you will use
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

const { check, validationResult, header } = require('express-validator');
// set up variables to use packages
var myApp = express();
myApp.use(bodyParser.urlencoded({extended:false}));
// set path to public folders and view folders

myApp.set('views', path.join(__dirname, 'views'));
//use public folder for CSS etc.
myApp.use(express.static(__dirname+'/public'));
myApp.set('view engine', 'ejs');
// set up different routes (pages) of the website

//home page

myApp.get('/', function(req, res){
    res.render('form'); // no need to add .ejs to the file name
});


 myApp.post('/', 
  [
    //  check('name',  'Name is required!').notEmpty(),
    //  check('address', 'Address is Required').notEmpty(),
    //  check('city', 'City is Required').notEmpty(),
    //  check('province', 'Province is Required').notEmpty(),
      check('email', '').isEmail(),
    check('phone','').custom(customPhoneValidation)//just pass the handler not a function call. Remember functions are first class citizens so they can be passed as parameters to other functions
//    // check('prints', '').custom(customNumberValidation),
//   //  check('scans', '').custom(customNumberValidation)
  ], 
function(req, res){const errors = validationResult(req);
    console.log(errors);//logging this error will show us in the terminal that errors is an array and msg is what we need to print client side
    if (!errors.isEmpty()) {
        res.render('form', {
            errors: errors.array()
        });
    }
    else {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var city = req.body.city;
    var province = req.body.province;
    var prints = Math.sign(parseInt(req.body.prints));
    var scans = Math.sign(parseInt(req.body.scans));
    var printAmount = 0.50;
    var scanAmount = 0.25;
    
    var subTotal = (prints * printAmount) + (scans * scanAmount);
   
    var tax = subTotal * 0.13;
    var total = subTotal + tax;

    var pageData = {
        name : name,
        email : email,
        phone : phone, 
        address : address,
        city : city,
        province : province,
        prints : prints,
        scans : scans,
        subTotal : subTotal,
        tax : tax,
        total : total
    }
    res.render('form', pageData);
    }
});


//author page
myApp.get('/author',function(req,res){
    res.render('author',{
        name : 'Mufiz Munshi',
        studentNumber : '8775460'
    }); 
});
// ----------Validation Functions --------------
// phone regex for 123-123-2341
var phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
// var emailRegex = /^[A-Z0-9+_.-]+@[A-Z0-9.-]+$/;
// var numbersOnly = /^\d+$/; //match for numbers only

//Function to check a string using regex
function checkRegex(userInput, regex){
    if(regex.test(userInput)){
        return true;
    }
    return false;
}
// Custom validation functions return true if conditions are satisfied or throws an error of type Error
// Custom phone validation
function customPhoneValidation(value){
    if(!checkRegex(value, phoneRegex)){
        throw new Error('Phone should be in the format ');
    }
    return true;
}

// function customEmailValidation(value){
//     value = value.trim();
//     if(!checkRegex(value, emailRegex)){
//         throw new Error('Email should be in the format test@test.com');
//     }
//     return true;
// }

// function customNumberValidation(value){
//     var prints = Math.sign(parseInt(req.body.prints));
//     var scans = Math.sign(parseInt(req.body.scans));
// }
// start the server and listen at a port
myApp.listen(port);

//tell everything was ok
console.log('Everything executed fine.. website at port 8080....');


