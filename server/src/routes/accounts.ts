import express, {Request, Response} from 'express';
import AccountModel from '../models/account';

const router = express.Router();

// Get all records
router.get('/', async (req: Request, res: Response) => {
    try 
    {
        const records = await AccountModel.find();

        if(records.length === 0) // If there are no records to show, return a 404 status code
        {
            res.status(404).json({ message: 'No accounts found' }); 
        }

        else 
        {
            res.status(200).json(records); // Success
        }
    } 

    catch(err) 
    {
        res.status(500).json({ message: 'Error fetching accounts', error: err });
    }
});


router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, currency, balance } = req.body;

        // Validate required fields
        if (!title || !currency) {
           res.status(400).json({ message: 'Title and currency are required' });
        }

        // Create the account with proper balance handling
        const newAccount = new AccountModel({
            title,
            currency,
            balance: balance || '0',  // Use provided balance or default to '0'
            date: new Date().toISOString()
        });

        const savedAccount = await newAccount.save();
        res.status(201).json(savedAccount);

    } catch(err) {
        res.status(500).json({ 
            message: 'Error adding account', 
            error: err instanceof Error ? err.message : 'Unknown error' 
        });
    }
});

// Edit a record
router.patch('/:_id', async (req: Request, res: Response) => {
    try 
    {
        const recordId = req.params._id; // Get the record ID from the request parameters

        const newRecordBody = req.body; // Get the updated record from the frontend request body

        const updatedRecord = await AccountModel.findByIdAndUpdate(recordId, newRecordBody, { new: true }); // Find the record by ID and update it with the new data

        if (!updatedRecord) 
        {
            res.status(404).json({ message: 'Account not found' }); // If the record is not found, return a 404 status code
        }

        res.status(200).json(updatedRecord); // Success
    }

    catch(err) // If there is an error updating the record, return a 400 status code
    {
        res.status(500).json({ message: 'Error updating account', error: err });
    }  
});


// Delete a record
router.delete('/:_id', async (req: Request, res: Response) => {
    try
    {
        const recordId = req.params._id; // Get the record ID from the request parameters

        const recordForDeletion = await AccountModel.findByIdAndDelete(recordId); // Find the record by ID and delete it

        if (!recordForDeletion) 
        {
            res.status(404).json({ message: 'Cannot delete - account not found' }); // If the record is not found, return a 404 status code
        }

        res.status(200).json({ message: 'Account deleted' }); // Success
    }

    catch(err)
    {
        res.status(500).json({ message: 'Error deleting account', error: err }); // If there is an error deleting the record, return a 400 status code
    }
});

export default router;