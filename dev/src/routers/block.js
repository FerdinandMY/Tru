const mongoose = require('mongoose')
const express = require('express')
const Block = require('../model/BlockModel');  
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/block', async (req, res) => {
    const block = new Block(req.body)
    block['_id']= new mongoose.Types.ObjectId()
    console.log(block)
    try {
        await block.save()
        res.status(201).send(block)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/block', async (req, res) => {
    try {
        const block = await Block.find({})
        res.send(block)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/block/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const block = await Block.findById(_id)

        if (!block) {
            return res.status(404).send()
        }
        res.send(block)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/block/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['index', 'timestamp', 'numberOfTransaction', 'transaction','nonce','hachage']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const block = await Block.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!block) {
            return res.status(404).send()
        }

        res.send(block)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/block/:id', async (req, res) => {
    try {
        const block = await Block.findByIdAndDelete(req.params.id)

        if (!block) {
            return res.status(404).send()
        }

        res.send(block)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router