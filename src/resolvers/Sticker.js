function location(parent, args, context) {
    return context.prisma.sticker
        .findUnique({ where: { id: parent.id } })
        .location();
}

function createdBy(parent, args, context) {
    return context.prisma.sticker
        .findUnique({ where: { id: parent.id } })
        .createdBy();
}

module.exports = {
    location,
    createdBy,
};
