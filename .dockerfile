# Stage 1: Build the application
FROM oven/bun as builder

WORKDIR /app

# Copy the entire project into the image
COPY . .

# Install dependencies and build the application
RUN bun install && bun run build

# Stage 2: Create the production image
FROM oven/bun

WORKDIR /

# Copy the built application from the builder stage
COPY --from=builder /app/build /

# Set the NODE_ENV to production
ENV PORT 3000
ENV NODE_ENV production

# Expose the port your application listens on (assuming 3000)
EXPOSE 3000

# Define the command to start your application
CMD ["bun", "./dev.js"] 
