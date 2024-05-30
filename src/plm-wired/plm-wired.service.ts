/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import {default as axios} from 'axios';
import * as jwt from 'jsonwebtoken';
import { exec } from 'child_process';

//import * as crypto from 'crypto';

import { UtilService } from 'src/util/util.service';
import { ConstantsService } from 'src/constants/constants.service';
import { readFileSync } from 'fs';

const RSA_PUBLIC_KEY = readFileSync('../secrets/private-key.pem');
const RSA_PRIVATE_KEY = readFileSync('../secrets/public-key.pem');
const cIssuer = "Bayer";
const cAudience = "www.bayer.com";
const cSubject = "Copyright © Bayer 2023";

let startedIproxy = false;
let runWiredHandshake = false; //Keeps track of if wiredHandshake is running
let iPhonePort = ``;
let iPhoneUrl = ``;

@Injectable()
export class PlmWiredService {
    constructor(private readonly utilService: UtilService, private readonly constants: ConstantsService) {
        iPhonePort = this.constants.getIPhonePort();
        iPhoneUrl = `http://localhost:${iPhonePort}`;
    }
    /* Wired Handshake Functions */
    startWiredHandshake = async (model = "", serial = "", asset = "") => {
        if (!startedIproxy) {
            exec(`${path.join('C:', 'PassLinkPlatform', 'externals', 'iproxy.exe')} ${iPhoneUrl} 80`);
            this.utilService.logData(`Started iproxy ${iPhoneUrl} 80`);
            startedIproxy = true;
        }
        const simplifiedModel = this.utilService.getModel(model);
        let returnJWT = {};
        this.utilService.logData("Starting handshake with iPhone server...");
        runWiredHandshake = true;
        while (runWiredHandshake) {
            returnJWT = await this.lookForiPhoneAndHandshake(simplifiedModel, serial, asset);
        }
        this.utilService.logData(`Stopping handshake with iPhone server...`);
        this.utilService.logDebug(`Status returned from Passlink Mobile was ${returnJWT !== undefined ? returnJWT['jwtStatus'] : "undefined"}`)
        if (returnJWT !== undefined) {
            return JSON.stringify(returnJWT);
        }
        this.utilService.logData("Could not perform wired handshake with iPhone.", true);
        return `{"jwtStatus":"failure", "jwtMessage":"Could not perform wired handshake with iPhone."}`;
    }

    isWiredHandshaking = () => {
        this.utilService.logData("Stopped wired handshake");
        return runWiredHandshake;
    }

    stopWiredHandshake = () => {
        runWiredHandshake = false;
    }

    async lookForiPhoneAndHandshake(model, serial, asset) {
        const maxRetries = 10;
        let retryCount = 0;

        let returnJWT = undefined;


        while (retryCount < maxRetries) {

            try {
                const token = this.generateJWT(model, serial, asset);
                this.utilService.logDebug(`Wired Handshake JWT Generated: ...${token.substring(token.length - 11, token.length - 1)}`);
                const response = await axios.get(iPhoneUrl + "/handshake", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const returnedJWT = response.data;
                if (response.status !== 200 || !returnedJWT) {
                    this.utilService.logData(`Unexpected response from server. Body: ${JSON.stringify(response.data)}`, true);
                }

                //Stop while loop
                retryCount = maxRetries;
                try {
                    const decodedPayload = jwt.verify(returnedJWT, RSA_PUBLIC_KEY, { algorithms: ['RS256'] });

                    if (decodedPayload.jwtStatus === "success") {
                        returnJWT = decodedPayload
                        this.utilService.logData("Handshake completed successfully.");
                    } else {
                        returnJWT = { jwtStatus: decodedPayload.jwtStatus, message: decodedPayload.jwtMessage }
                        this.utilService.logData("Handshake failed. Check your JWT or server configuration.", true);
                    }
                } catch (error) {
                    returnJWT = { jwtStatus: "failure", message: `Error decoding JWT: ${error.message}` }
                    this.utilService.logData(`Error decoding JWT: ${error.message}`, true);
                }
            } catch (error) {
                if (error.response) {
                    //Stop while loop
                    retryCount = maxRetries;
                    returnJWT = { jwtStatus: "failure", message: `Server responded with status ${error.response.status}` }
                    this.utilService.logData(`Server responded with status ${error.response.status}`, true)
                } else {
                    this.utilService.logData(`${error.message}. Retrying in 1 second...`, true);
                }
            }
            retryCount++;
            await this.sleep(500);
            //await sleep(1000);
        }
        runWiredHandshake = false;
        return returnJWT;
    }

    /*
    Create JWT from injector info
    */
    generateJWT(model, serial, asset) {
        const payload = {
            iss: cIssuer,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour of expiration
            aud: cAudience,
            sub: cSubject,
            model: model,
            serial: serial,
            asset: asset,
            jwtStatus: "jwtStatus",
            jwtMessage: "jwtMessage"
        };
        //console.log(crypto.createPrivateKey(JSON.stringify(payload)))

        const header = {
            alg: "RS256",
            kid: "yourKeyID"
        };

        try {
            return jwt.sign(payload, RSA_PRIVATE_KEY, { algorithm: 'RS256', header: header });
        } catch (error) {
            this.utilService.logData(`Error generating JWT: ${error.message}`, true)
            return undefined;
        }
    }

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
