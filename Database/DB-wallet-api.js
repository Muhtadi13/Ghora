const database = require('./database');


// function to get id from email
async function getWalletInfo(id)
{
    const sql = `
    SELECT 
        ID,
        ACCOUNT_NO,
        BALANCE,
        PASSWORD
    FROM 
        WALLET
    WHERE
        ID=:id
    `;
const binds = {
    id:id
}
 try {
        const result = await database.execute(sql, binds, database.options);
        const rows = result.rows;
        //console.log('db func hote: ', rows);
        return rows;
        // Process the result rows
    } catch (error) {
        console.error('Error executing SQL:', error);
    }
}

async function addBalance(id,amount)
{
    const sql = `
    UPDATE WALLET 
    SET 
        BALANCE=BALANCE+:amount
    WHERE
        ID=:id
    `;
const binds = {
    id:id,
    amount:amount
}
try {
    const result = await database.execute(sql, binds, database.options);
    const rows = result.rows;
    //console.log('db func hote: ', rows);
    return rows;
    // Process the result rows
} catch (error) {
    console.error('Error executing SQL:', error);
}
}





module.exports = {
    getWalletInfo,
    addBalance
}