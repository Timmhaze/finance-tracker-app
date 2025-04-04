import express, {Request, Response, Router} from 'express';
import TransactionRecordModel from '../models/record';
import mongoose from 'mongoose';
import AccountModel from '../models/account'; // Import the Account model

const router = express.Router();

// Get all records
router.get('/', async (req: Request, res: Response) => {
    try 
    {
        const records = await TransactionRecordModel.find()
            .populate({
                path: 'account',
                select: 'title'
            });

        if(records.length === 0) // If there are no records to show, return a 404 status code
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

router.post('/', async (req: Request, res: Response) => {
    try {

      const formattedDate = new Date(req.body.date).toISOString().split('T')[0]; // Format the date to ISO string

      // 1. Create the record
      const record = new TransactionRecordModel({
        ...req.body,
        amount: parseFloat(req.body.amount),
        date: formattedDate,
        account: req.body.accountId
      });
      
      const savedRecord = await record.save();
  
      // 2. Update account balance
      await AccountModel.findByIdAndUpdate(
        savedRecord.account,
        { $inc: { balance: savedRecord.amount } },
        { new: true } // Return the updated document
      );
  
      // 3. Return success
      res.status(201).json(savedRecord);
  
    } catch (err) {
      res.status(500).json({ message: 'Error creating record' });
    }
  });

// Add a new record
// router.post('/', async (req: Request, res: Response) => {
//     try 
//     {
//         const newRecord = new TransactionRecordModel(req.body); // Create a new record instance using the data from the request
//         const savedRecord = await newRecord.save(); // Save the record to the database
        
//         const updatedAccount = await AccountModel.findByIdAndUpdate(
//             savedRecord.account,
//             { $inc: {balance: savedRecord.amount} },
//             { new: true }
//         );

//         if (!updatedAccount) {
//             // Rollback the transaction if account not found
//             await TransactionRecordModel.findByIdAndDelete(savedRecord._id);
//                 res.status(404).json({ 
//                 message: 'Linked account not found - transaction rolled back'
//             });
//           }

//         else
//         {
//             res.status(201).json({
//                 transaction: savedRecord.toObject(),
//                 newBalance: updatedAccount.balance 
//             });
//         }  
//     } 
    
//     catch(err) 
//     {
//         res.status(500).json({ message: 'Error adding record', error: err });
//     }
// });



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