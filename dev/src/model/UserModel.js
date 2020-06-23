const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({ 
    nom: {
        type: String,
        required: [true, 'Name is required'],
        minlength: 4,
        trim: true,
        maxlength: 200
    },
    prenom: {
        type: String,
        trim: true,
        minlength: 4,
        maxlength: 200
    },
    email: {
        type: String,
        trim: true,
        unique: true,
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
        required: [true, 'User phone number required']
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
        minlength: 4,
        maxlength: 200
    },
    codepostal:{
        type: Number,
        minlength: 4,
        trim: true,
        maxlength: 200
    },
    pays: {
        type: String,
        trim: true,
        minlength: 4,
        maxlength: 200
    },
    unite: {
        type: String,
        trim: true,
        minlength: 4,
        maxlength: 200
    },
    votre_utilite_de_la_plateforme: {
        type: String,
        trim: true,
        minlength: 4,
        maxlength: 200
    },
    votre_source_de_revenu: {
        type: String,
        trim: true,
        minlength: 4,
        maxlength: 200
    },
    statut_professionnel: {
        type: String,
        trim: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('transactions', {
    ref: 'Transaction',
    localField: '_id',
    foreignField: 'sender'
})

userSchema.virtual('pendingTransaction', {
    ref: 'Pendingtransaction',
    localField: '_id',
    foreignField: 'sender'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
   // console.log(user)
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    //console.log(isMatch)
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}
// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

/*let userSchema = new Schema({
    
}, { 
    collection: 'users'
})*/

const User = mongoose.model('User', userSchema);

module.exports = User;