const Blockchain = require('./blockchain');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// to create a unique random string and to use that string to network node adresse
const uuid = require('uuid'); 
// 
const nodeAddress = uuid.v1().split('-').join('');

const bitcoin = new Blockchain();

app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
var urlencodedParser = bodyParser.urlencoded({ extended: false })



app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});


app.post('/transaction', function (req, res) {
    //console.log(req.body);
    const {amount, sender, recipient} = req.body;
    //res.send(`The amount of the transaction is ${amount} bitcoin.`);
    //const obj = JSON.parse(req.body); // req.body = [Object: null prototype] { title: 'product' }

    //console.log(req);
   const blockIndex = bitcoin.createNewTransaction(amount, sender , recipient);
   res.json({note:`Transaction will be added in block ${blockIndex}.`});
}); 

app.get('/mine', function (req, res) {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
      transactions: bitcoin.pendingTransaction,
      index:lastBlock['index'] + 1 
  };
  
  const nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);
  const blockHash = bitcoin.hashBlock(previousBlockHash,currentBlockData,nonce);

  bitcoin.createNewTransaction(12,"00",nodeAddress);

  const newBlock = bitcoin.CreateNewBlock(nonce,previousBlockHash,blockHash);
    
  res.json({
    note:"New block mined successfully",
    block: newBlock
  });
});
 


app.listen(3000, function(){
    console.log('Listening on port 3000....');
});