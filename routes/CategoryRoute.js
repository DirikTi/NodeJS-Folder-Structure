import { Router } from "express";
import mssqlAsi from "../src/database/MssqlAsi.js";
import { errorResponse, failureResponse, successResponse } from "../src/helpers/ResponseService.js";
import AuthMiddleware from "../src/middleware/Authtencation.js";
import Validation from "../src/middleware/Validation.js";

const router = Router();

router.get('/getByUserId', AuthMiddleware(), async (req, res) => {
    let getUserId  = req.query.id;

    if(getUserId == undefined) {
        res.json(errorResponse(null, "BAD REQUEST", 400));
        res.end();
        return -1;
    }
    let query = "SELECT category.id, category.name, category.description, types.type_name FROM category INNER JOIN " +
    "types ON types.id = category.type_id WHERE category.isPublic=1 AND category.user_id='" + getUserId + "'" ; 

    let results = await mssqlAsi.executeQuery(query);

    res.json(successResponse(results.recordset, "Get Category"));
    res.end();
})

router.head('/', AuthMiddleware(), async (req, res) => {
    let query = "SELECT category.id, category.name, category.description, types.type_name FROM category INNER JOIN " +
    "types ON types.id = category.type_id WHERE category.user_id='" + req.userID + "'" ;

    let results = await (await mssqlAsi.executeQuery(query)).recordset;

    res.json(successResponse(results, "Get Category"));
    res.end();
});


router.post('/add', [AuthMiddleware(), Validation(
{name: "name", type: "string"},
{name: "description", type: "string"},
{name: "isPublic", type: "boolean"},
{name: "type_id", type: "string"})], 
async (req, res) => {

    let { name, description, isPublic, type_id } = req.body;

    let resultCategory = await (await mssqlAsi.executeQuery("SELECT id FROM category WHERE user_id='" + req.userID + "' AND name='" + name +"'")).recordset;
    
    if(resultCategory[0] != undefined) {
        req.json(failureResponse(null, "The same name"));
        return -1;
    }

    let query = "INSERT INTO dbo.category (id, name, description, user_id, created_date, updated_date, isPublic, type_id)" +
    "OUTPUT inserted.id VALUES (NEWID(),'" + name + "', '" + 
    description + "', '" +req.userID + "', GETDATE(), GETDATE(), " + Number(isPublic) + ", '" + type_id + "')";

    let result = await mssqlAsi.executeQuery(query);

    res.json(successResponse(result.recordset[0].id, "Inserted Category"));
    res.end();
    return 0;
});

router.delete("/getById", [AuthMiddleware(), Validation(
{name: "category_id", type: "string"})], async (req, res) => {
    
    let category_id = req.body.category_id;
    
    let query = "SELECT id FROM dictionary WHERE category_id='" + category_id + "'";

    let resultDictionary = await mssqlAsi.executeQuery(query);

    if(resultDictionary.recordset[0] != undefined) {
        res.json(failureResponse(null, "You cannot delete"));
        return -1;
    }
    
    mssqlAsi.executeQuery("DELETE FROM category WHERE id='" + category_id + "'");

    res.json(successResponse(null, "Deleted the category"));
    res.end();
    return 0;
})


router.post("/update", [AuthMiddleware(), Validation(
{name: "isPublic", type: "boolean"}, 
{name: "description", type: "string"}, 
{name: "category_id", type: "string"},
{name: "type_id", type: "string"})], async (req, res) => {
    
    let { isPublic, description, category_id, type_id } = await req.body;

    let query = "UPDATE category SET isPublic=" + Number(isPublic) + ", description='" + description + 
    "', type_id='" + type_id + "', updated_date=GETDATE() WHERE id='" + category_id + "'";

    console.log(query);
    mssqlAsi.executeQuery(query);

    res.json(successResponse(null, "Updated the Category"));
    res.end();
});

router.post("/share", [AuthMiddleware(), Validation(
{name: "category_id", type: "string"},
{name: "user_id", type: "string"})], async (req, res) => {
    
    
});


export default router;