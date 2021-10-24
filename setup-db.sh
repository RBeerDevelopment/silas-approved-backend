#!/bin/sh

npx prisma migrate dev --preview-feature
npx prisma generate