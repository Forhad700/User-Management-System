"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Joi schema for user validation
const userSchema = joi_1.default.object({
    uid: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    role: joi_1.default.string().valid('showaUser', 'showaAdmin', 'showaSubAdmin', 'serviceProviderAdmin', 'serviceProviderSubAdmin', 'serviceProviderEngineer', 'serviceProviderBranchManager', 'serviceProviderSupportStuff').required(),
    status: joi_1.default.string().valid('in-progress', 'approved', 'suspended').required(),
    name: joi_1.default.object({
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required()
    }),
    phone: joi_1.default.string().required(),
    occupation: joi_1.default.string(),
    dateOfBirth: joi_1.default.date().required(),
    gender: joi_1.default.string().valid('male', 'female', 'prefer-not-answer').required(),
    photoUrl: joi_1.default.string(),
    addresses: joi_1.default.array().items(joi_1.default.object({
        isDeleted: joi_1.default.boolean().required(),
        address: joi_1.default.object({
            street: joi_1.default.string().required(),
            city: joi_1.default.string().required(),
            prefecture: joi_1.default.string().required(),
            postalCode: joi_1.default.string().required(),
            country: joi_1.default.string().required(),
            buildingName: joi_1.default.string().required(),
            roomNumber: joi_1.default.string().required(),
            state: joi_1.default.string(),
            details: joi_1.default.string()
        }).required()
    }))
});
// POST endpoint to create a user
router.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const { error, value } = userSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ error: error.details.map((err) => err.message) });
        }
        // Create new user
        const newUser = yield User_1.default.create(value);
        res.status(201).json(newUser);
    }
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Server error' });
    }
}));
// GET endpoint to find users by email or phone
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone } = req.query;
        if (!email && !phone) {
            return res.status(400).json({ error: 'Email or phone parameter is required' });
        }
        let query = {};
        if (email) {
            query.email = email;
        }
        if (phone) {
            query.phone = phone;
        }
        const users = yield User_1.default.find(query);
        res.json(users);
    }
    catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = router;
