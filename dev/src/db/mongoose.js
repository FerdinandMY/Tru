const mongoose = require('mongoose')
//const User = require('../model/UserModel'); 
//const Transactions = require('../model/TransactionModel'); 
//const PendingTransactions = require('../model/PendingTransactionModel'); 
//const Block = require('../model/BlockModel'); 
//const Wallet = require('../model/WalletModel'); 

mongoose.connect('mongodb://127.0.0.1:27017/db-test',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('Now connected to MongoDB!'))
  .catch(err => console.error('Something went wrong', err))


/*let John = new Transactions({
    _id: new mongoose.Types.ObjectId(),
    amount: '50000',
    sender:'Doe7',
    recipient: 'JOHNDOE1',
    transactionId: "01202902920",
})*/



/*John.save((error) => {
    if (error) {
        return console.log(`Something went wrong: ${error}`);
    }
    console.log('Document saved successfully!');
})*/
