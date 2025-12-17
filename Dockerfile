# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Note: We copy node_modules from host instead of running npm install
# due to network certificate issues in some build environments.
# Users should run 'npm install' locally before building the Docker image.
COPY . .

# Build the application 
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Note: We copy node_modules from host instead of running npm install
# due to network certificate issues in some build environments.
# Users should run 'npm install' locally before building the Docker image.
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
