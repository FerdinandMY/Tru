const mongoose = require('mongoose');
const validator = require('validator') 

const Schema = mongoose.Schema;

let transactionSchema = new Schema({
    _id: new Schema.Types.ObjectId,
    amount: {
        type: Number,
        required: [true, 'amount is required'],
        minlength: 4,
        maxlength: 200
    },
    sender: {
        type: String,
        trim: true,
        required: [true, 'sender is required'],
        minlength: 4,
        maxlength: 200
    },
    recipient: {
        type: String,
        trim: true,
        required: [true, 'recipient is required'],
        minlength: 4,
        maxlength: 200
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

const Transactions = mongoose.model('transaction', transactionSchema);

module.exports = Transactions;