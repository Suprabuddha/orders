FROM node:21-alpine

# Create work directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production
# Bundle app source
COPY . .
EXPOSE 3000
CMD [ "node","index.js" ]