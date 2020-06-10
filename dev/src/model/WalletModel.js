const mongoose = require('mongoose');
const validator = require('validator') 

const Schema = mongoose.Schema;

let walletSchema = new Schema({
    _id: new Schema.Types.ObjectId,
    fiduciaryBalance: {
        type: Number,
        required: [true, 'fiduciary Balance is required'],
        minlength: 4,
        maxlength: 200
    },
    bitcoinBalance: {
        type: Number,
        required: [true, 'bitcoin Balance is required'],
        minlength: 4,
        maxlength: 200
    }
}, {
    // Define MongoDB Collection
    collection: 'wallets'
})