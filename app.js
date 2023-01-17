const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https')

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/sign-up.html')
})


app.post('/', (req, res) => {

    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const url = 'https://us17.api.mailchimp.com/3.0/lists/f96cbb5cb6'

    const options = {
        method: 'POST',
        auth: 'justfidel:9584ac1b77ce3ea61d72bb21f91024e1-us17'

    }
    const request = https.request(url, options, (response) => {
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failure.html')
        }
        
        response.on('data', (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post('/success', (req, res) => {
    res.redirect('/')
})

app.post('/failure', (req, res) => {
    res.redirect('/')
})



app.listen(process.env.POST || 3000, (req, res) => {
    console.log('Server starting at Port 3000');
})


