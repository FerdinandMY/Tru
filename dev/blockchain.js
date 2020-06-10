 const sha256 = require('sha256');
 const uuid = require('uuid'); 
 currentNodeUrl = process.argv[3];
  
 function Blockchain() {
    this.chain = [];
    this.pendingTransaction = [];

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    this.CreateNewBlock(100,'0','0');

}

Blockchain.prototype.CreateNewBlock = function(nonce, previousBlockHash,hash){
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransaction,
        nonce:nonce, 
        hash: hash, 
        previousBlockHash : previousBlockHash
    };

    this.pendingTransaction = []; 
    this.chain.push(newBlock);

    return newBlock;

}

Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length -1];
}

Blockchain.prototype.createNewTransaction = function(amount,sender,recipient){
    //new transaction object
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid.v1().split('-').join('')
    };
    //add new transaction any time a new transaction is created
    return newTransaction;

}

Blockchain.prototype.addTransactionToPendingTransaction = function(transactionObj) {

    this.pendingTransaction.push(transactionObj); 
    return this.getLastBlock()['index'] + 1;
}
 
Blockchain.prototype.hashBlock = function(previousBlockHash,currentBlockData,nonce){
     const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData); 
     const hash = sha256(dataAsString);
     return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
    // =>repeated hash block until it finds hash with begining with 0000 
    // => uses current block data for the hash, but also the previousBlockHash
    // => continuously changes nonce value until it finds the correct hash
    // => returns to us nonce value that creates the correct hash 

    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
    while (hash.substring(0,4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
        
    }

    return nonce;
}

Blockchain.prototype.chainIsValid = function(blockchain) {
	let validChain = true;

	for (var i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
		if (blockHash.substring(0, 4) !== '0000') validChain = false;
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
	};

	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

	return validChain;
};

Blockchain.prototype.getBlock = function(blockHash){
    let correctBlock = null;
    this.chain.forEach(block => {
        if(block.hash === blockHash) correctBlock = block ;
    });

    return correctBlock;
}

Blockchain.prototype.getTransaction = function(transactionId){

    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block =>{
        block.transactions.forEach(transaction => {
            if(transaction.transactionId === transactionId) {
                correctTransaction = transaction;
                correctBlock = block;
            }
        });
    });

    return {
        transaction: correctTransaction,
        block: correctBlock
    };

};

Blockchain.prototype.getAddressData = function(address){
    const addressTransactions = [];
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if(transaction.sender === address || transaction.recipient ===address){
                addressTransactions.push(transaction);
            };
        });
    });

    let balance = 0; 
    addressTransactions.forEach(transaction => {
        if(transaction.recipient === address) balance += transaction.amount;
        else if(transaction.sender === address) balance += transaction.amount;
    });

    return {
        addressTransactions:addressTransactions,
        addressBalance:balance,
        transaction:transaction,
        block:block
    }
};

//Currencylayer provides a simple REST API with real-time and historical exchange rates for 168 world currencies,
Blockchain.prototype.getLiveCurrencyLayer = function(){

    /*endpoint = 'live'
    access_key = '5baf53983ae536b3dee8273765e314c9';
    const requestOptions = {
        url:'https://api.currencylayer.com/' + endpoint + '?access_key=' + access_key ,
        method: 'GET',
        json: true
    };

    return {
        requestOptions: requestOptions
    } */
};

module.exports = Blockchain;
 