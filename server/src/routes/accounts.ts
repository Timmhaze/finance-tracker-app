//server/src/routes/accounts.ts

import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import AccountModel from '../models/account';
import { fetchExchangeRates } from '../services/cnbService';
import { TransactionRecordModel } from '../models/record';

const router = express.Router();

// Get all records
router.get('/', async (req: Request, res: Response) => {
    try {
        const records = await AccountModel.find();

        if(records.length === 0) {
            res.status(404).json({ message: 'No accounts found' }); 
        } else {
            res.status(200).json(records); // Success
        }
    } 

    catch(err) {
        res.status(500).json({ message: 'Error fetching accounts', error: err });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { title, currency, accountBalance } = req.body;

    try {
        // Validate required fields
        if (!title || !currency || accountBalance === undefined) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ message: 'Missing required fields' });
        }

        const newAccount = new AccountModel({
            title,
            currency,
            accountBalance,
        });

        await newAccount.save({ session });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json(newAccount);
    } 
    
    catch (err) {
        await session.abortTransaction();
        session.endSession();

        console.error('Account creation error:', err);
        res.status(500).json({ 
            message: 'Error creating account', 
            error: err instanceof Error ? err.message : 'Unknown error' 
        });
    }
});

router.patch('/:accountId', async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const updates = req.body;

    try {
        const account = await AccountModel.findById(accountId);
        if (!account) {
            res.status(404).json({ message: 'Account not found' });
            return;
        }

        // Check if the title has been changed
        if (updates.title !== undefined) {
            account.title = updates.title;
        }

        if (updates.account !== undefined || updates.currency !== undefined) {
            res.status(400).json({ message: 'Someone tried to change the account or currency! Exterminate!' });
            return;
        }

        await account.save();
        res.status(200).json(account);
    }

    catch(err) {
        console.error('Update error:', err);
        res.status(500).json({ message: 'Error updating account', error: err });
    }
    
});

router.delete('/:accountId', async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extract the ID from the request
        const { accountId } = req.params;

        // Find the account using the request ID and check if it exists
        const account = await AccountModel.findById(accountId).session(session);
        if(!account) {
            await session.abortTransaction();
            res.status(404).json({ error: 'Account not found' });
            return;
        }

        const deleteResult = await TransactionRecordModel.deleteMany({
            account: accountId
        }).session(session);

        // Delete the account
        await AccountModel.deleteOne({ _id: accountId }).session(session);

        await session.commitTransaction();
        res.status(204).json({ message: 'Account deleted successfully', recordsDeleted: deleteResult.deletedCount});
    }

    catch(err) {
        await session.abortTransaction();
        console.error('Delete failed:', err);
        res.status(500).json({ error: 'Failed to delete account' });
    }

    finally {
        session.endSession();
    }
});

export default router;