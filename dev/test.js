const Blockchain = require('./blockchain');

var printError = function(error, explicit) {
    console.log(`[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}`);
}
try {
    const bitcoin = new Blockchain();  
//     bitcoin.CreateNewBlock(2378,'jhdjhdfjhdf88','jhfjfjhfdjhjhdf'); 
//     //bitcoin.CreateNewBlock(2345,'jhdjhdf75hdf88','jhfjfjhfdjh45hdf'); 
//     bitcoin.createNewTransaction(100,'ALEXJHFDHJDFJHDFJH','JOHNHJHDFJHDFJHDF');
    
//    // bitcoin.CreateNewBlock(2123,'jhdjhdfjhdf75','jhfjfj4563djhjhdf'); 
    
//     bitcoin.createNewTransaction(1000,'ALEXJHFDHJDFJHDFJH','JOHNHJHDFJHDFJHDF');
//     //bitcoin.CreateNewBlock(2173,'jhdjhdfghhgdshjhdf75','jhfjfj4hdhgdhg563djhjhdf'); 
    
//     bitcoin.createNewTransaction(1450,'ALEXJHFDHJDFJHDFJH','JOHNHJHDFJHDFJHDF');
//     //bitcoin.CreateNewBlock(2873,'jfjdffhhfjhjdfhjd','opdshhfdhdfhg'); 

//     bitcoin.createNewTransaction(150,'ALEXJHFDHJDFJHDFJH','JOHNHJHDFJHDFJHDF');
    
//     bitcoin.CreateNewBlock(2103,'jfjdffhhfjhhjfhjdfjhjdfhjd','hdshsdjhfhfhfdh'); 
    
//     console.log(bitcoin.getLastBlock());

const previousBlockHash = 'ODFDDFFDFDJHDJHDFJHDFJH';
const currentBlockData = [
    {
        amount:100,
        sender:'GDJDFJHDFJHFDJHDF',
        recipient: 'JHDFJDFKJDFKJDF'
    },
    {
        amount:10,
        sender:'GDJDFJHDFJHFDJJKF',
        recipient: 'JHDFJDFK45FKJDF'
    },
    {
        amount:1000,
        sender:'GDJDFJHDFJHF52HDF',
        recipient: 'JHDFJDFKJDFKJ40'
    } 
];//
const nonce = 100;

console.log(bitcoin.hashBlock(previousBlockHash,currentBlockData,14017));
    
} catch (e) {
    if (e instanceof TypeError) {
        printError(e, true);
    } else {
        printError(e, true); 
    }
}

