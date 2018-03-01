const botBuilder = require('claudia-bot-builder');
const AlexaMessageBuilder = require('alexa-message-builder');

module.exports = botBuilder(function (message){
  return new AlexaMessageBuilder().addText('Hello my dear viewers from Twitch! How are you?').get();
}, { platforms: ['alexa'] });
