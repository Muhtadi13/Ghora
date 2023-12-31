//libraries
const express = require('express');
const DB_trips = require('../../../Database/DB-user-trips');
const { json } = require('body-parser');
const mapCalc = require('../../Map/calculations');
const address = require('../../Map/formattedAddress');
const wallet = require('../../../Database/DB-wallet-api');
const userInfo=require('../../../Database/DB-user-api')

//const DB_users=require('../../Database/DB-user-api');
//creating routers
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
    if (req.user == null) {
        console.log('get e user nai');
        return res.redirect('/user/login');
    }
    console.log('get e user ase');


    //console.log(req.body.data);
    res.redirect('/user');

});
router.get('/allowed', async (req, res) => {
    if (req.user == null) {
        console.log('get e user nai');
        return res.redirect('/user/login');
    }
    console.log('get e user ase');
    let userAllInfo=[];
    console.log('req user= ',req.user)
    userAllInfo=await userInfo.getAllInfoByUsername(req.user.USERNAME);

    console.log(' doirgho     ',userAllInfo.length);
    if(userAllInfo.length<=0)
    {
        console.log('user i nai');
        res.send('Muhit r Amim');
    }
    else if (userAllInfo[0].WALLET_ID == null) {
        console.log('get e user  wallet nai');
        res.send('You must have a wallet in your profile to make a request');
    }
    else {
        console.log('get e user  wallet ase');
        const wallet_info = await wallet.getWalletInfo(userAllInfo[0].WALLET_ID);
        console.log("wallet info: ", wallet_info);
        const bal = 'BALANCE: ' + wallet_info[0].BALANCE;
        res.send(bal);
        //res.status(202).json(wallet_info[0]);
    }


    //console.log(req.body.data);

});

router.get('/old', async (req, res) => {
    if (req.user == null) {
        console.log('get e user nai');
        return res.redirect('/user/login');
    }
    console.log('get e user ase');
    const cur = await DB_trips.getPendingRequests(req.user.USERNAME);
    const old = await DB_trips.getOldPendingRequests(req.user.USERNAME);
    console.log('cur, old =',cur,' ',old);
    if (cur.length == 0) {
        console.log('timer baad');
       
        if (old.length > 0) {
            // await DB_trips.deleteOldPendingRequests(req.user.USERNAME);
             console.log("baaaaaaaaaaaaaaaaaaakiiiiiiiiii=",old[0].ID);
             res.send('old nottaken yes', old[0].ID, ' ', old[0].TIME_REQUEST);
         }
         else{
            res.send('bedorkar');
         }
    }
    else {

        if (old.length > 0) {
           // await DB_trips.deleteOldPendingRequests(req.user.USERNAME);
            console.log("baaaaaaaaaaaaaaaaaaakiiiiiiiiii=",old[0].ID);
            res.send('old nottaken yes', old[0].ID, ' ', old[0].TIME_REQUEST);
        }
        else {
            console.log("baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            res.send('no');
        }
    }


    //console.log(req.body.data);

});

router.get('/deleteold', async (req, res) => {
    if (req.user == null) {
        console.log('get e user nai');
        return res.redirect('/user/login');
    }
    
    console.log('deleting old ');
    await DB_trips.deleteOldPendingRequests(req.user.USERNAME);
    console.log('deleted old done');
    res.status(202).send('done');



    //console.log(req.body.data);

});





router.post('/', async (req, res) => {
    if (req.user == null) {
        console.log('post e user nai');
        return res.redirect('/user/login');
    }
    console.log('post e user ase', req.user.USERNAME);

    console.log('dir theke aslam', req.body);
 
    

    const origin = await fetch(req.body.origin);
    const json = await origin.json();
    console.log("origin=", json.results[0].geometry);

    const destination = await fetch(req.body.destination);
    const json2 = await destination.json();
    console.log("destination=", json2.results[0].geometry);
    const reqpickup = {
        lat: json.results[0].geometry.location.lat,
        lng: json.results[0].geometry.location.lng
    }
    const reqdropoff = {
        lat: json2.results[0].geometry.location.lat,
        lng: json2.results[0].geometry.location.lng
    }
    console.log("pickup=", reqpickup);
    console.log("dropoff=", reqdropoff);


    //     mapCalc.calculateDistance(reqpickup, reqdropoff)
    //   .then(result => {
    //     const { distance, duration } = result;
    //     console.log(`Distance checking: ${distance}`);
    //     console.log(`Duration checking: ${duration}`);
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });





    const tripRequest = {
        pickup: reqpickup,
        dropoff: reqdropoff,
        user: req.user,
        v_type: req.body.v_type,
        fare: req.body.fare
    }
    console.log('tripreq ready=', tripRequest);

    // let madeRequest =
    // await DB_trips.cancelRequest(req.user.USERNAME);
    const already=await DB_trips.getPendingRequests(req.user.USERNAME);
    console.log('already same= length',already,' ',already.length)
    if(already.length==0){
    await DB_trips.makeTripRequests(tripRequest);
    }
    let checkedRequest = await DB_trips.getAllInfoRequest(tripRequest);

    if (checkedRequest[0] === undefined) {
        console.log("ERROR at creating user request for trip");
        res.redirect('/user');
    }
    else {
        //await authUtils.loginUser(res, result2[0].EMAIL)
        // redirect to home page
        //res.redirect(`/profile/${user.handle}/settings`);
        console.log("successful request for ride");
        console.log("refreshing user");
        res.redirect('/user');

    }

    



















});


// router.post("/", async (req, res) => {
//     const data = req.body.data;

//     try {
//       // Call a function from your database module to save the data
//       //await database.saveData(data);
//       console.log("data received= ",data);

//       res.status(200).send("Data received at backend");
//     } catch (error) {
//       console.error("Error receiving data:", error);
//       res.status(500).send("An error occurred while receiving data");
//     }
//   });



module.exports = router;