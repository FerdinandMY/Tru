const mongoose = require('mongoose');
const validator = require('validator') 

const Schema = mongoose.Schema;

let transactionSchema = new Schema({
    _id: new Schema.Types.ObjectId,
    amount: {
        type: Number,
        required: [true, 'amount is required'],
        //minlength: 4,
        maxlength: 200
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: [true, 'sender is required'],
        ref: 'User'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: [true, 'recipient is required'],
        ref: 'User'
    },
    transactionId: {
        type: Number,
        required: [true, 'transaction id is required'],
        minlength: 4,
        maxlength: 200
    }
}, {
    // Define MongoDB Collection
    collection: 'transactions'
})

const Transactions = mongoose.model('Transaction', transactionSchema);

module.exports = Transactions;