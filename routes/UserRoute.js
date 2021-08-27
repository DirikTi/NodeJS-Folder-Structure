import { Router } from "express";
import mssqlAsi from '../src/database/MssqlAsi.js';
import { errorResponse, failureResponse, successResponse } from '../src/helpers/ResponseService.js';
import AuthMiddleware from '../src/middleware/Authtencation.js';
import Validation from '../src/middleware/Validation.js';

const router = Router();

router.get("/follow/getInfos", [AuthMiddleware()], async(req, res) => {

    let query = "EXEC dbo.getFollowInfos @user_id='" + req.userID + "'";
    let result = await (await mssqlAsi.executeQuery(query)).recordsets;
    
    //Index = 0 => users
    //Index = 2 => dictionaries
    //Index = 1 => categories
    console.log(result[0]);
    res.json(successResponse({
        users: result[0],
        dictionaries: result[2],
        categories: result[1]
    }))

    res.end();
});

export default router;