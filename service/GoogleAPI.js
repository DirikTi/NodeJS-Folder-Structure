import { drive_v3, google } from 'googleapis';
import fs from 'fs';
import readline from 'readline';
import { GoogleAPIError } from '../src/models/Errors.js';
import streamifier from 'streamifier';

const CREDENTIALS_PATH = "credentials.json";
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';
const PARENT_PHOTO_FOLDER_ID = "1KdBSvDif2s__uQ140mRpHQqfuqulX26h";
const PARENT_VIDEO_FOLDER_ID = "1myx5LSbQJmX-m8I3OshDlWsV7QrguoWd";

var drive = google.drive("v3");

export function GoogleAPIinit() {

    fs.readFile(CREDENTIALS_PATH, (err, content) => {
        if (err)
            return console.log('Error loading client secret file:', err);

        let credentials = JSON.parse(content).web;

        authorize(credentials);

    });
}

function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);


    //Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err)
            return getAccessToken(oAuth2Client);


        oAuth2Client.setCredentials(JSON.parse(token));

        drive = google.drive({ version: "v3", auth: oAuth2Client })
        
    });
}

function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) 
                return console.error('Error retrieving access token', err);
            
            oAuth2Client.setCredentials(token);
            drive = google.drive({ version: "v3", auth: oAuth2Client })
            
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {

                if (err)
                    return console.error(err);

                console.log('Token stored to', TOKEN_PATH);
            });
        });
    });
}


/**
 * @description Upload a video to Google drive
 * @param {String} videoName 
 * @param {fs.ReadStream} body 
 * @returns {String} video Id
 */
export async function uploadVideoAsync(videoName, body) {

    let resp = await drive.files.create({
        requestBody: {
            name: videoName,
            parents: [PARENT_VIDEO_FOLDER_ID],
            mimeType: "video/mp4"
        },
        media: {
            mimeType: "video/mp4",
            body
        }
    })

    return resp.data.id; 
}


/**
 * @description Upload a photo to Google drive
 * @param {String} photoName 
 * @param {Buffer} buffer 
 * @returns {String}
 */
export async function uploadPhotoAsync(photoName, buffer) {

    let stream = streamifier.createReadStream(buffer);

    try {
        let res = await drive.files.create({
            requestBody: {
                name: photoName,
                parents: [PARENT_PHOTO_FOLDER_ID],
                mimeType: "image/png",
    
            },
            media: {
                mimeType: "image/png",
                body: stream
            }
        });
        
        return res.data.id;
    } catch (error) {
        console.log(error);
        throw new GoogleAPIError(error);
    }
    


}


function listFiles(auth) {
    const drive = google.drive({ version: "v3", auth });
    drive.files.list({
        pageSize: 10,
        fields: "nextPageToken, files(id,name)",
    }, (err, res) => {
        if (err)
            return console.log("The API returned an error: " + err);
        const files = res.data.files;
        if (files.length) {
            console.log(files);
        }
    })
}