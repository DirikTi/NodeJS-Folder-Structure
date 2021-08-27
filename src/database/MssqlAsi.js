import mssql from 'mssql';
import { MSSQL_INFO } from '../Config.js';
import { DatabaseError } from '../models/Errors.js';

class MsSql {
    constructor(options) {
        this.connection = new mssql.ConnectionPool(options);
        this.connection.connect().then((resp) =>{
            if(resp.connected) {
                console.log("MS SQL Connected");
            }
            else{
                new DatabaseError(null, "MS SQL not connected");
                console.log("MS SQL NOT CONNECTED");
            }
                
        });

    }
    

    /**
     * @description Execute query sql You can just use EXEC, INSERT, UPDATE, DELETE
     * @param {string} queryString 
     */
    async executeQuery(queryString) {
        if(queryString == "" || typeof queryString != "string")
            throw "ERROR Query is null";
        
        let {recordset, recordsets } = await this.connection.query(queryString);
        
        return { recordset, recordsets };


    }
}

const mssqlAsi = new MsSql(MSSQL_INFO);
export default mssqlAsi;