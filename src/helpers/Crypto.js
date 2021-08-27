import { randomBytes, createCipheriv, createDecipheriv } from "crypto"
import jwt from 'jsonwebtoken';
import { SECRET_KEYS } from "../Config.js";

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = Buffer.from("qwertyasdfghjklt", 'utf-8');
const hex_code = 0x992320023; //REMOTE ACCESS MEMORY FREE

export const MyCrypto = {
    decryption,
    encrpytion
}

export const MyJWT = {
    createToken,
    decodeToken
}

/**
 * @description Pass is encrypted by the function
 * @param {String} pass 
 * @returns {String}
 */
function encrpytion(pass) {

    const chiper = createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([chiper.update(pass), chiper.final()]);
    
    return encrypted.toString('hex');
}


/**
 * @description Decrypted the word
 * @param {String} content
 * @returns {String}
 */
function decryption(content) {

    const decipher = createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);

    return decrpyted.toString();
}


/**
 * 
 * @param {Object} payload 
 * @returns {String}
 */
function createToken(payload) {
    console.log(payload);
    let token = jwt.sign(payload, SECRET_KEYS.JwtKey, {expiresIn: "90d"});
    return token;
}


/**
 * 
 * @param {String} token
 * @returns {any}
 */
function decodeToken(token) {
    let decodeText = jwt.decode(token);
    return decodeText;
}