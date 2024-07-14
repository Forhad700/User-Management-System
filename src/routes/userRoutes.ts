import express, { Request, Response } from 'express';
import Joi from 'joi';
import UserModel, { IUser } from '../models/User';

const router = express.Router();

const userSchema = Joi.object({
  uid: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('showaUser', 'showaAdmin', 'showaSubAdmin', 'serviceProviderAdmin', 'serviceProviderSubAdmin', 'serviceProviderEngineer', 'serviceProviderBranchManager', 'serviceProviderSupportStuff').required(),
  status: Joi.string().valid('in-progress', 'approved', 'suspended').required(),
  name: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
  }),
  phone: Joi.string().required(),
  occupation: Joi.string(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().valid('male', 'female', 'prefer-not-answer').required(),
  photoUrl: Joi.string(),
  addresses: Joi.array().items(Joi.object({
    isDeleted: Joi.boolean().required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      prefecture: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      buildingName: Joi.string().required(),
      roomNumber: Joi.string().required(),
      state: Joi.string(),
      details: Joi.string()
    }).required()
  }))
});

router.post('/users', async (req: Request, res: Response) => {
  try {
    
    const { error, value } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: error.details.map((err: any) => err.message) });
    }

    const newUser: IUser = await UserModel.create(value);
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/users', async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.query;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone parameter is required' });
    }

    let query: any = {};

    if (email) {
      query.email = email;
    }

    if (phone) {
      query.phone = phone;
    }

    const users: IUser[] = await UserModel.find(query);
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
