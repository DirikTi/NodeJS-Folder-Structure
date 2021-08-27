import mssqlAsi from '../database/MssqlAsi.js';
import { MyJWT } from '../helpers/Crypto.js';
import { errorResponse } from '../helpers/ResponseService.js';


export default function AuthMiddleware() {

    /**
     * @param {Request} req
     * @param {Response} resp
     * @param {NextFunction} next
     */
    return async (req, resp, next) => {

        let tokenText = req.headers["authorization"];
        
        if(!tokenText){
            resp.json(errorResponse(null, "JWT Token not found", 401));
            return -1;
        }
            
        let token = tokenText.replace("Bearer ", "");
    
        if(token == ""){
            resp.json(errorResponse(null, "JWT Token not found", 401));
            return -1;
        }
    
        let secretMessage = MyJWT.decodeToken(token);
        
        let user = await (await mssqlAsi.executeQuery("SELECT id FROM users WHERE token='" + secretMessage.token + "'")).recordset;
    
        if(user[0] == undefined) {
            resp.json(errorResponse(null, "JWT Token not found user", 401));
            return -1;
        }
        
        req.userID = user[0].id;
        next();
    } 
} 