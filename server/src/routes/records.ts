import express, {Request, Response} from 'express';
import TransactionRecordModel from '../models/record';

const router = express.Router();

// Get all records
router.get('/', async (req: Request, res: Response) => {
    try 
    {
        const records = await TransactionRecordModel.find();

        if(records.length === 0) // If there are no records to show, retrn a 404 status code
        {
            res.status(404).json({ message: 'No records found' }); 
        }

        else 
        {
            res.status(200).json(records); // Success
        }
    } 

    catch(err) 
    {
        res.status(500).json({ message: 'Error fetching records', error: err });
    }
});

// Add a new record
router.post('/', async (req: Request, res: Response) => {
    try 
    {
        const newRecordBody = req.body; // Get the record from the frontend request body

        const newRecord = new TransactionRecordModel(newRecordBody); // Create a new record instance using the data from the request

        const savedRecord = await newRecord.save(); // Save the record to the database
        res.status(201).json(savedRecord);
    } 
    
    catch(err) 
    {
        res.status(500).json({ message: 'Error adding record', error: err });
    }
});

// Edit a record
router.patch('/:_id', async (req: Request, res: Response) => {
    try 
    {
        const recordId = req.params._id; // Get the record ID from the request parameters

        const newRecordBody = req.body; // Get the updated record from the frontend request body

        const updatedRecord = await TransactionRecordModel.findByIdAndUpdate(recordId, newRecordBody, { new: true }); // Find the record by ID and update it with the new data

        if (!updatedRecord) 
        {
            res.status(404).json({ message: 'Record not found' }); // If the record is not found, return a 404 status code
        }

        res.status(200).json(updatedRecord); // Success
    }

    catch(err) // If there is an error updating the record, return a 400 status code
    {
        res.status(500).json({ message: 'Error updating record', error: err });
    }  
});


// Delete a record
router.delete('/:_id', async (req: Request, res: Response) => {
    try
    {
        const recordId = req.params._id; // Get the record ID from the request parameters

        const recordForDeletion = await TransactionRecordModel.findByIdAndDelete(recordId); // Find the record by ID and delete it

        if (!recordForDeletion) 
        {
            res.status(404).json({ message: 'Cannot delete - record not found' }); // If the record is not found, return a 404 status code
        }

        res.status(200).json({ message: 'Record deleted' }); // Success
    }

    catch(err)
    {
        res.status(500).json({ message: 'Error deleting record', error: err }); // If there is an error deleting the record, return a 400 status code
    }
});

export default router;