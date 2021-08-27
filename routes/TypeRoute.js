import { Router } from "express";
import cache from "memory-cache";
import mssqlAsi from "../src/database/MssqlAsi.js";
import { errorResponse, failureResponse, successResponse } from '../src/helpers/ResponseService.js';


const router = Router();

router.get("/", async (req, res) => {
    let cache_typesData = cache.get("types");
    
    if(cache_typesData == undefined) {
       let results = await mssqlAsi.executeQuery("SELECT type_name, image, description FROM types WHERE isActive=" + 1);
    
       res.json(successResponse(results.recordset, "Get Types"));
    } 
    else {
        res.json(successResponse(cache_typesData, "Get Types From CACHE"));
    }
    
    res.end();
});


export default router;