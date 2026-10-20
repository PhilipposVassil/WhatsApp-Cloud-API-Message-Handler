"use strict";

// Use dotenv to read .env vars into Node
require("dotenv").config();

// Required environment variables
const ENV_VARS = [
    "APP_ID",
    "APP_SECRET",
    "VERIFY_TOKEN",
    "APP_URL",
];


module.exports = {
    // Messenger Platform API
    apiDomain: "https://graph.facebook.com",
    apiVersion: "v25.0",

    // Page and Application information
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
    verifyToken: process.env.VERIFY_TOKEN,

    // URL of your app domain
    appUrl: process.env.APP_URL,

    // Preferred port (default to 3000)
    port: process.env.PORT || 3000,

    // Base URL for Messenger Platform API calls
    get apiUrl() {
        return `${this.apiDomain}/${this.apiVersion}`;
    },

    checkEnvVariables: function () {
        ENV_VARS.forEach(function (key) {
            if (!process.env[key]) {
                console.warn("WARNING: Missing the environment variable " + key);
            }
        });
    }
};