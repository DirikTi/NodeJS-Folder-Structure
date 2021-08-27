import express from "express";
import { createServer } from 'http';
import cors from 'cors';
//Routers
import AccountRoute from './routes/AccountRoute.js';
import TypeRoute from './routes/TypeRoute.js';
import CategoryRoute from './routes/CategoryRoute.js'
import DictionaryRoute from './routes/DictionaryRoute.js'
import UserRoute from './routes/UserRoute.js';
//Service
import { SocketInit } from "./service/SocketService.js";
import { GoogleAPIinit } from "./service/GoogleAPI.js";


const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/account', AccountRoute);
app.use('/api/type', TypeRoute);
app.use('/api/category', CategoryRoute);
app.use('/api/dictionary', DictionaryRoute);
app.use('/api/user', UserRoute);

const server = createServer(app);

//SocketInit(server);
GoogleAPIinit();


server.listen(process.env.PORT || '3000', () => {
    console.log('Server is runnig on port 3000');
});