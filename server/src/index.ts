//server/src/index.ts

import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; 

dotenv.config();

import recordsRoutes from './routes/records'; // Import the records routes
import accountsRoutes from './routes/accounts'; // Import the accounts routes

import exhangeRatesRoutes from './routes/currencyRoutes';

const app: Express = express(); // Instance of an Express app
const PORT = process.env.PORT || 3001; // Port at which the server will run, it can be hard coded or set from an env variable port if available

// Middleware
app.use(express.json()); // To parse the incoming requests with JSON payloads
app.use(cors()); // To enable Cross-Origin Resource Sharing

// Database Connection
const MONGO_URI = process.env.MONGO_URI!; //MongoDB URI NOTE: stored in env file on my machine, but not in the repo for security reasons

if (!MONGO_URI) {
  console.error('Missing MONGO_URI environment variable!');
  process.exit(1); // Stop the server immediately
}

mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use('/api/records', recordsRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/exchange-rates', exhangeRatesRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server on the specified port



