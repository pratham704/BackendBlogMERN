const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const abc = require('./modelofreg');
const app = express();
const dotenv = require('dotenv')
dotenv.config();

app.use(cors());
app.use(express.json());
mongoose.set('strictQuery', false);



const url = `${process.env.MONGO}`


mongoose.connect(url)


// registration part   
app.post('/no', async(req, res) => {



    const data = await abc.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email

    })


    res.json(data)



})



// login matching

app.post('/sersign', async(req, res) => {

        let usn = req.body.username;
        let pass = req.body.password;

        const check = await abc.findOne({ username: usn, password: pass })

        if (check) {


            return res.json(check)
        } else {

            return res.json(check)
        }

    }

)




// cheak if username  exisit


app.post('/existingUser', async(req, res) => {


    const existing = await abc.findOne({ username: req.body.username })

    if (existing != null) {
        res.json(existing.username)
    } else {


        res.json("nothins brp")


    }





})

//cheak if email exists 

app.post('/existingEmail', async(req, res) => {


    const existing = await abc.findOne({ email: req.body.email })

    if (existing != null) {

        res.json(existing.email)
    } else {


        res.json("nothins brp")


    }

})






//adding new blogs

app.post('/myblog', async(req, res) => {

    let a = req.body.min
    let b = req.body.inputText



    const ex = await abc.findOne({ username: a });

    if (ex != null) {
        await abc.updateOne({ username: a }, { $push: { blogs: b } }, { upsert: true });

        const updatedEx = await abc.findOne({ username: a }); //now fetch the updated part
        res.json(updatedEx.blogs); //send updated part
    } else {}



})



// displaying only my blogs

app.post('/displaymyblogs', async(req, res) => {

    const existing = await abc.findOne({ username: req.body.min })

    if (existing != null) {
        res.json(existing.blogs)
    } else {


        res.json("nothins brp")


    }

});










// getting last blog in /home ....
app.post('/homes', async(req, res) => {
    const results = await abc.find({}).sort({ updatedAt: -1 });
    const response = results.map((doc) => {
        return {
            username: doc.username,
            lastBlog: doc.blogs[doc.blogs.length - 1]
        };
    });

    res.json(response);
});




app.post('/getRecentblog', async(req, res) => {
    try {
        const results = await abc.find({}).sort({ updatedAt: -1 }); // sort by updated time 

        const response = results.map((doc) => {
            return {
                username: doc.username,
                blogs: doc.blogs
            };
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});




//remove my recent blog in myblogs
app.post('/deleterecentblog', async(req, res) => {

    const existing = await abc.findOne({ username: req.body.min }, null, { timestamps: false });

    if (existing) {


        existing.blogs.pop();
        await abc.updateOne({ username: req.body.min }, { timestamps: false });
        await existing.save();
        res.json(existing.blogs);


    } else {
        res.json("nothins brp");
    }

});





if (process.env.API_Port) {


    app.listen(process.env.API_Port);



}



module.exports = app;