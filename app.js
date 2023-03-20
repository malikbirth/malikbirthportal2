import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRoute from './routes/indexRoute.js';
import apiRoute from './routes/apiRoute.js';

// app setup .....
const app = express();
dotenv.config();
app.set('views', path.join(process.env.PWD, '/views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.env.PWD ,'/public')));


// routes ......
app.use('/api', apiRoute);
app.use('*', indexRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({
    code : err.status,
    message : err.message
  })
});

export default app;
