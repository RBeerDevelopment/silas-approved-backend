const { s3uploader } = require('../s3/s3-upload');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    APP_SECRET,
    getTokenPayload,
    validateEmailAddress,
    validatePassword,
} = require('../utils');

async function signup(parent, args, context, info) {
    const isValidEmail = validateEmailAddress(args.email);
    if (!isValidEmail) throw new Error('invalid_email');

    const isValidPassword = validatePassword(args.password);
    if (!isValidPassword) throw new Error('invalid_password');

    const password = await bcrypt.hash(args.password, 10);

    const user = await context.prisma.user.create({
        data: { ...args, password },
    });

    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    return {
        token,
        user,
    };
}

async function login(parent, args, context, info) {
    const isValidEmail = validateEmailAddress(args.email);
    if (!isValidEmail) throw new Error('invalid_email');

    const user = await context.prisma.user.findUnique({
        where: { email: args.email },
    });

    if (!user) {
        throw new Error('no_such_user');
    }

    const valid = await bcrypt.compare(args.password, user.password);

    if (!valid) {
        throw new Error('invalid_password');
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

async function post(parent, args, context, info) {
    const { userId } = context;

    const { name, type, lat, lng, image } = args;

    let s3url;

    if (image) {
        const { createReadStream, filename, mimetype } = await args.image;

        s3url = await s3uploader.upload(createReadStream(), {
            filename,
            mimetype,
        });
    }

    const newSticker = await context.prisma.sticker.create({
        data: {
            name,
            type,
            location: {
                create: { lat, lng },
            },
            createdBy: {
                connect: { id: userId },
            },
            imageUrl: s3url ? s3url : '',
        },
    });

    // this can run async in the background as it is not required to return the new sticker
    context.prisma.user.update({
        where: { id: userId },
        data: {
            collectedStickers: {
                connect: { id: newSticker.id },
            },
        },
    });

    context.pubsub.publish('NEW_STICKER', newSticker);

    return newSticker;
}

async function refreshToken(parent, { token }, context, info) {
    const payload = getTokenPayload(token);

    const user = await context.prisma.user.findUnique({
        where: { id: payload.userId },
    });

    const newToken = jwt.sign({ userId: payload.userId }, APP_SECRET);

    return { token: newToken, user };
}

async function scan(parent, args, context, info) {
    const { userId } = context;

    const updatedUser = await context.prisma.user.update({
        where: { id: userId },
        data: {
            collectedStickers: {
                connect: { id: parseInt(args.stickerId) },
            },
        },
    });

    return updatedUser;
}

async function deleteSticker(parent, args, context, info) {
    const deletedSticker = await context.prisma.sticker.delete({
        where: { id: parseInt(args.id) },
    });

    s3uploader.delete(deletedSticker.imageUrl);
    return deletedSticker;
}

module.exports = {
    signup,
    login,
    post,
    scan,
    deleteSticker,
    refreshToken,
};
