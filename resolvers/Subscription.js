const { PubSub } = require('graphql-subscriptions')


const pubSub = new PubSub();


exports.Subscription = {
    addMessage: {
        subscribe: () => pubSub.asyncIterator('MESSAGE_ADDED')

    }
}