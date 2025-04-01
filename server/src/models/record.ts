import mongoose, { Schema, Document, Types } from 'mongoose';

export interface TransactionRecord extends Document {
    description: string;
    category: string,
    type: 'Income' | 'Expense';
    amount: number;
    currency: string;
    paymentType: string;
    date: string;
    account: Types.ObjectId;
}

const transactionRecordSchema: Schema = new Schema({
    description: { type: String, required: true },
    category: { type: String, required: true},
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentType: { type: String, required: true },
    date: { type: String, required: true },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account', // Reference to the Account model
        required: true 
    },
});

transactionRecordSchema.pre<TransactionRecord>('save', function (next) {
    if (this.type === 'Expense') 
    {
        this.amount = -Math.abs(this.amount); // Ensure amount is negative for expenses
    }

    else if (this.type === 'Income')
    {
        this.amount = Math.abs(this.amount); // Ensure amount is positive for income
    }
    next();
});



const TransactionRecordModel = mongoose.model<TransactionRecord>(
    'Record', transactionRecordSchema
);

export default TransactionRecordModel;