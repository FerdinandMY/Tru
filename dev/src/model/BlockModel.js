const mongoose = require('mongoose');
const validator = require('validator'); 
const Schema = mongoose.Schema;

const blockSchema = new mongoose.Schema({
    _id: new Schema.Types.ObjectId,
    index: {
        type: String,
        trim: true,
        required: [true, 'index is required'],
        minlength: 4,
        maxlength: 200
    },
    timestamp: {
        type: Date,
        trim: true,
        default: Date.now,
        required: [true, 'timestamp is required'],
        minlength: 4,
        maxlength: 200
    },
    numberOfTransaction: {
        type: Number,
        required: [true, 'number of transaction is required'],
        minlength: 4,
        maxlength: 200
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: [true, 'transaction is required'],
        ref: 'Transaction'
    },
    nonce: {
        type: String,
        trim: true,
        required: [true, 'nonce is required'],
        minlength: 4,
        maxlength: 200
    },
    hachage: {
        type: String,
        trim: true,
        required: [true, 'hachage is required'],
        minlength: 4,
        maxlength: 200
    },
    confirmations: {
        type: Number,
        required: [true, 'confirmations is required'],
        //minlength: 4,
        maxlength: 200
    },
    previousBlock: {
        type: String,
        trim: true,
        required: [true, 'previous block is required'],
        minlength: 4,
        maxlength: 200
    }
})

blockSchema.virtual('transactions', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'transaction'
})


const Block = mongoose.model('Block', blockSchema);

module.exports = Block;