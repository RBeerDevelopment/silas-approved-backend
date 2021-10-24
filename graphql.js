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

const prisma = new PrismaClient();
const pubsub = new PubSub();

const typeDefs = gql`

    scalar Upload
    
    type Query {
        stickers(filter: String, skip: Int, take: Int): [Sticker]!
        collectedStickers: [Sticker]!
    }

    type Mutation {
        signup(email: String!, password: String!, name: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload

        refreshToken(token: String!): AuthPayload

        post(name: String!, lat: Float!, lng: Float!, image: Upload): Sticker!
        scan(stickerId: ID!): User!
        deleteSticker(id: ID!): Sticker!
    }

    type Sticker {
        id: ID!
        name: String!
        location: Location!
        createdBy: User!
        createdAt: String
        imageUrl: String
    }

    type Location {
        id: ID!
        lat: Float!
        lng: Float!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        collectedStickers: [Sticker]!
    }

    type AuthPayload {
        token: String
        user: User
    }

    type Subscription {
        newSticker: Sticker
    }
`;

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
    playground: {
        endpoint: "/dev/graphql"
    },
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId: req && req.headers.authorization ? getUserId(req) : null,
        };
    },
});

// server
//     .listen({ port: process.env.PORT || 4000 })
//     .then(({ url }) => console.log(`Server is running on ${url}`));

exports.graphqlHandler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true,
      },
});