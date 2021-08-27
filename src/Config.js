export const PATH = "C:/CODES/projects/Wordexp/nodejs";

/**
 * @description {enabled, disabled}
 */
export const LOG_OPTIONS = {
    INFO: true,
    WARNING: true,
    ERROR: true,
}

export const MYSQL_INFO = {
    connectTimeout: 10,
    password: 'root',
    user: 'root',
    database: 'test',
    host: 'localhost',
    port: 3306
}

export const MSSQL_INFO = {
    user: "sa",
    password: "root",
    database: "wordexp",
    server: 'DESKTOP-LO92SV8',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
    }
}

export const  SECRET_KEYS ={
    JwtKey : "Your Secret Key in here",
    API_KEY_ANDROID: "",
    API_KEY_APPLE: "",
}

export const CONFIG = {
    corsOptions: {
        origin: 'http://localhost:8080',
        optionsSuccessStatus: 200,
    },
    memcached: {
        retries: 10,
        retry: 10000,
        remove: true
    },
}