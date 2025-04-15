//server/src/routes/records.ts

import express, {Request, Response, Router} from 'express';
import mongoose from 'mongoose';
import { fetchExchangeRates } from '../services/cnbService';
import { TransactionRecordModel } from '../models/record';
import AccountModel from '../models/account';


const router: Router = express.Router();

// Get all records
router.get('/', async (req: Request, res: Response) => {
    try {
        const records = await TransactionRecordModel.find()
            .populate({
                path: 'linkedAccount',
                select: 'title'
            });

        if(records.length === 0) {
            res.status(404).json({ message: 'No records found' }); 
        }

        else {
            res.status(200).json(records);
        }
    } 

    catch(err) {
        res.status(500).json({ message: 'Error fetching records', error: err });
    }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    // Extract the required fields from the request body
    const { amount, currency, accountId } = req.body;
   
    // Fetch the account from the database
    const account = await AccountModel.findById(accountId);

    if (!account) {
      res.status(400).json({ error: 'Cannot find account with ID: ', accountId });
      return;
    } 
    
    else {
      // Initialize values to be used when incrementing or decrementing the account values
      let processedAmount: number = 0;

      // Record currency does not match account currency then convert
      if(currency !== account.currency) {
        const exchangeRate = await fetchExchangeRates();
        if (currency === 'EUR') {
          processedAmount = amount * exchangeRate; // EUR -> CZK
        } 

        else if (currency === 'CZK') {
          processedAmount = amount / exchangeRate; // CZK -> EUR
        }
      }

      else {
        processedAmount = amount; // No conversion needed
      }

      // Create the new record
      const newRecord = new TransactionRecordModel({
        ...req.body,
        linkedAccount: accountId
      });

      // Save the record to the database
      const savedRecord = await newRecord.save(); 

      // Update the fields for the linked account with the new values
      await AccountModel.findByIdAndUpdate(
        accountId, 
        { $inc: { accountBalance: processedAmount} }, 
        { new: true } 
      );

      // Return the saved recorde
      res.status(201).json(savedRecord); 
    } 
  }

  catch(err) {
      res.status(500).json({ message: 'Error creating record', error: err }); // If there is an error creating the record, return a 400 status code
  } 
});

router.patch('/:recordId', async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { recordId } = req.params;
    const updates = req.body;

    const existingRecord = await TransactionRecordModel.findById(recordId).session(session);
    if (!existingRecord) {
      await session.abortTransaction();
      res.status(404).json({ message: 'Record not found' });
      return;
    }

    const linkedAccount = await AccountModel.findById(existingRecord.linkedAccount).session(session);
    if (!linkedAccount) {
      await session.abortTransaction();
      res.status(404).json({ message: 'Linked account not found' });
      return;
    }

    await AccountModel.findByIdAndUpdate(
      linkedAccount._id,
      { $inc: { accountBalance: -existingRecord.amount} },
      { new: true, session }
    )

    await session.commitTransaction();
    res.status(200).json({ message: 'Record updated successfully' });
  } 
  
  catch(err) {
    await session.abortTransaction();
    console.error('Update failed:', err);
    res.status(500).json({ error: 'Failed to update record' });
  } 
  
  finally {
    session.endSession();
  }
});

router.delete('/:recordId', async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { recordId } = req.params;

    // Find and validate the record we are trying to delete
    const record = await TransactionRecordModel.findById(recordId).session(session);
    if(!record) {
      await session.abortTransaction();
      res.status(404).json({error: 'Record not found'});
      return;
    }

    // Fetch the account linked to the record so that we can update its balance info when the account is deleted
    const account = await AccountModel.findById(record.linkedAccount).session(session);
    if(!account) {
      await session.abortTransaction();
      throw new Error('Could not find linked account');
    }

    let balanceAdjustment = -record.amount; // Flip the value that the record has. If it added money, it will remove that money and vice versa
    let secondaryBalanceAdjustment = 0;

    if (record.currency !== account.currency) {
      const exchangeRate = await fetchExchangeRates(); // NOTE: maybe add a field to the records showing their exchange rate when created, then use that as the exchange rate to keep the values consistent
      secondaryBalanceAdjustment = record.currency === 'EUR'
        ? -record.amount * exchangeRate 
        : -record.amount / exchangeRate;
    } 

    else {
      secondaryBalanceAdjustment = balanceAdjustment;
    }

    // Update the account balance to match the values it would have without the related record
    await AccountModel.findByIdAndUpdate(
      account._id,
      {
        $inc: {
          primaryBalance: balanceAdjustment,
          secondaryBalance: secondaryBalanceAdjustment
        }
      },
      { session }
    );

    // Delete the record
    await TransactionRecordModel.deleteOne({ _id: recordId }).session(session);

    await session.commitTransaction();
    res.status(204).json({ message: 'Record deleted and balances updated' });

  }

  catch(err)
  {
    await session.abortTransaction();
    console.error('Delete failed:', err);
    res.status(500).json({ error: 'Failed to delete record' });
  }

  finally {
    session.endSession();
  }
});

export default router;

/*
test object for a record: 

{
  "description": "Test",
  "category": "Salary",
  "type": "Income",
  "amount": 1000,
  "currency": "EUR",
  "paymentType": "Bank Transfer",
  "date": "2025-04-14",
  "accountId": "67fe3e1200f317997247a872"
}

*/

