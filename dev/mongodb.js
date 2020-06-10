// CRUD create read update delete


/*MongoClient.connect(connectionURL, {useNewUrlParser:true, useUnifiedTopology:true}, (error,client)=>{

    if(error){
        console.log('Unable to connect to database!')
    }
    console.log('connected correctly!')
    
})*/

//const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')
const connectionURL = "mongodb://127.0.0.1:27017"
const databaseName = 'db-test'
const client = new MongoClient(connectionURL, { useNewUrlParser: true, useUnifiedTopology:true });
client.connect(err => {
  if(err){
    console.log('Unable to connect to database!')
  }
  else{
    console.log('connected correctly!')
    const db = client.db(databaseName)
   
    /*db.collection('users').find({_id: new ObjectID("5ed96456cbede2224476cd3e")}).toArray((err,result) => {
      if(err) {console.log('someone fail')}
      console.log(result)
    }) 
    db.collection('users').find({_id: new ObjectID("5ed96456cbede2224476cd3e")}).count((err,count) => {
      if(err) {console.log('someone fail')}
      console.log(count)
    }) */
    /*db.collection("users").insertOne({
        _id: id,
        name: 'Andrew',
        age:27
    }, (err,result) => {
        if(err){ return console.log('Unable to insert user')} 
        console.log(result.ops)
    })*/
    /*db.collection('users').insertMany([
      {
        name:'lovren',
        age:45
      },
      {
        name:'origi',
        age:52
      }
    ],(err,result) => {
      if(err) {return console.log('Unable to insert user')}
      console.log(result.ops)
    })*/
    // perform actions on the collection object
    //client.close();
   /*const updatePromise = db.collection('users').updateOne({
      _id: new ObjectID('5eda187168cbce0bb0457f29')
    }, {
       $set: {
         name: "Hervé1"
       }
    }) .then((result) => {
      console.log(result)
    }).catch((err) => {
      console.log(err)
    })*/
    db.collection('users').deleteMany({
      age: 45
    }).then((result) => {
        console.log(result)
    }).catch((err) => {
        console.log(err)
    })
  } 
  
}); 