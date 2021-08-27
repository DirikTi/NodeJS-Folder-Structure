import { errorResponse, failureResponse } from "../helpers/ResponseService.js";
import { ValidationError } from "../models/Errors.js";

/**
 * @description Validation Middleware
 * @param  {...Array} params 
 */
export default function Validation(...params) {

    /**
     * @param {Request} req
     * @param {Response} resp
     * @param {NextFunction} next
     */
    return function (req, resp, next) {
        
        let reqKeys = Object.keys(req.body);
        let errorMessage = "Url :" + req.url + "\t Params:" + params + "\t Requests:" + JSON.stringify(reqKeys);

        if (params.length != reqKeys.length) {
            resp.json(errorResponse(null, "Bad Request", 400));
            new ValidationError(errorMessage, "Error Bad request");
            return -1;
        }


        for (let i = 0; i < params.length; i++) {
            let value = req.body[params[i].name];
            if (value == undefined || typeof value != params[i].type ) {
                resp.json(errorResponse(null, "Bad Request", 400));
                new ValidationError(errorMessage, "Error Bad request");
                return -1;
            }
        }

        next();
    }
}
