import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; 

import recordsRoutes from './routes/records'; // Import the records routes

const app: Express = express(); // Instance of an Express app
const PORT = process.env.PORT || 3001; // Port at which the server will run, it can be hard coded or set from an env variable port if available

// Middleware
app.use(express.json()); // To parse the incoming requests with JSON payloads
app.use(cors()); // To enable Cross-Origin Resource Sharing

// Database Connection
const MONGO_URI: string = 'mongodb+srv://THayes95:zbvpW4nIZ4qzkZr8@finance-tracker-cluster.ftolny7.mongodb.net/'; //MongoDB URI
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use('/api/records', recordsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server on the specified port



