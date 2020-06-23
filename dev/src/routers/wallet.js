const mongoose = require('mongoose')
const express = require('express')
const Wallet = require('../model/WalletModel'); 
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/wallet', auth,async (req, res) => {
    //const wallet = new Wallet(req.body)
    const wallet = new Wallet({
        ...req.body,
        owner: req.user._id
    })
    wallet['_id']= new mongoose.Types.ObjectId()
    try {
        await wallet.save()
        res.status(201).send(wallet)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/wallet', auth,async (req, res) => {
    try {
        await req.user.populate('wallets').execPopulate()
        //const wallet = await Wallet.find({})
        res.send(wallet)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/wallet/:id', auth,async (req, res) => {
    const _id = req.params.id

    try {
        //const wallet = await Wallet.findById(_id)
        const wallet = await Wallet.findOne({ _id, owner: req.user._id })
        if (!walletSchema) {
            return res.status(404).send()
        }

        res.send(wallet)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/wallet/:id', auth,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['fiduciaryBalance', 'bitcoinBalance']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const wallet = await Wallet.findOne({ _id: req.params.id, owner: req.user._id})
        if (!wallet) {
            return res.status(404).send()
        }
        updates.forEach((update) => wallet[update] = req.body[update])
        await wallet.save()
        res.send(wallet)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/wallet/:id', auth,async (req, res) => {
    try {
        const wallet = await Wallet.findByIdAndDelete(req.params.id)

        if (!wallet) {
            return res.status(404).send()
        }

        res.send(wallet)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router