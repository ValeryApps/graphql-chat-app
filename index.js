
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const express = require('express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { typeDefs } = require('./Schema');
const jwt = require('jsonwebtoken')
const { resolvers } = require('./resolvers/resolvers')

// create express and HTTP server
const app = express();
const httpServer = createServer(app);

const schema = makeExecutableSchema({
    typeDefs, resolvers,
})
// create websocket server
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});

// Save the returned server's info so we can shut down this server later
const serverCleanup = useServer({ schema }, wsServer);
const context = ({ req }) => {
    const { authorization } = req.headers;
    if (authorization) {
        const user = jwt.verify(authorization, process.env.SECRET_KEY)
        return user;
    }
}

// create apollo server
const apolloServer = new ApolloServer({
    schema,
    context,
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],

});

apolloServer.start().then(() => {
    apolloServer.applyMiddleware({ app, path: '/graphql' });
    httpServer.listen(4000, console.log("Listening on port 4000"));
});

// const { ApolloServer } = require('apollo-server-express');
// const { typeDefs } = require('./Schema');

// const jwt = require('jsonwebtoken')





// const server = new ApolloServer({
//     typeDefs, resolvers: {
//         Query,
//         Mutation,
//     },
//     context: ({ req }) => {
//         const { authorization } = req.headers;
//         if (authorization) {
//             const user = jwt.verify(authorization, process.env.SECRET_KEY)
//             return user;
//         }
//     }
// })

// server.listen().then(url => {
//     console.log('Listening to port:', url.port);
// })