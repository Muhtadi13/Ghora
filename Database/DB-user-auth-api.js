const database = require('./database');



// function to get id from email
async function getUsernameByEmail(email){
    const sql = `
        SELECT 
            USERNAME
        FROM 
            USERS
        WHERE 
            EMAIL = :email
        `;
    const binds = {
        email : email
    }

    return (await database.execute(sql, binds, database.options)).rows;
}

// function to creat new user
// user should have handle, email, pass, dob
// {id} will be returned
async function createNewUser(user){
    const sql = `
        INSERT INTO
            USERS(username,NAME,EMAIL, PASSWORD,SEX)
        VALUES 
            (:username,:name,:email,:password,:sex)
    `;
    const binds = {
        name: user.name,
        email :user.email,
        password: user.password,
        address: user.sex,
        username: user.username
    }
    return await database.execute(sql, binds, {});
}

// return login info (id, handle, password) from handle
async function getLoginInfoByEmail(email){
    const sql = `
        SELECT 
            USERNAME,
            NAME,
            PASSWORD
        FROM
            USERS
        WHERE
            EMAIL = :email
    `;
    const binds = {
        email: email
    }

    return (await database.execute(sql, binds, database.options)).rows;
}

async function getLoginInfoByUsername(username){
    const sql = `
        SELECT 
            USERNAME,
            NAME,
            PASSWORD,
            EMAIL
            --IMAGE
        FROM
            USERS
        WHERE
            USERNAME=:username
    `;
    const binds = {
        username :username
    }

    return (await database.execute(sql, binds, database.options)).rows;
}



module.exports = {
    getUsernameByEmail,
    createNewUser,
    getLoginInfoByEmail,
    getLoginInfoByUsername,
  // updateUserTokenById,
   // getUserPromptById,
   // updateLoginTimeById
}