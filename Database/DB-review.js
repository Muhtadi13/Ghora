const database = require('./database');


// function to get id from email
// async function makeReview(review)
// {
// const sql = `
// INSERT INTO 
// REVIEW(RATING,DESCRIPTION,TR_ID)
// VALUES(:rating,:comment,:tid)

// `;
// const binds={
//     rating:review.RATING,
//     comment:review.COMMENT,
//     tid:review.TR_ID
// };
// return (await database.execute(sql, binds, database.options)).rows;
// }


async function makeReview(review){
    const sql= `
    INSERT INTO
    REVIEW(RATING,DESCRIPTION,TR_ID)
    VALUES(:rating,:description,:tid)

    `;
    const binds={
        rating:review.RATING,
        description:review.COMMENT,
        tid:review.TR_ID
    
    };
   // return (await database.execute(sql,binds,database.options)).rows;
   try {
    const result = await database.execute(sql, binds, database.options);
    const rows = result.rows;
    return rows;
    // Process the result rows
} catch (error) {
    console.error('Error executing SQL:', error);
}


}

async function getAverageRating(d_id){
const sql = `
SELECT 
T.PLATE_NO AS PLATE_NO,
SUM(R.RATING)/COUNT(DISTINCT R.ID) AS AVG_RATING
FROM TRIP_HISTORY T NATURAL JOIN REVIEW R
WHERE T.PLATE_NO=(SELECT PLATE_NO FROM DRIVER WHERE ID=:d_id)
GROUP BY T.PLATE_NO
`;

const binds={
    d_id:d_id
};
//return (database.execute(sql,binds,database.options)).rows;
try {
    const result = await database.execute(sql, binds, database.options);
    const rows = result.rows;
    console.log('db func hote: ',rows);
    return rows;
    // Process the result rows
} catch (error) {
    console.error('Error executing SQL:', error);
}



}


async function getRatingOfTrip(tr_id){
    const sql = `
    SELECT 
    RATING,DESCRIPTION
    FROM REVIEW
    WHERE TR_ID=:tr_id
    `;
    
    const binds={
        tr_id:tr_id
    };
    //return (database.execute(sql,binds,database.options)).rows;
    try {
        const result = await database.execute(sql, binds, database.options);
        const rows = result.rows;
        console.log('db func hote: ',rows);
        return rows;
        // Process the result rows
    } catch (error) {
        console.error('Error executing SQL:', error);
    }
    
    
    
    }

    async function getReviewsOfDriver(d_id) {

        const sql = `
        SELECT R_ID,RATING,DESCRIPTION,USERNAME,D_ID,D_NAME
FROM
(SELECT R.ID AS R_ID,R.RATING AS RATING,R.DESCRIPTION AS DESCRIPTION,TR.USERNAME AS USERNAME ,TR.PLATE_NO AS PLATE_NO,D.ID AS D_ID,D.NAME AS D_NAME
 FROM REVIEW R NATURAL JOIN TRIP_HISTORY TR 
JOIN DRIVER D
ON D.PLATE_NO=TR.PLATE_NO)
WHERE D_ID=:did
ORDER BY R_ID DESC
    `;
    const binds={
        did:d_id
    }

    try {
        const result = await database.execute(sql, binds, database.options);
        const rows = result.rows;
        console.log('db func hote: ',rows);
        return rows;
        // Process the result rows
    } catch (error) {
        console.error('Error executing SQL:', error);
    }


    }

async function getReviewCountsofDriver(d_id){
    const sql=`SELECT
    RATING,
    COUNT(*) AS RATING_COUNT
FROM
    (SELECT R.ID AS R_ID, R.RATING AS RATING, R.DESCRIPTION AS DESCRIPTION, TR.USERNAME AS USERNAME, TR.PLATE_NO AS PLATE_NO, D.ID AS D_ID, D.NAME AS D_NAME
    FROM REVIEW R
    JOIN TRIP_HISTORY TR ON R.TR_ID = TR.TR_ID
    JOIN DRIVER D ON D.PLATE_NO = TR.PLATE_NO
    WHERE D.ID = :did) 
GROUP BY
    RATING
ORDER BY RATING`;

const binds={
    did:d_id
}

try {
    const result = await database.execute(sql, binds, database.options);
    const rows = result.rows;
    console.log('db func hote: ',rows);
    return rows;
    // Process the result rows
} catch (error) {
    console.error('Error executing SQL:', error);
}


}

async function getMaximumRatingofDriver(d_id) {
    const sql =`
    SELECT MAX(R.RATING) AS MAX_RATING 
    FROM
    REVIEW R
        JOIN TRIP_HISTORY TR ON R.TR_ID = TR.TR_ID
        JOIN DRIVER D ON D.PLATE_NO = TR.PLATE_NO
        WHERE D.ID = :did`;


        const binds={
            did:d_id
        }
        
        try {
            const result = await database.execute(sql, binds, database.options);
            const rows = result.rows;
            console.log('db func hote: ',rows);
            return rows;
            // Process the result rows
        } catch (error) {
            console.error('Error executing SQL:', error);
        }

    
    }












module.exports = {
    
    makeReview,
    getAverageRating,
    getRatingOfTrip,
    getReviewsOfDriver,
    getReviewCountsofDriver,
    getMaximumRatingofDriver
};