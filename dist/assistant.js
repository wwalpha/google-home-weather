"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const GoogleAssistant = require("google-assistant");
const fs = require("fs");
const config = {
    auth: {
        keyFilePath: path.resolve(__dirname, '../credential/client_secret.json'),
        savedTokensPath: path.resolve(__dirname, '../credential/tokens.json'),
    },
};
exports.query = (conversation) => new Promise((resolve, reject) => {
    const assistant = new GoogleAssistant(config.auth);
    const startConversation = (conversation) => {
        const timestamp = new Date().getTime();
        const filename = path.resolve(__dirname, `../mp3/${timestamp}.mp3`);
        console.log(1);
        conversation
            .on('audio-data', (data) => {
            fs.appendFileSync(filename, data);
        })
            .on('response', (text) => {
            console.log('response', text);
        })
            .on('end-of-utterance', () => {
        })
            .on('transcription', (data) => {
        })
            .on('volume-percent', (percent) => {
        })
            .on('device-action', (action) => {
        })
            .on('screen-data', (screen) => {
        })
            .on('ended', (error, continueConversation) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(`${timestamp}.mp3`);
        })
            .on('error', (error) => reject(error));
    };
    assistant
        .on('ready', () => {
        assistant.start(conversation, startConversation);
    })
        .on('error', (err) => reject(err));
});
