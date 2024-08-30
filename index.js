const express = require('express');
const customerRoutes = require('./routes/routes');
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api',customerRoutes);





const port = 8080;

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
});