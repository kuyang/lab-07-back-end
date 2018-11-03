'use strict'

require('dotenv').config();

const cors = require('cors');
const express = require('express');
const superagent = require('superagent');

const app = express();

const PORT = process.env.PORT||3000;

app.use(cors())

//********* ROUTES ********

app.get('/location',(request, response) => {
    getLocation(request.query.data)
        .then(res => response.send(res))
        .catch(err => response.send(err))
})

app.get('/weather', getWeather)

// app.get('/location',(request, response) => {
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAW1TEC4aep3rrsRW9Z8EYiYNOC8d387v0&address=7600+wisconsin+ave+Bethesda+MD`
//     superagent.get(url)
//         .then(res => response.send({
//             latitude: res.body.results[0].geometry.location.lat,
//             longitude: res.body.results[0].geometry.location.lng
//         }))
//     .catch(err => response.send('<img src="http://http.cat/404" />'))
    
// })

// app.get('/weather',(request, response) => {
//     const url = `https://api.darksky.net/forecast/6852ea92d3dacece95b7c3ba1d4c2d57/37.8267,-122.4233`
//     superagent.get(url)
//         .then(res => response.send(res.body))
// })


// app.get('/weather',(request, response) => {
//     const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_CODE}/37.8267,-122.4233`
//     superagent.get(url)
//         .then(res => response.send({
//              Weekforcast: res.body.daily.summary,
//              temperature: res.body.currently.temperature,
//              forcast: res.body.hourly.summary

//         }))
// })


app.get(`*`, (request,response) => {
    response.send(`<img src="http://http.cat/500" />`);
})

app.listen(PORT, () => {
    console.log(`Yo the server jawnt is now running on port: ${PORT}`)
})

//****** LOCATION *******

function getLocation(query){
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLEGEOCODE_API_KEY}&address=${query}`
    return superagent.get(url)
        .then(res => {
            return new Location(res.body.results[0].geometry.location.lat, res.body.results[0].geometry.location.lng)
        })
}

function Location(lat,lng){
    this.latitude = lat;
    this.longitude = lng;

}

//****** WEATHER ******
function getWeather(request, response){
    const url= `https://api.darksky.net/forecast/${process.env.DARKSKY_API_CODE}/${request.query.data}`
    superagent.get(url)
        .then(res => response.send(new Weather(res.body)))
        .catch(err => response.send(HandleError(err)))
}

function Weather(weatherObj){
    this.location = weatherObj.timezone,
    this.WeekForcast = weatherObj.daily.summary,
    this.temperature = weatherObj.currently.temperature,
    this.forcast = weatherObj.hourly.summary
}

//******* Error handeler ********

function HandleError(err){
    return({error: err, message:`Someting is broken dude!!!`})
}