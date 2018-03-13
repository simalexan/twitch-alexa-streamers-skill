const rp = require('minimal-request-promise');
const querystring = require('querystring');
const YT_API_KEY = process.env.YT_KEY;
const YT_GAME_CATEGORY = 20;

module.exports = function (gameName){

    console.log(gameName);
    console.log(YT_API_KEY);
    let parameters = {
        key: YT_API_KEY,
        part: 'snippet',
        q: gameName,
        videoCategoryId: YT_GAME_CATEGORY,
        maxResults: 1,
        eventType: 'live',
        type: 'video',
        chart: 'mostPopular'
    }

    console.log(parameters)

    return rp.get(`https://content.googleapis.com/youtube/v3/search?${querystring.stringify(parameters)}`)
      .then(ytResponse => {
          console.log(ytResponse);
          let videosResponse = JSON.parse(ytResponse.body).items;
          let videos = videosResponse.map(item => item.snippet);
          return `${videos[0].title} by ${videos[0].channelTitle}`;
      }).catch(err => {
          return Promise.reject({message: JSON.stringify(err)})
      });
};