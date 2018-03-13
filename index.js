const alexaSkillKit = require('alexa-skill-kit');
const AlexaMessageBuilder = require('alexa-message-builder');
const rp = require('minimal-request-promise');
const getMostWatchedStream = require('./get-most-watched-streamer.js');


exports.handler = function (event, context) {
  return alexaSkillKit(event, context, message => {

    let intent = message.intent;

    if (intent.name == 'MostWatchedGameStreamer'){
      let platform = intent.slots.platform.value.toLowerCase();
      let gameName = intent.slots.game.value.toLowerCase();
      console.log(gameName);
      console.log(platform);
      return getMostWatchedStream(platform, gameName).then(mostWatchedStreamName => {
        return new AlexaMessageBuilder()
          .addText(`The most watched stream is ${mostWatchedStreamName}`)
          .get();
      }).catch(errorResponse => {
        return new AlexaMessageBuilder()
          .addText(`Sorry! ${errorResponse.message}`)
          .get();
      });
    }

    if (intent.name == 'HelloIntent') {
      return new AlexaMessageBuilder()
      .addText('Hello there my viewers from Twitch, how are you today?')
      .get();
    }

    return new AlexaMessageBuilder()
      .addText('Sorry, I didn\'t understand your Streamer question.')
      .get();

  });
};
