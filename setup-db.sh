#!/bin/sh

npx prisma migrate deploy --preview-feature
npx prisma generate