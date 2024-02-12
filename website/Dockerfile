# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.10.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Copy package.json and package-lock.json for installing production dependencies
COPY package*.json ./

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps as build

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application using serve.
FROM node:${NODE_VERSION}-alpine as final

# Set working directory for the serve command
WORKDIR /usr/src/app

# Install serve globally
RUN npm install -g serve

# Copy the built application from the build stage
COPY --from=build /usr/src/app/build ./build

# Expose the port that the serve command listens on (default 3000, can be changed with the -l flag)
EXPOSE 3000

# Run the serve command to serve the built application
CMD ["serve", "-s", "build", "-l", "3000"]
