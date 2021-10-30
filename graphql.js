const { ApolloServer, gql } = require('apollo-server-lambda');
const { PubSub } = require('graphql-subscriptions');
const { PrismaClient } = require('@prisma/client');

const { getUserId } = require('./src/utils');

const Query = require('./src/resolvers/Query');
const Mutation = require('./src/resolvers/Mutation');
const Subscription = require('./src/resolvers/Subscription');
const User = require('./src/resolvers/User');
const Location = require('./src/resolvers/Location');
const Sticker = require('./src/resolvers/Sticker');

const typeDefs = require('./src/type-defs').typeDefs;

const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Location,
    Sticker,
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: ({ express: { req } }) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId:
                req && req.headers.authorization ? getUserId(req) : undefined,
        };
    },
});

exports.graphqlHandler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true,
    },
});
