FROM node:22-alpine3.19

# Copy application dependency manifest files to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY src/ ./src

# build the application
RUN npm run build

# Run the application
CMD [ "npm", "run", "start:prod" ]