const Blockchain = require("./blockchain");

const express = require("express");
const app = express();
//database connection file
require("./src/db/mongoose")
const userRouter = require('./src/routers/user')
const transactionRouter = require('./src/routers/transaction')
const pendingTransactionRouter = require('./src/routers/pendingTransaction')
const walletRouter = require('./src/routers/wallet')
const blockRouter = require('./src/routers/block')
const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser");
// to create a unique random string and to use that string to network node adresse
const uuid = require("uuid");
const port = process.argv[2];

const rp = require("request-promise");
const e = require("express");
//console.log(rp);
const nodeAddress = uuid.v1().split("-").join("");

const bitcoin = new Blockchain();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(userRouter)
app.use(transactionRouter)
app.use(pendingTransactionRouter)
app.use(walletRouter)
app.use(blockRouter)
//app.use(bodyParser.urlencoded({ extended: false }));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/blockchain", function (req, res) {
  res.send(bitcoin);
});

app.post("/transaction", function (req, res) {
  //const newTransaction = new PendingTransactions(req.body);
  const newTransaction = req.body;
 // newTransaction.save().then(() => {
    const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
   /* res.status(201).send(user)
  }).catch((e) => {
    res.status(400).send(e)
  })*/
  
});

app.post("/transaction/broadcast", function (req, res) {
  const { amount, sender, recipient } = req.body;
  const newTransaction = bitcoin.createNewTransaction(
    amount,
    sender,
    recipient
  );
  bitcoin.addTransactionToPendingTransaction(newTransaction);

  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then((data) => {
    res.json({ note: "Transaction created and broadcast successfully" });
  });
});

app.get("/mine", function (req, res) {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: bitcoin.pendingTransaction,
    index: lastBlock["index"] + 1,
  };

  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );

  //bitcoin.createNewTransaction(12,"00",nodeAddress);

  const newBlock = bitcoin.CreateNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/receive-new-block",
      method: "POST",
      body: { newBlock: newBlock },
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then((data) => {
      const requestOptions = {
        uri: bitcoin.currentNodeUrl + "/transaction/broadcast",
        method: "POST",
        body: {
          amount: 12.5,
          sender: "00",
          recipient: nodeAddress,
        },
        json: true,
      };

      return rp(requestOptions);
    })
    .then((data) => {
      res.json({
        note: "New block mined & broadcast successfully",
        block: newBlock,
      });
    });
});

app.post("/receive-new-block", function (req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock["index"] + 1 === newBlock["index"];

  if (correctHash && correctIndex) {
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransaction = [];
    res.json({
      note: "New block received and accepted",
      newBlock: newBlock,
    });
  } else {
    res.json({
      note: "New block rejected",
      newBlock: newBlock,
    });
  }
});
//register a node and broadcast it the network
app.post("/register-and-broacast-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  const regNodesPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    // register-node

    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };

    regNodesPromises.push(rp(requestOptions));
  });

  Promise.all(regNodesPromises)
    .then((data) => {
      // use the data
      const bulkRegisterOptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
        },
        json: true,
      };

      return rp(bulkRegisterOptions);
    })
    .then((data) => {
      res.json({ note: "New node registered with network successfully." });
    });
});

//register a node with the network
app.post("/register-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode)
    bitcoin.networkNodes.push(newNodeUrl);

  res.json({ note: "New node registered successfully" });
});

//register multiple nodes at once
app.post("/register-nodes-bulk", function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  //console.log(req.body.allNetworkNodes);
  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent =
      bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode)
      bitcoin.networkNodes.push(networkNodeUrl);
  });

  res.json({ note: "Bulk registration successfully" });
});

// consensus
app.get("/consensus", function (req, res) {
  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/blockchain",
      method: "GET",
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then((blockchains) => {
    const currentChainLength = bitcoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach((blockchain) => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });

    if (
      !newLongestChain ||
      (newLongestChain && !bitcoin.chainIsValid(newLongestChain))
    ) {
      res.json({
        note: "Current chain has not been replaced.",
        chain: bitcoin.chain,
      });
    } else {
      bitcoin.chain = newLongestChain;
      bitcoin.pendingTransactions = newPendingTransactions;
      res.json({
        note: "This chain has been replaced.",
        chain: bitcoin.chain,
      });
    }
  });
});

