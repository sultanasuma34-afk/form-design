const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const textPassword = "";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user:"root",
    password:"",
    database:'StudentInfo'
})

db.connect((err)=>{
    if(err){
        console.log('Error connecting to the database:', err);
    }
    else{
        console.log('Connected to the database');
    }
})


app.post('/addStudent',(req,res)=>{
    const {firstname, lastname, department, idno, session, semester, bloodgroup, dob, mobile_no, email, password, presentaddress, permanentaddress} = req.body;
    const textPassword = password;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            console.log('Error hashing password:', err);
        } else{
            console.log('Hashed password:', hash);
            const query = 'INSERT INTO users (firstname, lastname, department, idno, session, semester, bloodgroup, dob, mobile_no, email, password, presentaddress, permanentaddress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(query, [firstname, lastname, department, idno, session, semester, bloodgroup, dob, mobile_no, email, hash, presentaddress, permanentaddress], (err,result)=>{
                if(err){
                    console.log('Error inserting data into the database:', err);
                    res.status(500).send('Error inserting data into the database');
                }else{
                    console.log('Data inserted successfully');
                    res.status(200).send('Data inserted successfully');
                }
            })
        }
    })
    
})


app.get('/getInfo',(req,res)=>{
    const query = 'SELECT * FROM users';
    db.query(query, (err,result)=>{
        if(err){
            console.log('Error fetching data from the database:', err);
            res.status(500).send('Error fetching data from the database');
        }else{
            console.log('Data fetched successfully');
            res.status(200).json(result);
            console.log(result);
            bcrypt.compare("abak1234", result[0].password).then(function(result) {
                console.log('Password match:', result);
});
        }
    })
})




const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});