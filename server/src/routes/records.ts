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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Extract the required fields from the request body
    const { amount, currency, linkedAccount } = req.body;
   
    // Fetch the account from the database
    const account = await AccountModel.findById(linkedAccount).session(session);

    if (!account) {
      res.status(400).json({ error: `Cannot find account with ID: ${linkedAccount}` });
      await session.abortTransaction();
      return;
    } 
    
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
      linkedAccount: linkedAccount
    });

    // Save the record to the database
    const savedRecord = await newRecord.save({ session }); 

    // Update the fields for the linked account with the new values
    await AccountModel.findByIdAndUpdate(linkedAccount, { 
      $inc: { accountBalance: processedAmount} }, 
      { new: true, session } 
    );

    // Return the saved record
    await session.commitTransaction();
    res.status(201).json(savedRecord); 
  }

  catch(err) {
      await session.abortTransaction();
      res.status(400).json({ message: 'Error creating record', error: err }); // If there is an error creating the record, return a 400 status code
  }

  finally {
      session.endSession(); // End the session
  }
});


/* NOTE: This is the PATCH attempt. It works, though doesn't do well with just the currency type being changed. 
router.patch('/:recordId', async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { recordId } = req.params;

    const exchangeRate = await fetchExchangeRates(); // Fetch exchange rates once for efficiency

    // Fetch the existing record and linked account
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

    
    const updates = req.body;
    const {
      description,
      category,
      type,
      amount,
      currency,
      paymentType,
      linkedAccount: newLinkedAccountId, // This part of the destructured object means "take the linkedAccount property from the object but assign it to a new variable called newLinkedAccountId"
    } = updates;

    let amountForRemoval = existingRecord.amount; // Amount to be removed from the original account

    if(existingRecord.type === 'Expense') {
      amountForRemoval = -existingRecord.amount; // Flip the sign for expense
    }

    if (existingRecord.currency !== linkedAccount.currency) {
      if (existingRecord.currency === 'EUR' && linkedAccount.currency === 'CZK') {
        amountForRemoval = existingRecord.amount * exchangeRate; // EUR -> CZK
      } 
      
      else if (existingRecord.currency === 'CZK' && linkedAccount.currency === 'EUR') {
        amountForRemoval = existingRecord.amount / exchangeRate; // CZK -> EUR
      }
    }

    // else no conversion needed

    // Always undo original
    await AccountModel.findByIdAndUpdate(existingRecord.linkedAccount, {
      $inc: { accountBalance: -amountForRemoval }
    }).session(session);



    // At this point none of the new data has or needs to be applied yet. All of the above just undoes the effects of the orginal record

    let balanceAdjustment = updates.amount;
    console.log("The value of the amount we are sending in the request is: ", updates.amount);

    
    // If there is a new linked account
    if (existingRecord.linkedAccount.toString() !== newLinkedAccountId.toString()) {
      // Case where the linked account has changed
      const newLinkedAccount = await AccountModel.findById(newLinkedAccountId).session(session);
      if (!newLinkedAccount) {
        await session.abortTransaction();
        res.status(404).json({ message: 'New linked account not found' });
        return;
      }

      if(updates.currency === newLinkedAccount.currency) {
        balanceAdjustment = updates.amount; // No conversion needed
      }

      else {
        if (updates.currency === 'EUR' && newLinkedAccount.currency === 'CZK') {
          balanceAdjustment = updates.amount * exchangeRate; // EUR -> CZK
        } 
        
        else if (updates.currency === 'CZK' && newLinkedAccount.currency === 'EUR') {
          balanceAdjustment = updates.amount / exchangeRate; // CZK -> EUR
        }
      }

      if(updates.type !== existingRecord.type) {
        if(updates.type === 'Expense') {
          Math.abs(balanceAdjustment); // Prevent minus * minus = plus situation
          balanceAdjustment *= -1; // Flip the sign for expense
        }

        else if(updates.type === 'Income') {
          Math.abs(balanceAdjustment); // Flip the sign for income
        }
      }

      // Apply the balance adjustment to the new linked account
      await AccountModel.findByIdAndUpdate(newLinkedAccount._id, {
        $inc: { accountBalance: balanceAdjustment }
      }).session(session);

    } 
    
    // If it's the same account as previously
    else {
      if(existingRecord.currency === updates.currency){
        balanceAdjustment = updates.amount; // No conversion needed
      }

      else {
        if (existingRecord.currency === 'EUR' && updates.currency === 'CZK') {
          balanceAdjustment = updates.amount * exchangeRate; // EUR -> CZK
        }
        else if (existingRecord.currency === 'CZK' && updates.currency === 'EUR') {
          balanceAdjustment = updates.amount / exchangeRate; // CZK -> EUR
        }
      }

      if(updates.type !== existingRecord.type) {
        if(updates.type === 'Expense') {
          Math.abs(balanceAdjustment); // Prevent minus * minus = plus situation
          balanceAdjustment *= -1; // Flip the sign for expense
        }

        else if(updates.type === 'Income') {
          Math.abs(balanceAdjustment); // Flip the sign for income
        }
      }

      // Apply the balance adjustment to the same account (linked account)
      await AccountModel.findByIdAndUpdate(newLinkedAccountId, {
        $inc: { accountBalance: balanceAdjustment }
      }).session(session);
    }

    // Step 3: Update the transaction record with the new data
    await TransactionRecordModel.findByIdAndUpdate(
      recordId,
      updates,
      { new: true, session }
    );

    // Commit the transaction
    await session.commitTransaction();
    res.status(200).json({ message: 'Record updated successfully' });
  }


  catch (err) {
    // Abort the transaction in case of any error
    await session.abortTransaction();
    console.error('Update failed:', err);
    res.status(500).json({ error: 'Failed to update record' });
  } 
  
  finally {
    // End the session
    session.endSession();
  }
});

*/

