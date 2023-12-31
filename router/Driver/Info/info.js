// libraries
const express = require('express');
const bcrypt = require('bcrypt');


// my modules
const DB_driver=require('../../../Database/DB-driver-api');
const DB_driver_edit=require('../../../Database/DB-driver-edit-api');
const DB_vehicle_api=require('../../../Database/DB-vehicle-api');
const DB_review=require('../../../Database/DB-review');

const vehicleEditRouter=require('./editvehicle');
const infoEditRouter=require('./editinfo');
// const addVehicleRouter=require('./addVehicle');
const passwordEditRouter=require('./changePassword');

const photoEditRouter=require('./changephoto')
//const DB_auth_driver = require('../../../Database/DB-driver-auth-api');
//const authUtils = require('../../../utils/auth-utils');

// creating router
const router = express.Router({mergeParams : true});







// ROUTE: login (get)
router.get('/', async (req, res) => {
    // if not logged in take to login page
    if(req.driver == null){
       return res.redirect('/driver/login');
    } else {
        let driverInfo=[];
        console.log("here psaisi "+req.driver.EMAIL);
        
        driverInfo=await DB_driver.getAllInfoByID(req.driver.ID);

        let rating=0;
        const rate=await DB_review.getAverageRating(req.driver.ID);
        if(rate.length > 0){
        rating=rate[0].AVG_RATING;
        }
      //  const rating = await 
       // console.log(driverInfo[0].NAME);
       console.log(driverInfo[0].PHONE);
        res.render('driverLayout.ejs',{
            driver: req.driver,
            page:['driverInfo'],
            title:req.driver.NAME,
            info:driverInfo,
            rating:rating,
            navbar:1
        });

    }
});




//subrouters


router.use('/edit',infoEditRouter);
router.use('/editvehicle',vehicleEditRouter);
router.use('/changepassword',passwordEditRouter);

router.use('/changephoto',photoEditRouter);


module.exports = router;