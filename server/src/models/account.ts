import mongoose, { Schema, Document } from 'mongoose';

export interface Account extends Document {
    title: string;
    currency: 'Euro | Koruna';
    balance: number;
    date: string;
}

const accountSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true },
    balance: { type: Number, required: true }, 
    currency: { type: String, enum: ['Euro', 'Koruna'], required: true, },
    date: { type: String, required: true },
});

const AccountModel = mongoose.model<Account>(
    'Account', accountSchema
);

export default AccountModel;