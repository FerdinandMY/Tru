const mongoose = require('mongoose')
const express = require('express')
const Transaction = require('../model/TransactionModel');
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/transactions', async (req, res) => {
    
    const transaction = new Transaction(req.body)
    transaction['_id']= new mongoose.Types.ObjectId()
    
    try {
        await transaction.save()
        res.status(201).send(transaction)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/transactions', async (req, res) => {
    try {
        const transaction = await Transaction.find({})
        res.send(transaction)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/transactions/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const transaction = await Transaction.findById(_id)

        if (!transaction) {
            return res.status(404).send()
        }

        res.send(transaction)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/transactions/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['amount', 'sender', 'recipient', 'transactionId','isConfirmed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!transaction) {
            return res.status(404).send()
        }

        res.send(transaction)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id)

        if (!transaction) {
            return res.status(404).send()
        }

        res.send(transaction)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router