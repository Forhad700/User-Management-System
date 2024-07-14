import mongoose, { Schema, Document } from 'mongoose';

export type TRole =
  | 'showaUser'
  | 'showaAdmin'
  | 'showaSubAdmin'
  | 'serviceProviderAdmin'
  | 'serviceProviderSubAdmin'
  | 'serviceProviderEngineer'
  | 'serviceProviderBranchManager'
  | 'serviceProviderSupportStuff';

export interface IUser extends Document {
  uid: string;
  email: string;
  role: TRole;
  status: 'in-progress' | 'approved' | 'suspended';
  name: { firstName: string; lastName: string };
  phone: string;
  occupation?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'prefer-not-answer';
  photoUrl?: string;
  addresses?: {
    isDeleted: boolean;
    address: {
      street: string;
      city: string;
      prefecture: string;
      postalCode: string;
      country: string;
      buildingName: string;
      roomNumber: string;
      state?: string;
      details?: string;
    };
  }[];
}

const UserSchema: Schema = new Schema({
  uid: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['showaUser', 'showaAdmin', 'showaSubAdmin', 'serviceProviderAdmin', 'serviceProviderSubAdmin', 'serviceProviderEngineer', 'serviceProviderBranchManager', 'serviceProviderSupportStuff'], required: true },
  status: { type: String, enum: ['in-progress', 'approved', 'suspended'], required: true },
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  phone: { type: String, required: true },
  occupation: { type: String },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'prefer-not-answer'], required: true },
  photoUrl: { type: String },
  addresses: [{
    isDeleted: { type: Boolean, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      prefecture: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      buildingName: { type: String, required: true },
      roomNumber: { type: String, required: true },
      state: { type: String },
      details: { type: String }
    }
  }]
});

export default mongoose.model<IUser>('User', UserSchema);
