import { Router } from "express";
import mssqlAsi from "../src/database/MssqlAsi.js";
import { errorResponse, failureResponse, successResponse } from "../src/helpers/ResponseService.js";
import AuthMiddleware from "../src/middleware/Authtencation.js";
import Validation from "../src/middleware/Validation.js";


const router = Router();

//Owner/User Id
router.get('/owner/getByCategoryById', [AuthMiddleware()], async (req, res) => {
    let getCategoryId = req.query.id;

    if(getCategoryId == undefined) {
        res.json(errorResponse(null, "BAD REQUEST", 400));
        return -1;
    }

    let query = "SELECT dictionary.id, dictionary.name, dictionary.isPublic, dictionary.star, dictionary.description, dictionary.price, " +
    "COUNT(commits.id) AS commit_count" +
    " FROM dictionary INNER JOIN commits ON commits.dictionary_id = dictionary.id WHERE dictionary.category_id='" + getCategoryId + "' AND dictionary.user_id='" + req.userID + "'" +
    " GROUP BY dictionary.name, dictionary.isPublic, dictionary.star, dictionary.description, dictionary.price;"

    let results = (await mssqlAsi.executeQuery(query)).recordsets;

    res.json(successResponse(results, "Get dictionary List"));
    
})

router.get('/getByDictionaryId', async (req, res) => {
    let  dictionary_id = req.query.id;

    if(dictionary_id == undefined) {
        res.json(errorResponse(null, "BAD REQUEST", 400));
        
    } 
    
    let query = "EXEC dictionaryProfile @dictionary_id='" + dictionary_id + "';"

    let results = await (await mssqlAsi.executeQuery(query)).recordsets;

    res.json(successResponse({
        dictionary: results[0][0],
        shared_users: results[1],
        comments: results[2]
    }))
    res.end();

});


router.post('/add', [AuthMiddleware(), Validation(
    {name: "name", type: "string"},
    {name: "category_id", type: "string"},
    {name: "isPublic", type: "boolean"},
    {name: "description", type: "string"},
    {name: "price", type: "number"},
)], async (req, res) => {
    
    let { name, category_id, isPublic, description, price } =  req.body;
    const userID = req.userID; 

    let querySelect = "SELECT id FROM dictionary WHERE user_id='" + userID + "' AND name='" + name + "'";

    let results = await (await mssqlAsi.executeQuery(querySelect)).recordset;

    if(results.length != 0) {
        res.json(failureResponse(null, "Has Recored"));
        res.end();
        return -1;
    }

    let query = "INSERT INTO dbo.dictionary (id, name, user_id,category_id, isPublic, description, price, createDate, updateDate) " +
    "OUTPUT inserted.id VALUES (NEWID(), '" + name + "', '" + userID + "', '" + category_id + "', " 
    + Number(isPublic) + ", '" + description + "', " + price + ", GETDATE(), GETDATE())";

    try{
        let id = await (await mssqlAsi.executeQuery(query)).recordset;

        res.json(successResponse(id[0]));
    }catch(err) {
        res.json(errorResponse(null, "INTERNAL SERVER ERROR", 500));
    }

    res.end();
})


router.head('/')

export default router;