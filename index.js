/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //"amzn1.ask.skill.b64c7560-0f1d-4e7f-8087-1fdba44d7535"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * BESS is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var BESS = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
BESS.prototype = Object.create(AlexaSkill.prototype);
BESS.prototype.constructor = BESS;

BESS.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("BESS onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

BESS.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("BESS onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Barracuda Email Security service, you can say summary";
    var repromptText = "You can say summary";
    response.ask(speechOutput, repromptText);
};

BESS.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("BESS onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

BESS.prototype.intentHandlers = {
    // register custom intent handlers
    "SummaryIntent": function (intent, session, response) {
        session.attributes.next = "breakdown";
        response.ask("In the past 24 hours, ESS has processed 37896 messages, 3427 has been blocked. Would you like to hear a breakdown?",
        "Would you like to hear a breakdown?");
    },
    "AnswerOnlyIntent": function (intent, session, response) {
        console.log("AnswerOnlyIntent session attributes: " + session.attributes);
        if (intent.slots.Answer.value === "no") {
            response.tell("Fair enough. Stay safe out there.");
        }
        if (session.attributes.next === "breakdown") {
            session.attributes.next = "trends";
            response.ask("Out of 3427 blocked email, 93% are Spam and 7% are Viruses. Would you like to hear the trends?");
        }
        if (session.attributes.next === "trends") {
            response.tell("Viruses increased 4% versus previous 24 hours period. That's it for now.");
        }
//        if (session.attributes.next === "trends") {
//            session.attributes.next = "upsell";
//            response.ask("Viruses increased 4% versus previous 24 hours period. Barracuda Advanced threats detection will help you keep your organization secure. Would you like to talk to a sales representative now?");
//        }
//        if (session.attributes.next === "upsell") {
//            response.tell("I'm sorry, the sales department is closed right now, but Fleming says Hi.");
//          }

    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say summary to me!", "You can say summary to me!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the BESS skill.
    var bess = new BESS();
    bess.execute(event, context);
};