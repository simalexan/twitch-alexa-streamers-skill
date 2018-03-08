const botBuilder = require('claudia-bot-builder');
const AlexaMessageBuilder = require('alexa-message-builder');
const rp = require('minimal-request-promise');
const CLIENT_ID = '<YOUR-TWITCH-CLIENT-ID>';

module.exports = botBuilder(function (message){
  let intent = message.originalRequest.request.intent;
  if (!intent) {
    return new AlexaMessageBuilder()
      .addText('Sorry, I didn\'t understand your Streamer question.')
      .get();
  }
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
      let games = JSON.parse(gameResponse.body);
      if (!games || !games.data || games.data.length < 1){
          return new AlexaMessageBuilder().addText('There isn\'t such a game, sorry! Try again.').get();
      }
      let selectedGameId = games.data[0].id;
      console.log(selectedGameId);
      return rp.get(`https://api.twitch.tv/helix/streams?game_id=${selectedGameId}`,
        { headers: { 'Client-ID': CLIENT_ID } });
    }).then(streamsResponse => {
      let streams = JSON.parse(streamsResponse.body);
      if (!streams || !streams.data || streams.data.length < 1) {
        return new AlexaMessageBuilder().addText('No streams for this game, sorry').get();
      }
      let mostWatchedStream = streams.data[0];
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
    .addText('Sorry, I didn\'t quite understand what you wanted, ask me to say hi or to tell you which game\'s streamer is the most watched on some platform.')
	.get();
}, { platforms: ['alexa'] });
