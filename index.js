const express=require('express');
const db=require('./db');

const app=express();
const PORT=3000;

app.get(
    '/api/stock/:ticker', (req,res)=>{
        const {ticker} =req.params;
        const query='SELECT * FROM fund_data WHERE ticker=?';
        db.query(query,[ticker], (err,results)=>{
            if(err){
                console.error(err);
                res.status(500).send('Server error');
            }else{
                res.json(results);
            }
        });
    }
);

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});