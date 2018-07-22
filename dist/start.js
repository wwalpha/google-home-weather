"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Home = require("google-home-pusher");
const moment = require("moment");
const express = require('express');
const app = express();
const assistant = require('./assistant');
Home.ip('172.16.80.3');
const conversation = {
    lang: 'ja-JP',
    audio: {
        encodingOut: 'MP3',
        sampleRateOut: 24000,
    },
};
const auto = ['0720', '0740', '1435', '1436', '2030', '2100'];
const getNextTime = () => {
    const now = moment().format('HHmm');
    const next = moment();
    let nextTime = auto.find(item => now < item);
    if (!nextTime) {
        nextTime = auto[0];
        next.add(1, 'day');
    }
    console.log(`next time: ${nextTime}`);
    const hour = Number(nextTime.substr(0, 2));
    const minute = Number(nextTime.substr(2, 2));
    next.hour(hour).minute(minute);
    return next.diff(moment(), 'milliseconds');
};
const weather = () => {
    setTimeout(() => {
        const now = moment().format('HHmm');
        const query = now > '1800' ? '明日の天気' : '今日の天気';
        assistant.query(Object.assign({}, conversation, { textQuery: query })).then((fileName) => {
            Home.play(`http://172.16.80.208:9901/weather/${fileName}`);
            console.log('wait 60s for next start');
            setTimeout(weather, 30 * 1000);
        }).catch(console.error);
    }, getNextTime());
};
app.use('/weather', express.static('mp3'));
app.listen(9902, () => {
    console.log('server started on port 9901');
    weather();
});
