const router = require("express").Router();
const Conversation = require("../models/Conversation");

// new con

router.post("/", async (req, res) => {
    const { senderId, recieverId } = req.body;
    console.log(senderId, recieverId);
    const newConversation = new Conversation({
        members: [senderId, recieverId],
    })

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
})

// get conversation of a user

router.get("/:userId", async (req,res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in:[req.params.userId] }
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;