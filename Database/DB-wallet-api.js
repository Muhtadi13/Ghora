const database = require('./database');


// function to get id from email
async function getWalletInfo(id)
{
    const sql = `
    SELECT 
        ID,
        ACCOUNT_NO,
        BALANCE
    FROM 
        WALLET
    WHERE
        ID=:id
    `;
const binds = {
    id:id
}
return (await database.execute(sql, binds, database.options)).rows;
}



module.exports = {
    getWalletInfo
}