import { Router } from 'express';
import { uploadPhotoAsync } from '../service/GoogleAPI.js';
import mssqlAsi from '../src/database/MssqlAsi.js';
import { MyCrypto, MyJWT } from '../src/helpers/Crypto.js';
import { errorResponse, failureResponse, successResponse } from '../src/helpers/ResponseService.js';
import AuthMiddleware from '../src/middleware/Authtencation.js';
import { uploadPhotoMiddleware } from '../src/middleware/FilesMiddleware.js';
import Validation from '../src/middleware/Validation.js';

const router = Router();

/**
 * @description req.body has { email, password }
 */
router.post('/login', Validation(
{name: "email", type: "string"},
{name: "password", type: "string"}), async (req, res) => {

    let { password, email } = req.body;

    let encryptedPassword = MyCrypto.encrpytion(password);

    let results = await (await mssqlAsi.executeQuery("EXEC loginUser @email='" + email + "', @password='" + encryptedPassword + "';")).recordset;

    if (results[0] == undefined) {
        res.json(failureResponse(null, "User Not Found"));
        return -1;
    }

    let jwt_token = MyJWT.createToken({ token: results[0].token });
    delete results[0].token;

    res.json(successResponse({
        jwt_token,
        ...results[0]
    }, "Login Success"));

    return 0;
});

router.post('/register', Validation(
{name: "username", type: "string"},
{name: "email", type: "string"},
{name: "password", type: "string"},
{name: "country", type: "string"}, 
{name: "language", type: "string"}),
async (req, res) => {
    
    let { username, email } = req.body;

    let encryptedPassword = MyCrypto.encrpytion(req.body.password);
    
    let query = "EXEC registerUser @username='" + username + "', @email='" + email + "', @password='" + 
    encryptedPassword + "', @country='" + req.body.country + "', @language='" + req.body.language + "'";
    
    let users = await (await mssqlAsi.executeQuery(query)).recordset;
    
    if(users.length != 0){

        if(users.find((value) => value.email == email)) {
            res.json(failureResponse("email", "Email already recored"));
            return -1;
        }

        if(users.find((value) => value.username == username)) {
            res.json(failureResponse("username", "Username already recored"));
            return -1;
        }

    }

    res.json(successResponse(null, "Registered User"));
    res.end();
});

/**
 * @description Has User
 */
router.head('/', async (req, res) => {
    let tokenText = req.headers["Authorization"];

    if (!tokenText) {
        resp.json(errorResponse(null, "JWT Token not found", 401));
        return -1;
    }

    let jwt_token = tokenText.replace("Bearer ", "");

    if (jwt_token == "") {
        resp.json(errorResponse(null, "JWT Token not found", 401));
        return -1;
    }

    let secretMessage = MyJWT.decodeToken(jwt_token);

    let query = "SELECT username, email, isActive_Notification, isActive_Email, isPremium, avatar, country, language" +
        " FROM users WHERE token='" + secretMessage + "'"
    let user = await (await mssqlAsi.executeQuery(query)).recordset;

    if (user[0] == undefined) {
        resp.json(errorResponse(null, "JWT Token not found user", 401));
        return -1;
    }

    res.json(successResponse({
        ...user[0]
    }, "TOKEN CORRECT"));

    res.end();
})

router.put('/avatar', [AuthMiddleware(), uploadPhotoMiddleware.single('avatar')], async (req, res) => {

    try{
        let resultImageId = await uploadPhotoAsync(req.file.originalname, req.file.buffer);

        let query = "UPDATE users SET avatar='" + resultImageId + "' WHERE id='" + req.userID + "'";
        await mssqlAsi.executeQuery(query);

        res.json(successResponse(resultImageId, "Updated Avatar image"));
    }catch(err){
        res.json(errorResponse(null, err, 500));
    }

    res.end();
});


router.post('/update_user', [AuthMiddleware(), Validation({name: "username", type: "string"})], async (req, res) => {
    
    let { username } = req.body;

    let _user = await (await mssqlAsi.executeQuery("SELECT id FROM users WHERE username='" + req.body.username + "'")).recordset;

    if(_user[0] != undefined) {
        res.json(failureResponse(null, _user[0].id == req.userID ? "You can not set the same username" 
        : "The username is used"));
        return -1;
    }
    
    
    mssqlAsi.executeQuery("UPDATE users SET username='" + username + "'");

    res.json(successResponse(null, "Updated the username"));
    res.end();
});

router.post('/update_contacts', [AuthMiddleware(), Validation(
{name: "activeNotification", type: "boolean"},
{name: "activeEmail", type: "boolean"})] , async(req, res) => {
    
    let query = "UPDATE users SET isActive_Notification=" + req.body.activeNotification + 
    ", isActive_Email=" + req.body.activeEmail;

    mssqlAsi.executeQuery(query);

    res.json(successResponse(null, "Updated options"));
    res.end();
});

router.post('/update_other', [AuthMiddleware(), Validation(
{name: "language", type: "string"}, {name: "country", type: "string"})], 
async(req, res) => {
    let query = "UPDATE users SET language='" + req.body.language + "', country='" + req.body.country + "'";

    mssqlAsi.executeQuery(query);

    res.json(successResponse(null, "Updated others"));
    res.end();
})


export default router;