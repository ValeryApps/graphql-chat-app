const { AuthenticationError } = require("apollo-server-express")
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions');


const prisma = new PrismaClient();

const pubSub = new PubSub();
exports.resolvers = {
    Query: {
        users: async (_, args, { id }) => {
            const users = await prisma.user.findMany();
            const otherUsers = users.filter(x => x.id != id);
            return otherUsers;
        },
        user: async (_, { id }) => {
            return await prisma.user.findUnique({ where: { id: +id } })
        },
        currentUser: async (_, args, { id }) => {
            return await prisma.user.findUnique({ where: { id: +id } })
        },
        userMessages: async (_, { receiverId }, { id }) => {

            if (!id) {
                throw new ForbiddenError("Not authenticated")
            }
            const messages = await prisma.message.findMany({
                orderBy: { CreatedAt: 'asc' },
                where: {
                    OR: [
                        { receiverId: receiverId, senderId: id },
                        { receiverId: id, senderId: receiverId },
                    ]
                },
            });
            return messages
        }
    },
    Mutation: {

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

    },
    Subscription: {
        addMessage: {
            subscribe: () => pubSub.asyncIterator('MESSAGE_ADDED')
        }
    }
}