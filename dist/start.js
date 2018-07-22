"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Home = require("google-home-pusher");
const express = require('express');
const app = express();
const assistant = require('./assistant');
app.use('/weather', express.static('mp3'));
Home.ip('172.16.80.3');
app.listen(9901, () => {
    console.log('server started on port 9901');
    assistant.query({
        lang: 'ja-JP',
        textQuery: '中央区の天気',
        audio: {
            encodingOut: 'MP3',
            sampleRateOut: 24000,
        },
    }).then((fileName) => {
        Home.play(`http://172.16.80.208:9901/weather/${fileName}`);
    }).catch(console.error);
});