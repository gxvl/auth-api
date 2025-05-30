import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './router';

dotenv.config();

const app = express();
app.use(cors({
  credentials: true,
}))

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
})

const MONGO_URI = process.env.MONGO_URI;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI)
mongoose.connection.on('error', (err: Error) => {
  console.error('MongoDB connection error:', err);
});

app.use('/', router())
