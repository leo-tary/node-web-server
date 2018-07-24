const hbs = require('hbs');
const express = require('express');

const fs = require('fs');

// returns function
//console.log(typeof express);

const port = process.env.PORT || 3400;
const app = express();

app.set('view engine' ,'hbs');

/**
 * 
 *  Fun facts:
 *  1) If you have a code that needs to be injected at various places (reusable), we use partials (hbs) for the 
 *      same. Like header / footer which can be injected at multiple places (created only once)
 *  2) registerHelper is like re-usable functions. We create functions and result from them can be used as inject(ion)
 *      to various templates.
 *  3) hbs first checks the helper to find the data (like getCurrentYear) and then look for actual data Object 
 *      (like homeObj , aboutObj etc.) - Need Clarity
 */

hbs.registerPartials(__dirname + '/views/partials');
// Function Name , Function Definition
hbs.registerHelper('getCurrentYear' , () => {
    return new Date().getFullYear();
})
// Passing Parameter
hbs.registerHelper('myWorld' , (text) => {
    return text.toUpperCase();
})

/**
 * 
 *  Fun facts
 *  a) To serve a static directory using express , simplest way to create a static web-server
 *  b) To create static web-server (i.e. a directory where we can place images / js files / html files etc.), we 
 *      use express middleware :-
 *          app.use(express.static(__dirname + 'PATH_TO_STATIC_FILE'))
 *  c) Middleware:- Utility to create stuff which aren't provided by default (say by Express) and adds on to the existing
 *                  functionality. For instance tweaking the request-response cycle ; adding loggers ; authentication 
 *                  etc. 
 *      
 */

 app.use(express.static(__dirname + '/public'));

 app.use((req , res , next) => {
    const dateTime = new Date().toString();
    const logger = `Current Time: ${dateTime}: ${req.method} - ${req.path}`
    console.log();
    fs.appendFile('logs/server.log' , logger + '\n'  , (err) => {
        if(err){
            console.log("Error during file operation...");
        }
    })
    next();
 })


// app.use((req , res , next) => {

//     const maintenenceObj = {

//         headerTitle: 'Maintenance Alert!!',
//     };
//     res.render('maintenance.hbs',maintenenceObj);

// })


// Adding routes

/**
 *  
 *  Fun facts
 *  1) .get() takes 2 arguments:-
 *      a) url for the request (that's going to be invoked by the user / client)
 *      b) callback funtion with two parameters (req , res). This function gets called for any response to be 
 *          sent to the client
 *             b.1) req param loads tons of information like headers sent during request , input params passed etc.
 *             b.2) res param provides all the methods using which we can repond back to client with all the required
 *                  information.
 *  2) Once the route(s) is setup app still needs to be configured for the clients to send the request. We need to call
 *      app.listen(). This function will bind the application to a port on the machine.
 * 
 *  3) We can even send html formatted text as a respomse to the client. Note content-type header sent with response 
 *      is "text/html". That's the beauty of EXPRESS. We don't explicitly set the response content-type and that being
 *      set by Express itself (express handles all the mundane tasks at it's own end). 
 * 
 *  4) To send different content-type (from text/html), send the json Object as response instead of plain text or html. 
 *      This will set the response content-type to application/json.
 *      
 *     
 */
app.get('/' , (req , res) =>{

    //res.send("Hello Express!!");
    const homeObj = {
        pageTitle: 'Home Page',
        headerTitle: 'Welcome To My World!!',
        name: 'Tarun',
        age: 34
    };

 //   res.send(userObj);

    res.render('home.hbs' , homeObj);

})

app.get('/about' , (req , res) => {

    const aboutObj = {
        headerTitle: 'About Us World!!!',
        pageTitle: 'About Page',

    };
    res.render('about.hbs' , aboutObj);

})

app.get('/bad' , (req , res) =>{

    const badObj = {
        requestType: '400',
        errorMessage: 'Bad Request Sent!!'
    };

    res.status(400).send(badObj);
})


app.get('/projects' , (req , res) =>{

    const projectObj = {
        headerTitle: 'Projects World!!',
        pageTitle: 'Projects Page',
        projectName: 'Node Server'
    }
    res.render('project.hbs' , projectObj);

})


app.get('/extra' , (req ,res) => {

    const extraObj = {
        dateTime: new Date().toString()
    }

    res.send(extraObj);

})


/**
 * 
 *  Fun facts:
 *  1) app.listen() takes two arguments
 *         a) port number (required) - Where application will be listened
 *         b) function (optional argument) 
 */

app.listen(port , ()=>{
    console.log(`App is listening on port ${port}...`);
})