const path = require('path');
import * as GoogleAssistant from 'google-assistant';
import * as fs from 'fs';

const config = {
  auth: {
    keyFilePath: path.resolve(__dirname, '../credential/client_secret.json'),
    savedTokensPath: path.resolve(__dirname, '../credential/tokens.json'),
  },
};

// conversation: {
//   lang: 'ja-JP',
//     textQuery: '中央区の天気',
//       audio: {
//     encodingOut: 'MP3',
//       sampleRateOut: 24000,
//   },
// },

export const query = (conversation: any) => new Promise((resolve, reject) => {
  const assistant = new GoogleAssistant(config.auth);

  const startConversation = (conversation: any) => {
    const timestamp = new Date().getTime();
    const filename = path.resolve(__dirname, `../mp3/${timestamp}.mp3`);
    console.log(1);
    conversation
      .on('audio-data', (data: any) => {
        fs.appendFileSync(filename, data);
      })
      .on('response', (text: string) => {
        console.log('response', text);
      })
      .on('end-of-utterance', () => {
      })
      .on('transcription', (data: any) => {
      })
      .on('volume-percent', (percent: any) => {
      })
      .on('device-action', (action: any) => {
      })
      .on('screen-data', (screen: any) => {
      })
      .on('ended', (error: any, continueConversation: any) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(`${timestamp}.mp3`);
        // // once the conversation is ended, see if we need to follow up
        // if (error) console.log('Conversation Ended Error:', error);
        // else if (continueConversation) assistant.start();
        // else console.log('Conversation Complete');
      })
      .on('error', (error: any) => reject(error));
  };

  assistant
    .on('ready', () => {
      assistant.start(conversation, startConversation);
    })
    .on('error', (err: any) => reject(err));
});
