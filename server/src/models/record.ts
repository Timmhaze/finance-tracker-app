import mongoose, { Schema, Document } from 'mongoose';

export interface TransactionRecord extends Document {
    description: string;
    type: 'Income' | 'Expense';
    amount: number;
    currency: string;
    paymentType: string;
    date: string;
    account: string; //Later will be a hard reference to the Account model
}

const transactionRecordSchema: Schema = new Schema({
    description: { type: String, required: true },
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentType: { type: String, required: true },
    date: { type: String, required: true },
    account: { type: String, required: true },
});

const TransactionRecordModel = mongoose.model<TransactionRecord>(
    'Record', transactionRecordSchema
);

export default TransactionRecordModel;