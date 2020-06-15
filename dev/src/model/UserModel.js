const mongoose = require('mongoose');
const validator = require('validator')

const Schema = mongoose.Schema;

let userSchema = new Schema({
    //_id: new Schema.Types.ObjectId,
    nom: {
        type: String,
        required: [true, 'Name is required'],
        minlength: 4,
        trim: true,
        maxlength: 200
    },
    prenom: {
        type: String,
        //required: [true, 'FirstName is required'],
        trim: true,
        minlength: 4,
        maxlength: 200
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Email is required'],
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalide') 
            }
        }, 
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    telephone: {
        type: String,
        trim: true,
        unique: true, 
        /*validate: {
            validator: function(v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
        },
            message: props => `${props.value} is not a valid phone number!`
        },*/
        //required: [true, 'User phone number required']
    },
    password: {
        type: String,
        trim: true,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password is Invalid') 
            }
        },
        required: [true, 'Password is required'],
        minlength: 8,
        maxlength: 1024
    },
    datedenaissane: {
        type: Date,
    },
    ville: {
        type: String,
        trim: true,
        //required: [true, 'Town is required'],
        minlength: 4,
        maxlength: 200
    },
    codepostal:{
        type: Number,
        //required: [true, 'zip code is required'],
        minlength: 4,
        trim: true,
        maxlength: 200
    },
    pays: {
        type: String,
        trim: true,
        //required: [true, 'country is required'],
        minlength: 4,
        maxlength: 200
    },
    unite: {
        type: String,
        trim: true,
        //required: [true, 'unite is required'],
        minlength: 4,
        maxlength: 200
    },
    votre_utilite_de_la_plateforme: {
        type: String,
        trim: true,
        //required: [true, 'plateforme utility is required'],
        minlength: 4,
        maxlength: 200
    },
    votre_source_de_revenu: {
        type: String,
        trim: true,
        //required: [true, 'source of revenu is required'],
        minlength: 4,
        maxlength: 200
    },
    statut_professionnel: {
        type: String,
        trim: true,
       // required: [true, 'professionnal statut is required'],
        minlength: 4,
        maxlength: 200
    },
    avatar: {
        type: Buffer
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    accountCreated: {
        type: Date,
        default: Date.now
    }
}, { 
    collection: 'users'
})

const User = mongoose.model('User', userSchema);

module.exports = User;