app.get("/block/:blockHash", function (req, res) {
  const blockHash = req.params.blockHash;
  const correctBlock = bitcoin.getBlock(blockHash);
  res.json({
    block: correctBlock,
  });
});



app.get("/transaction/:transactionId", function (req, res) {
  const transactionId = req.params.transactionId;
  const transactionData = bitcoin.getTransaction(transactionId);
  res.json({
    transaction: transactionData.transaction,
    block: transactionData.block,
  });
});

app.get("/address/:address", function (req, res) {
  const address = req.params.address;
  const addressData = bitcoin.getAddressData(address);
  res.json({
    addressData: addressData,
  });
});

app.get("block-explorer", function (req, res) {
  res.sendFile("./block-explorer/index.html", { root: __dirname });
});

app.get("/get-livecurrencylayer", function (req, res) {
  endpoint = "live";
  access_key = "5baf53983ae536b3dee8273765e314c9";
  const requestOptions = {
    url:
      "https://free.currconv.com/api/v7/currencies?apiKey=d1cd4e76b7a59acecb43",
    method: "GET",
    json: true,
  };
  rp(requestOptions)
    .then(function (repos) {
      res.json({
        value: repos,
      });
    })
    .catch(function (err) {
      res.json({
        value: err,
      });
    });
});
app.get("/get-convertcurrencylayer", function (req, res) {
  from = "EUR";
  to = "GBP";
  amount = "10";
  endpoint = "convert";
  access_key = "5baf53983ae536b3dee8273765e314c9";
  const requestOptions = {
    url:
      "https://free.currconv.com/api/v7/convert?q=USD_EUR,EUR_USD&compact=ultra&apiKey=d1cd4e76b7a59acecb43",
    //url:'https://free.currconv.com/' + endpoint + '?access_key=' + access_key +'&from=' + from + '&to=' + to + '&amount=' + amount + '&format='+ 1,
    method: "GET",
    json: true,
  };
  rp(requestOptions)
    .then(function (repos) {
      res.json({
        value: repos,
      });
    })
    .catch(function (err) {
      res.json({
        value: err,
      });
    });
});
app.get("/get-countriescurrencylayer", function (req, res) {
  from = "EUR";
  to = "GBP";
  amount = "10";
  endpoint = "convert";
  access_key = "5baf53983ae536b3dee8273765e314c9";
  const requestOptions = {
    url:
      "https://free.currconv.com/api/v7/countries?apiKey=d1cd4e76b7a59acecb43",
    //url:'https://free.currconv.com/' + endpoint + '?access_key=' + access_key +'&from=' + from + '&to=' + to + '&amount=' + amount + '&format='+ 1,
    method: "GET",
    json: true,
  };
  rp(requestOptions)
    .then(function (repos) {
      res.json({
        value: repos,
      });
    })
    .catch(function (err) {
      res.json({
        value: err,
      });
    });
});
app.get("/get-historicalsingledatacurrencylayer", function (req, res) {
  endpoint = "convert";
  access_key = "5baf53983ae536b3dee8273765e314c9";
  const requestOptions = {
    url:
      "https://free.currconv.com/api/v7/convert?q=USD_PHP,PHP_USD&compact=ultra&date=2020-05-25&apiKey=d1cd4e76b7a59acecb43",
    //url:'https://free.currconv.com/' + endpoint + '?access_key=' + access_key +'&from=' + from + '&to=' + to + '&amount=' + amount + '&format='+ 1,
    method: "GET",
    json: true,
  };
  rp(requestOptions)
    .then(function (repos) {
      res.json({
        value: repos,
      });
    })
    .catch(function (err) {
      res.json({
        value: err,
      });
    });
});
app.get("/get-historicalrangedatacurrencylayer", function (req, res) {
  endpoint = "convert";
  access_key = "5baf53983ae536b3dee8273765e314c9";
  const requestOptions = {
    url:
      "https://free.currconv.com/api/v7/convert?q=USD_PHP,PHP_USD&compact=ultra&date=2020-05-23&endDate=2020-05-31&apiKey=d1cd4e76b7a59acecb43",
    //url:'https://free.currconv.com/' + endpoint + '?access_key=' + access_key +'&from=' + from + '&to=' + to + '&amount=' + amount + '&format='+ 1,
    method: "GET",
    json: true,
  };
  rp(requestOptions)
    .then(function (repos) {
      res.json({
        value: repos,
      });
    })
    .catch(function (err) {
      res.json({
        value: err,
      });
    });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}....`);
});
