const mongoose = require('mongoose');
const validator = require('validator')

const Schema = mongoose.Schema;

let userSchema = new Schema({
    _id: new Schema.Types.ObjectId,
    nom: {
        type: String,
        required: [true, 'Name is required'],
        minlength: 4,
        maxlength: 200
    },
    prenom: {
        type: String,
        required: [true, 'FirstName is required'],
        minlength: 4,
        maxlength: 200
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate(value) {
            if(validator.isEmail(value)){
                throw new Error('Email is invalide') 
            }
        }, 
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
        required: [true, 'Password is required'],
        minlength: 5,
        maxlength: 1024
    },
    datedenaissane: {
        type: Date,
    },
    ville: {
        type: String,
        required: [true, 'Town is required'],
        minlength: 4,
        maxlength: 200
    },
    codepostal:{
        type: Number,
        required: [true, 'zip code is required'],
        minlength: 4,
        maxlength: 200
    },
    pays: {
        type: String,
        required: [true, 'country is required'],
        minlength: 4,
        maxlength: 200
    },
    unite: {
        type: String,
        required: [true, 'unite is required'],
        minlength: 4,
        maxlength: 200
    },
    votre_utilite_de_la_plateforme: {
        type: String,
        required: [true, 'plateforme utility is required'],
        minlength: 4,
        maxlength: 200
    },
    votre_source_de_revenu: {
        type: String,
        required: [true, 'source of revenu is required'],
        minlength: 4,
        maxlength: 200
    },
    statut_professionnel: {
        type: String,
        required: [true, 'professionnal statut is required'],
        minlength: 4,
        maxlength: 200
    },
    avatar: {
        type: Buffer
    },
    isAccountVerified: {
        type: Boolean
    },
    accountCreated: {
        type: Date,
        default: Date.now
    }
}, {
    
    collection: 'users'
})