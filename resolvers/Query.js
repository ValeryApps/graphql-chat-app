const { PrismaClient } = require('@prisma/client');
const { ForbiddenError } = require("apollo-server-express")
const prisma = new PrismaClient();
exports.Query = {
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
}
