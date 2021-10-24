function newStickerSubscribe(parent, args, context, info) {
    return context.pubsub.asyncIterator('NEW_STICKER');
}

const newSticker = {
    subscribe: newStickerSubscribe,
    resolve: (payload) => {
        return payload;
    },
};

module.exports = {
    newSticker,
};
