const rp = require('minimal-request-promise');
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;

module.exports = function (gameName){
    console.log(gameName)
    return rp.get(`https://api.twitch.tv/helix/games?name=${gameName}`,{
        headers: { 'Client-ID': CLIENT_ID }
      }).then(gameResponse => {
        let games = JSON.parse(gameResponse.body).data;
        if (!games || games.length < 1){
            throw new Error(`There isn't such a game! Try again.`);
        }
        let selectedGameId = games[0].id;
        console.log(selectedGameId);
        return rp.get(`https://api.twitch.tv/helix/streams?game_id=${selectedGameId}`,
          { headers: { 'Client-ID': CLIENT_ID } });
      }).then(streamsResponse => {
        let streams = JSON.parse(streamsResponse.body).data;
        if (!streams || streams.length < 1) {
          throw new Error(`No streams for this game! Try again at a later time.`);
        }
        let mostWatchedStream = streams[0];
        return `${mostWatchedStream.title} with ${mostWatchedStream.viewer_count} viewers`;
      })
}