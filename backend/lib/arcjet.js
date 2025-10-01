import arcjet, { tokenBucket, shield, detectBot }from "@arcjet/node";

import "dotenv/config"

//initialise arcjet
export const aj= arcjet({
    key: process.env.ARCJET_KEY,
    characteristics:"ip.src",
    rules:[
        //Arcjet Shield WAF analyzes every request to your application to detect suspicious activity. Once a certain suspicion threshold is reached, subsequent requests from that client are blocked for a period of time.
        shield({mode:"LIVE"}),
        detectBot({
            mode:"LIVE",
            //block all bots except search engines
            allow:[
            "CATEGORY:SEARCH_ENGINE",
            //see full list at https://github.com/arcjet/arcjet-js/blob/main/protocol/well-known-bots.ts
            ]
        }),
        //rate limiting
        tokenBucket({
            mode:"LIVE",
            refillRate:5,
            interval:10,
            capacity:10,
        })
    ]
})