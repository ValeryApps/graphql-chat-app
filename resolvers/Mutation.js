const { users } = require("../data/data")
const { AuthenticationError } = require("apollo-server-express")
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions');


const pubSub = new PubSub();

const prisma = new PrismaClient();

exports.Mutation = {

    registerUser: async (_, { input }) => {
        const { firstName, lastName, email, password } = input
        const userExists = await prisma.user.findFirst({ where: { email } });

        if (userExists) {
            throw new AuthenticationError("User with this email already exists")
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                firstName, lastName, email, password: hashedPassword
            }
        })
        return newUser
    },

    loginUser: async (_, { input }) => {
        const { email, password } = input;
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            throw new AuthenticationError('This contact does not exist in our system')
        }
        if (!await bcrypt.compare(password, user.password)) {
            throw new AuthenticationError('Wrong password')
        }
        const token = await jwt.sign({ email: user.email, id: user.id, }, process.env.SECRET_KEY, { expiresIn: '1d' });
        const returnUser = { user, token }
        return returnUser
    },

    sendMessage: async (parent, { input }, { id }) => {
        const { text, receiverId } = input;
        // console.log("parent: ", parent);

        const receId = parseInt(receiverId);
        const sendId = parseInt(id);

        console.log("receId: ", receId);
        console.log("sendId: ", sendId);
        const newMessage = await prisma.message.create({
            data: {
                text,
                receiverId: receId,
                senderId: sendId
            }
        })
        pubSub.publish('MESSAGE_ADDED', { addMessage: newMessage })
        return newMessage;
    }

}