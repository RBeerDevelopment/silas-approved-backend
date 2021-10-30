const { gql } = require('apollo-server-lambda');

export const typeDefs = gql`
    scalar Upload

    type Query {
        stickers(filter: String, skip: Int, take: Int): [Sticker]!
        collectedStickers: [Sticker]!
    }

    type Mutation {
        signup(email: String!, password: String!, name: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload

        refreshToken(token: String!): AuthPayload

        post(
            name: String!
            type: StickerType!
            lat: Float!
            lng: Float!
            image: Upload
        ): Sticker!
        scan(stickerId: ID!): User!
        deleteSticker(id: ID!): Sticker!
    }

    type Sticker {
        id: ID!
        name: String!
        type: StickerType!
        location: Location!
        createdBy: User!
        createdAt: String
        imageUrl: String
    }

    enum StickerType {
        SILAS_APPROVED_ORIGINAL
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
