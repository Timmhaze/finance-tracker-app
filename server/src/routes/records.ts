import express, {Request, Response} from 'express';
import TransactionRecordModel from '../models/record';
import AccountModel from '../models/account'; // Import the Account model
import { fetchExchangeRates } from '../services/cnbService'; // Import the exchange rate fetching function

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

// Add a new record
router.post('/', async (req: Request, res: Response) => {
    try {

    // Extract data about the incoming request and format the date
      const { accountId, amount, currency: recordCurrency } = req.body;
      const formattedDate = new Date(req.body.date).toISOString().split('T')[0];
  
      // Fetch the account from the database
      const account = await AccountModel.findById(accountId);
  
      // If the account doesn't exist or can't be found, handle the error
      if (!account) {
        res.status(404).json({ message: 'Account not found' });
      } 
      
      else {
        // If it exists, check the currency value of the account (account.currency) against the incoming record currencty (recordCurrency) and convert the value using the exchange rate from the CNB API if necessary
        let finalAmount = parseFloat(amount);
        if (recordCurrency !== account.currency) {
          const exchangeRate = await fetchExchangeRates();
          finalAmount = 
            recordCurrency === 'Euro' 
              ? finalAmount * exchangeRate  // EUR → CZK
              : finalAmount / exchangeRate; // CZK → EUR
          finalAmount = parseFloat(finalAmount.toFixed(2));
        }
  
        // 3. Create and save the record with the converted amount, the formatted date and the linked account ID, along with the rest of the data the user entered
        const record = new TransactionRecordModel({
          ...req.body,
          amount: finalAmount,
          date: formattedDate,
          account: accountId,
        });

        // Update the linked account's balance by adding or substracting the amount from the record
        const savedRecord = await record.save();
        await AccountModel.findByIdAndUpdate(
          accountId,
          { $inc: { balance: savedRecord.amount } },
          { new: true }
        );
  
        res.status(201).json(savedRecord); // Success
      }
    } catch (err) {
      res.status(500).json({ message: 'Error creating record', error: err }); // If there is an error creating the record, return a 400 status code
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