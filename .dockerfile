# Stage 1: Build the application
FROM oven/bun 

WORKDIR /app

# Copy the entire project into the image
COPY bun.lockb .
COPY package.json .

# Install dependencies and build the application
RUN bun install

COPY . .

RUN bun run build
# Stage 2: Create the production image
# FROM oven/bun

# WORKDIR /app

# Copy the built application from the builder stage
# COPY --from=builder /build/build /app

# Set the NODE_ENV to production
ENV PORT 3000
ENV NODE_ENV production

# Expose the port your application listens on (assuming 3000)
EXPOSE 3000

# Define the command to start your application
CMD ["bun", "build/dev.js"] 
