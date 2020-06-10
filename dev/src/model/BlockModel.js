const mongoose = require('mongoose');
const validator = require('validator') 

const Schema = mongoose.Schema;

let blockSchema = new Schema({
    _id: new Schema.Types.ObjectId,
    index: {
        type: String,
        required: [true, 'index is required'],
        minlength: 4,
        maxlength: 200
    },
    timestamp: {
        type: String,
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
        type: String,
        required: [true, 'transaction is required'],
        minlength: 4,
        maxlength: 200
    },
    nonce: {
        type: String,
        required: [true, 'nonce is required'],
        minlength: 4,
        maxlength: 200
    },
    hachage: {
        type: String,
        required: [true, 'hachage is required'],
        minlength: 4,
        maxlength: 200
    },
    confirmations: {
        type: Number,
        required: [true, 'confirmations is required'],
        minlength: 4,
        maxlength: 200
    },
    previousBlock: {
        type: String,
        required: [true, 'previous block is required'],
        minlength: 4,
        maxlength: 200
    }
}, {
    // Define MongoDB Collection
    collection: 'blocks'
})