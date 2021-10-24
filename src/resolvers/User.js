function collectedStickers(parent, args, context) {
    return context.prisma.user
        .findUnique({ where: { id: parent.id } })
        .collectedStickers();
}

module.exports = {
    collectedStickers,
};
