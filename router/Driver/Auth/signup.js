// libraries
const express = require('express');
const bcrypt = require('bcrypt');

// my modules
const DB_auth_driver = require('../../../Database/DB-driver-auth-api');
const authUtils = require('../../../utils/auth-utils');

// creating router
const router = express.Router({mergeParams : true});

// ROUTE: sign up (get)
router.get('/', (req, res) => {
    // check if already logged in
    if(req.driver == null){
        const errors = [];
        res.render('driverlayout.ejs', {
            title : 'Sign Up - Ghora',
            page : ['driverSignup'],
            driver : null,
            errors : errors
        });
    } else {
        res.redirect('/driver');
    }
});

// ROUTE: sign up (post)
router.post('/', async (req, res) => {
    // check if already logged in
    if(req.driver == null){
        let results, errors = [];
/*
        let regex = /^[a-zA-Z0-9_]+$/;
        // check if handle is valid (letter+digit+_)
        if(regex.test(req.body.handle)){
            // if valid, check if handle can be used
            // TODO restrict keywords
            results = await DB_auth.getUserIDByHandle(req.body.handle);
            if(results.length > 0)
                errors.push('Handle is already registered to a user');
        }
        else{
            errors.push('Handle can only contain English letters or digits or underscore');
        }*/

        // check if email is alredy used or not
        console.log(req.body);
        results = await DB_auth_driver.getDriverIDByEmail(req.body.email);
        let phonecheck=req.body.phone;
        if(req.body.phone.length==11){
            phonecheck = '88'+req.body.phone;
        }
        resphone = await DB_auth_driver.getDriverIDByPhone(phonecheck);

        console.log("email unique: " ,results);
        console.log("phone unique: " ,resphone);
        
        if(results.length > 0)
            errors.push('Email is already registered to a user');
       
        if(resphone.length > 0)
            errors.push('Phone number is already registered to a user');

        // check if password confimation is right
        if(req.body.password !== req.body.password2)
            errors.push('Password confirmation doesn\'t match with password');

        // check if password has at least 6 char
        if(req.body.password.length < 6){
            errors.push('Password must be at least 6 characters');
        }
        //check valid phone no.
        if((req.body.phone.length!=13 && req.body.phone.length!=11 ) || !phonecheck.startsWith('8801')){
            errors.push('Phone number  invalid');
        }


        // if there are errors, redirect to sign up but with form informations
        if(errors.length > 0){
            res.render('driverlayout.ejs', {
                title : 'Sign Up - Ghora',
                page : ['driverSignup'],
                driver : null,
                errors : errors,
                form : {
                    name : req.body.name,
                    email : req.body.email,
                    password : req.body.password,
                    password2 : req.body.password2,
                    phone:req.body.phone,
                    sex:req.body.sex
                }
            });
        }
        else{
            // if no error, create user object to be sent to database api
            let driver = {
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                phone:req.body.phone,
                sex:req.body.sex
            }
            // hash user password
            await bcrypt.hash(driver.password, 8, async (err, hash) =>{
                if(err)
                    console.log("ERROR at hashing password: " + err.message);
                else{
                    // create user via db-api, id is returned
                    driver.password = hash;
                    let result = await DB_auth_driver.createNewDriver(driver);
                    let result2 = await DB_auth_driver.getLoginInfoByEmail(driver.email);
                    // login the user too
                    //await DB_cart.addNewCart(result2[0].ID);
                    await authUtils.loginDriver(res, result2[0].ID);
                    // redirect to home page
                    //res.redirect(`/profile/${user.handle}/settings`);
                    res.redirect('/driver');
                }
            });
        }
    } else {
        res.redirect('/driver');
    }
});

module.exports = router;