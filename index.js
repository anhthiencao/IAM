// Import the express lirbary
const express = require('express')

// Import the axios library, to make HTTP requests
const axios = require('axios')

// This is the client ID and client secret that you obtained
const clientID = '2kJ5YyusrTjBhJMPbnCUu0y5FQwa'
const clientSecret = 'CJ0f4f3wTOM27m8WaXr9bIIBgtka'

// Create a new express application and use
// the express static middleware, to serve all files
// inside the public directory
const app = express()
app.use(express.static(__dirname + '/public'))
let data = clientID+':'+clientSecret;
let buff = new Buffer(data);
var idToken = ''

//base64 encoding
let base64data = buff.toString('base64');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
var codeTemp = ''

app.get('/oauth2client', (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  
  const requestToken = req.query.code
  console.log(req.query);
  axios({
    // make a POST request
    method: 'post',
    // to the wso2 is authentication API, with the client ID, client secret
    // and request token

    url: `https://localhost:9443/oauth2/token?grant_type=authorization_code&code=${requestToken}&redirect_uri=http://localhost:8080/oauth2client`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      Authorization: 'Basic '+base64data,
      accept: 'application/json'

    }
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    const accessToken = response.data.access_token
    // redirect the user to the welcome page, along with the access token
    res.redirect(`/welcome.html?access_token=${accessToken}`)
  }).catch((err) => {
    // Do somthing
	console.log(err)
  })
})

app.get('/logout', (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  
  const requestToken = req.query.code

  axios({
    // make a POST request
    method: 'post',
    // to the wso2 is authentication API, with the client ID, client secret
    // and request token

    url: `https://localhost:9443/oauth2/token?grant_type=authorization_code&code=${codeTemp}&redirect_uri=http://localhost:8080/oauth2client`,
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
app.listen(8080)
