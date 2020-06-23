const mongoose = require('mongoose')
const express = require('express')
const PendingTransactions = require('../model/PendingTransactionModel');
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/pendingtransaction', auth,async (req, res) => {
   // const pendingTransaction = new PendingTransactions(req.body)
    const wallet = new PendingTransactions({
        ...req.body,
        sender: req.user._id
    })
    pendingTransaction['_id']= new mongoose.Types.ObjectId()
    try {
        await pendingTransaction.save()
        res.status(201).send(pendingTransaction)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/pendingtransaction', auth,async (req, res) => {
    try {
        const pendingTransaction = await PendingTransactions.find({})
        res.send(pendingTransaction)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/pendingtransaction/:id', auth,async (req, res) => {
    const _id = req.params.id

    try {
        const pendingTransaction = await PendingTransactions.findById(_id)

        if (!pendingTransaction) {
            return res.status(404).send()
        }

        res.send(pendingTransaction)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/pendingtransaction/:id', auth,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['amount', 'sender', 'recipient', 'transactionId','isConfirmed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const pendingTransaction = await PendingTransactions.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!pendingTransaction) {
            return res.status(404).send()
        }

        res.send(pendingTransaction)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/pendingtransaction/:id', auth,async (req, res) => {
    try {
        const pendingTransaction = await PendingTransactions.findByIdAndDelete(req.params.id)

        if (!pendingTransaction) {
            return res.status(404).send()
        }

        res.send(pendingTransaction)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router