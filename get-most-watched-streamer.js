const youtubeHandler = require('./youtube-handler.js');
const twitchHandler = require('./twitch-handler.js');

module.exports =  (platform, gameName) => {
    console.log(platform);
    if (platform != 'twitch' && platform != 'youtube') {
        return Promise.reject({message: `${platform} is not supported yet! Please try at a later time!`});
    }

    if (platform == 'youtube') {
        return youtubeHandler(gameName);
    }

    if (platform == 'twitch') {
        return twitchHandler(gameName);
    }

    return Promise.reject({message: `There was an error in skill processing! Please contact the developer!`});
};