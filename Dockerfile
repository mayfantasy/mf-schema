FROM node:12-slim

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --production

COPY . ./

ENV NODE_ENV production
ENV MF_SCHEMA_ACCOUNT_DB_KEY fnADekK1_oACExkeSdTKIbz0q7b9VEejj2n6nuTT
ENV JWT_SECRET mf-schema-admin-2019
ENV GOOGLE_STORAGE_BUCKET_NAME schema-images
ENV USER_JWT_SECRET user-jwt-secret
ENV RECOVER_EMAIL_ADDRESS yuelun123321@hotmail.com
ENV RECOVER_EMAIL_PASSWORD 199051qQqQ

RUN yarn gcp-build

EXPOSE 3000

CMD [ "yarn", "start" ]