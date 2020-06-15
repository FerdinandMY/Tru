const mongoose = require('mongoose')
const validator = require('validator')
const User = require('../model/UserModel'); 
const Transactions = require('../model/TransactionModel'); 
const PendingTransactions = require('../model/PendingTransactionModel'); 
const Block = require('../model/BlockModel'); 
const Wallet = require('../model/WalletModel'); 

mongoose.connect('mongodb://127.0.0.1:27017/db-test',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('Now connected to MongoDB!'))
  .catch(err => console.error('Something went wrong', err))


//const Block = mongoose.model('block', userSchema);
//const Wallet = mongoose.model('wallet', userSchema);
//const Transaction = mongoose.model('transaction', userSchema);
//const PendingTransaction = mongoose.model('pendingtransaction', userSchema);


let John = new User({
    _id: new mongoose.Types.ObjectId(),
    nom: '     John1  ',
    prenom:'Doe7',
    email: 'JOHNDOE1@GMAIL.COM',
    telephone: "01202902920",
    isAccountVerified: true,
    password: 'johndtrtrtrrt',
    ville:'yaounde',
    codepostal:'2511',
    pays:'cameroun',
    unite:'test unite',
    votre_utilite_de_la_plateforme:'votre_utilite_de_la_plateforme',
    votre_source_de_revenu:'votre_source_de_revenu',
    statut_professionnel:'statut_professionnel'
   
})

/*let walletData = new Wallet({
    _id: new mongoose.Types.ObjectId(),
    fiduciaryBalance: "1000000",
    bitcoinBalance: "1002455"
})*/

John.save((error) => {
    if (error) {
        return console.log(`Something went wrong: ${error}`);
    }
    console.log('Document saved successfully!');
})
/*me.save().then((me) =>{
    console.log(me)
}).catch((error) => {
    console.log('error', error)
})*/
