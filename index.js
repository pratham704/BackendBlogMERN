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

    let a = req.body.fromlocalstorage
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

    const existing = await abc.findOne({ username: req.body.fromlocalstorage })

    if (existing != null) {
        res.json(existing.blogs)
    } else {


        res.json("nothins brp")


    }

});

//while editing if less than 10 

app.post('/dis', async(req, res) => {

    const existing = await abc.findOne({ username: req.body.fromlocalstorage })

    if (existing != null) {
        res.json(existing.blogs)
    } else {


        res.json("nothins brp")


    }

});









// getting last blog in /allblogs ....
// app.post('/homes', async(req, res) => {


//     let usn = req.body.mins;
//     const results = await abc.find({}).sort({  });
//     const response = results.map((doc) => {
//         return {
//             username: doc.username,
//             lastBlog: doc.blogs[doc.blogs.length - 1]
//         };
//     });

//     res.json(response);
// });
// app.post('/homes', async(req, res) => {
//     let usn = req.body.mins;
//     const results = await abc.find({});
//     const response = results.map((doc) => {
//         return {
//             username: doc.username,
//             lastBlog: doc.blogs[doc.blogs.length - 1]
//         };
//     });

//     response.sort(() => Math.random() - 0.5); // sort randomly

//     res.json(response);
// });


app.post('/homes', async(req, res) => {
    let usn = req.body.mins;
    const results = await abc.find({}).sort({ updatedAt: -1 });
    const response = results.map((doc) => {
        return {
            username: doc.username,
            lastBlog: doc.blogs[doc.blogs.length - 1]
        };
    });

    // Shuffle the response array randomly
    for (let i = response.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [response[i], response[j]] = [response[j], response[i]];
    }

    res.json(response);
});





//post all blogs
app.post('/getRecentblog', async(req, res) => {

    const results = await abc.find({}).sort({ updatedAt: -1 }); // sort by updated time 

    const response = results.map((doc) => {
        return {
            username: doc.username,
            blogs: doc.blogs.reverse()
        };
    });

    res.status(200).json(response);

});




//remove my recent blog in myblogs
app.post('/deleterecentblog', async(req, res) => {

    const existing = await abc.findOne({ username: req.body.fromlocalstorage }, null, { timestamps: false });

    if (existing) {


        existing.blogs.pop();
        await abc.updateOne({ username: req.body.fromlocalstorage }, { timestamps: false });
        await existing.save();
        res.json(existing.blogs);


    } else {
        res.json("nothins brp");
    }

});




//delete particular

app.post('/deletenumber', async(req, res) => {

    const { fromlocalstorage, index } = req.body;

    const use = await abc.findOne({ username: fromlocalstorage });
    const blogIndex = parseInt(index);
    use.blogs.splice(blogIndex, 1); // delete the blog post at the specified index
    await use.save();
    res.json(use.blogs);

});

//search 



// app.post('/searchs', async(req, res) => {

//     let a = req.body.username
//     const user = await abc.findOne({ username: a });
//     res.json(user);
//     console.log(user);

// });


app.post('/searchs', async(req, res) => {
    const username = req.body.username;
    const user = await abc.findOne({ username });

    if (user) {
        res.json({ blogs: user.blogs.reverse() });
    } else {
        res.json({ blogs: [] });
    }
});

app.post('/autocomplete', async(req, res) => {
    const query = req.body.query;
    const usernames = await abc.distinct('username', { username: { $regex: query, $options: 'i' } });
    res.json({ usernames });
});


//fill when editing

app.post('/filltext', async(req, res) => {

        let usn = req.body.fromlocalstorage;
        let blogindex = req.body.index;

        const foundDoc = await abc.findOne({ username: usn })

        const blogData = foundDoc.blogs[blogindex];

        return res.json(blogData);



    }

)

// edit and save

app.post('/savechanges', async(req, res) => {

        let usn = req.body.fromlocalstorage;
        let blogindex = req.body.index;
        let cont = req.body.cont;

        const foundDoc = await abc.findOne({ username: usn })

        // Replace blog at specified index with new content
        foundDoc.blogs[blogindex] = cont;

        // Save updated document to database
        await foundDoc.save();

        const existing = await abc.findOne({ username: usn })


        res.json(existing.blogs)




    }

)





if (process.env.API_Port) {


    app.listen(process.env.API_Port);



}








module.exports = app;
