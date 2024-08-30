const mysql = require('mysql2');

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"customer"
});

db.connect((err)=>{
    if(err){
        console.log(`connecting database err`,err);
    }else{
        console.log(`connected successfully`);
    }
});


module.exports = db.promise();