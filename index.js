const alexaSkillKit = require('alexa-skill-kit');
const AlexaMessageBuilder = require('alexa-message-builder');
const rp = require('minimal-request-promise');
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;

exports.handler = function (event, context) {
  return alexaSkillKit(event, context, message => {

    let intent = message.intent;



    if (intent.name == 'MostWatchedGameStreamer'){
      let gameName = intent.slots.game.value.toLowerCase();
      let platform = intent.slots.platform.value.toLowerCase();

      console.log(gameName);
      console.log(platform);

      if (platform != 'twitch') {
        return new AlexaMessageBuilder().addText(`Sorry, ${platform} is not supported yet! Please try at a later time!`).get();
      }

      return rp.get(`https://api.twitch.tv/helix/games?name=${gameName}`,{
        headers: { 'Client-ID': CLIENT_ID }
      }).then(gameResponse => {
        let games = JSON.parse(gameResponse.body).data;
        if (!games || games.length < 1){
            return new AlexaMessageBuilder().addText('There isn\'t such a game, sorry! Try again.').get();
        }
        let selectedGameId = games[0].id;
        console.log(selectedGameId);
        return rp.get(`https://api.twitch.tv/helix/streams?game_id=${selectedGameId}`,
          { headers: { 'Client-ID': CLIENT_ID } });
      }).then(streamsResponse => {
        let streams = JSON.parse(streamsResponse.body).data;
        if (!streams || streams.length < 1) {
          return new AlexaMessageBuilder().addText('No streams for this game, sorry!').get();
        }
        let mostWatchedStream = streams[0];
        console.log(mostWatchedStream);
        return new AlexaMessageBuilder()
          .addText(`The most watched stream is ${mostWatchedStream.title}`)
          .get();
      })
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
