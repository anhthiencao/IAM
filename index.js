// Import the express lirbary
const express = require('express')

// Import the axios library, to make HTTP requests
const axios = require('axios')

// This is the client ID and client secret that you obtained
const clientID = '0aT4RyRSYOqsBKwsbmHsIcYwq1ca'
const clientSecret = 'VffkV69lSXw1FysVJYojxshSi9Ea'

// Create a new express application and use
// the express static middleware, to serve all files
// inside the public directory
const app = express()
app.use(express.static(__dirname + '/public'))
let data = clientID+':'+clientSecret;
let buff = new Buffer(data);

//base64 encoding
let base64data = buff.toString('base64');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.get('/oauth', (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  
  const requestToken = req.query.code
  console.log(requestToken+'\n');
  console.log(base64data);
	
  axios({
    // make a POST request
    method: 'post',
    // to the wso2 is authentication API, with the client ID, client secret
    // and request token

    url: `https://localhost:9443/oauth2/token?grant_type=authorization_code&code=${requestToken}&redirect_uri=http://localhost:8010/oauth`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      Authorization: 'Basic '+base64data,
      accept: 'application/json'

    }
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
	console.log(response.data.access_token)
    const accessToken = response.data.access_token
    // redirect the user to the welcome page, along with the access token
    res.redirect(`/welcome.html?access_token=${accessToken}`)
  }).catch((err) => {
    // Do somthing
	console.log(err)
  })
})

// Start the server on port 8080
app.listen(8010)