router.put('/:recordId', async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { recordId } = req.params;
    const {
      description,
      category,
      type,
      amount,
      currency,
      paymentType,
      linkedAccount: newLinkedAccountId,
    } = req.body;

    const exchangeRate = await fetchExchangeRates();

    // Fetch existing record
    const existingRecord = await TransactionRecordModel.findById(recordId).session(session);
    if (!existingRecord) {
      await session.abortTransaction();
      res.status(404).json({ message: 'Record not found' });
      return 
    }

    const originalLinkedAccount = await AccountModel.findById(existingRecord.linkedAccount).session(session);
    if (!originalLinkedAccount) {
      await session.abortTransaction();
      res.status(404).json({ message: 'Original linked account not found' });
      return 
    }

    // Function to convert amount based on currency and exchange rate
    function convertAmount(amount: number, from: 'EUR' | 'CZK', to: 'EUR' | 'CZK', rate: number): number {
      if (from === to) return amount;
      return from === 'EUR' ? amount * rate : amount / rate;
    }

    // Calculate reversal of original record
    let reversalAmount = existingRecord.amount;
    if (existingRecord.currency !== originalLinkedAccount.currency) {
      reversalAmount = convertAmount(existingRecord.amount, existingRecord.currency, originalLinkedAccount.currency, exchangeRate);
    }

    if (existingRecord.type === 'Expense') reversalAmount *= -1;

    await AccountModel.findByIdAndUpdate(existingRecord.linkedAccount, {
      $inc: { accountBalance: -reversalAmount }
    }).session(session);

    // Get new linked account
    const newLinkedAccount = await AccountModel.findById(newLinkedAccountId).session(session);
    if (!newLinkedAccount) {
      await session.abortTransaction();
      res.status(404).json({ message: 'New linked account not found' });
      return 
    }

    // Calculate adjustment for new values
    let adjustedAmount = amount;
    if (currency !== newLinkedAccount.currency) {
      adjustedAmount = convertAmount(amount, currency, newLinkedAccount.currency, exchangeRate);
    }

    // If it is an expense, then remove from the account
    if (type === 'Expense'){
      await AccountModel.findByIdAndUpdate(newLinkedAccount._id, {
        $inc: { accountBalance: -adjustedAmount }
      }).session(session);
    }

    // Else add it to the account
    else {
      await AccountModel.findByIdAndUpdate(newLinkedAccount._id, {
        $inc: { accountBalance: adjustedAmount }
      }).session(session);
    }

    // Update the record (also update originalValue if needed)
    const updatedRecord = await TransactionRecordModel.findByIdAndUpdate(
      recordId,
      {
        description,
        category,
        type,
        amount: Math.abs(amount), // Ensure amount is positive
        currency,
        paymentType,
        linkedAccount: newLinkedAccountId,
        originalValue: amount // update this if it's what the frontend displays
      },
      { new: true, session }
    );

    await session.commitTransaction();
    res.status(200).json(updatedRecord);
  } 
  
  catch (err) {
    await session.abortTransaction();
    console.error('PUT update failed:', err);
    res.status(500).json({ error: 'Failed to update record' });
  } 
  
  finally {
    session.endSession();
  }
});

// MAY NEED TO BE UPDATED TO USE NEW LOGIC
router.delete('/:recordId', async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { recordId } = req.params;

    const record = await TransactionRecordModel.findById(recordId).session(session);
    if (!record) {
      await session.abortTransaction();
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    const account = await AccountModel.findById(record.linkedAccount).session(session);
    if (!account) {
      await session.abortTransaction();
      res.status(404).json({ error: 'Linked account not found' });
      return;
    }

    let processedAmount = record.amount;
    if (record.currency !== account.currency) {
      const exchangeRate = await fetchExchangeRates();
      processedAmount = record.currency === 'EUR'
        ? record.amount * exchangeRate
        : record.amount / exchangeRate;
    }

    const balanceAdjustment = record.type === 'Expense' ? -processedAmount : processedAmount;

    await AccountModel.findByIdAndUpdate(
      account._id,
      { $inc: { accountBalance: balanceAdjustment } },
      { session }
    );

    await TransactionRecordModel.deleteOne({ _id: recordId }).session(session);

    await session.commitTransaction();
    res.sendStatus(204);
  } 
  
  catch (err) {
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

