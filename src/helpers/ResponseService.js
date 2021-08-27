'use strict'
import { LOG_OPTIONS } from "../Config.js";
import { log_error, log_info, LOG_TYPES } from "./Logger.js"

/* Asikus Response Service */


/**
 * @desc    Send Success Response JSON
 *
 * @param   {any}  data Response Data default data=null
 * @param   {string} message message=Success SERVICE
 */
export function successResponse(data = null, message = "Success SERVICE") {

    LOG_OPTIONS.INFO ? log_info(message, LOG_TYPES.INFO) : null;

    return {
        data,
        status: 200, 
        message,
        success: true,
        error: false,
    }   
}

/**
 * @desc    Send Failure Response JSON
 *
 * @param   {any}  data Response Data default data=null
 * @param   {string} message message=Fail Service
 */
export function failureResponse(data = null, message = "Fail SERVICE"){

    LOG_OPTIONS.WARNING ? log_info(message, LOG_TYPES.WARNING) : null; 
    

    return {
        data,
        status: 200,
        message,
        success: false,
        error: false
    }

}

/**
 * @desc    Send Fail Response JSON
 *
 * @param   {any}  data Response Data default data=null
 * @param   {string} error error
 * @param   {string} message message=FAILURE
 */
export function errorResponse(data = null, message = "", status) {
    
    LOG_OPTIONS.ERROR ? log_info(message, LOG_TYPES.ERROR) : null;

    return {
        data,
        status,
        message,
        success: false,
        error: true
    }   
}