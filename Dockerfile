# Stage 1: Build the application
FROM oven/bun as builder

WORKDIR /app

# Copy the entire project into the image
COPY . .

# Install dependencies and build the application
RUN bun install && bun run build

# Stage 2: Create the production image
FROM oven/bun

WORKDIR /app

# Copy only the built artifacts and necessary files from the builder stage
COPY --from=builder /app /app

# Set the NODE_ENV to production
ENV PORT 3000
ENV NODE_ENV production

# Define the command to start your application
CMD ["bun", "run", "serve"]

# below is test on getting  docker image to be minimal as possible
# FROM oven/bun as builder

# WORKDIR /app

# # Copy the entire project into the image
# COPY . .

# # Install all dependencies
# RUN bun install

# # Build the application
# RUN bun run build

# # Stage 2: Create an intermediate image for production dependencies
# FROM oven/bun as production_dependencies

# WORKDIR /app

# # Copy only the `package.json` and `package-lock.json`
# COPY package.json bun.lockb ./

# # Install only production dependencies
# RUN bun install --production

# # Stage 3: Create the production image
# FROM oven/bun

# WORKDIR /app

# COPY preload.ts bunfig.toml ./
# COPY assets ./
# COPY plugins/html.ts ./plugins/html.ts

# # Copy only the built artifacts and necessary files from the builder stage
# COPY --from=builder /app/build /app/build

# # Copy only production dependencies from the intermediate stage
# COPY --from=production_dependencies /app/node_modules /app/node_modules

# # Set the NODE_ENV to production
# ENV PORT 3000
# ENV NODE_ENV production

# # Define the command to start your application
# CMD ["bun", "build/index.js"]