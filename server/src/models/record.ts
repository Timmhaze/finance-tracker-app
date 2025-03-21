import mongoose, { Schema, Document } from 'mongoose';

export interface Record extends Document {
    description: string;
    type: 'Income' | 'Expense';
    amount: number;
    currency: string;
    paymentType: string;
    date: string;
    account: string; //Later will be a hard reference to the Account model
}

const recordSchema: Schema = new Schema({
    description: { type: String, required: true },
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentType: { type: String, required: true },
    date: { type: String, required: true },
    account: { type: String, required: true },
});

const RecordModel = mongoose.model<Record>(
    'Record', recordSchema
);

export default RecordModel;