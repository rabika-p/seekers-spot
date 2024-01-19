import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
dotenv.config(); 

import {env} from './config'
import routes from './User';
import lostItemRoutes from './LostItems';
import foundItemRoutes from './FoundItems';
import matchRoutes from './Matches';

import cors from 'cors';
import { ErrorHandler } from './User/Middleware';

const app: Express = express();

import { databaseConnection } from '../src/config/database-connection';
import path from 'path';

app.use(bodyParser.json());
app.use(cors());

databaseConnection()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err: any) => {
    console.error('Error connecting to MongoDB:', err);
  });


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use('/images', express.static(path.join(__dirname, "uploads")));
app.use('/api/users', routes());
app.use('/api', lostItemRoutes());
app.use('/api', foundItemRoutes());
app.use('/api', matchRoutes());

app.all('*', function (req, res, next) {
    const err = {
      message: "Cannot find path on the server",
      status: 404,
    };

    next(err);
});

// Error Hanlder Middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  ErrorHandler(error, req, res, next);
});

app.listen(env.PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${env.PORT}`);
});
 