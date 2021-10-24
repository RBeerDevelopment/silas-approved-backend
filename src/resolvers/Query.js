async function stickers(parent, args, context, info) {
    const where = args.filter
        ? {
              name: { contains: args.filter },
          }
        : {};

    const stickers = await context.prisma.sticker.findMany({
        where,
        skip: args.skip,
        take: args.take,
    });
    return stickers;
}

async function collectedStickers(parent, args, context, info) {
    const { userId } = context;

    console.log(context);

    const stickers = await context.prisma.user
        .findUnique({ where: { id: userId } })
        .collectedStickers();

    return stickers;
}

module.exports = {
    collectedStickers,
    stickers,
};
