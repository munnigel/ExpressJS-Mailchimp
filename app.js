const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
// const request = require('request');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
})

app.post('/', function (req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    console.log(name, email, password)

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: name,
                    LNAME: name
                }
            }
        ]
    }
    //data is data to be send to mailchimp. This data is send via the body parameters using a key called members.
    const jsonData = JSON.stringify(data);

    const url = "https://us4.api.mailchimp.com/3.0/lists/4bcf3cbb34"

    const options = {
        method: 'POST',
        auth: "nigel1: fd8d2a9477b41c113e1d4a29c6120-us4" //nigel1 does not mean anything, it is just a placeholder username. After the colon is the auth key for mailchimp to access the HTTP requests
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }


        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData); //write the data to the POST request to send to mailchimp
    request.end(); //finish the request

})


app.post("/failure", function(req, res) {
    res.redirect("/");
})
//Redirect back to main page which shows the login form again


app.listen(3000, function () {
    console.log('Server is running on port 3000');
}
);