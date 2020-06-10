const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017',{
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('Now connected to MongoDB!'))
  .catch(err => console.error('Something went wrong', err))

const User = mongoose.model('User',{
    nom: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 200
    },
    prenom: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 200
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    telephone: {
        type: String,
        unique: true, 
        /*validate: {
            validator: function(v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
        },
            message: props => `${props.value} is not a valid phone number!`
        },*/
        required: [true, 'User phone number required']
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    datedenaissane: {
        type: Date,
    },
    ville: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 200
    },
    codepostal:{
        type: Number,
        required: true,
        minlength: 4,
        maxlength: 200
    },
    pays: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 200
    },
    unite: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 200
    },
    votre_utilite_de_la_plateforme: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 200
    },
    votre_source_de_revenu: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 200
    },
    statut_professionnel: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 200
    }

})


const me = new User({
    nom: 'toto',
    prenom: 'tototo',
    email: 'toto@gmail.com',
    telephone: 690309847,
    password: 'toto@gmail.com',
    ville: 'yaounde',
    codepostal: '25546',
    pays: 'cameroun',
    unite: 'dsdsdssd',
    votre_utilite_de_la_plateforme: 'esdshhdshsdds',
    votre_source_de_revenu: 'djdjhdhjhd',
    statut_professionnel: 'dnddndnbdbndbn'

})

me.save().then((me) =>{
    console.log(me)
}).catch((error) => {
    console.log('error', error)
})
