//server/src/models/account.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface Account extends Document {
    title: string;
    currency: 'EUR' | 'CZK';
    accountBalance: number;
    dateCreated?: string;
}

const accountSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true },
    currency: { type: String, required: true, enum: ['EUR', 'CZK']},
    accountBalance: { type: Number, required: true }, 
    dateCreated: { type: String, required: false },
});

accountSchema.pre<Account>('save', async function(next) 
{
  if(this.isNew) {
    const now = new Date();
    this.dateCreated = now.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
  }
  next();
});

const AccountModel = mongoose.model<Account>('Account', accountSchema);



export default AccountModel;