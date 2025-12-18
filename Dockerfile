FROM node:20-slim

# Install OpenSSL 1.1 and 3.0 (Debian handles these more gracefully)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy all source code
COPY . .

EXPOSE 3000

# Start using the script from package.json
CMD ["npm", "start"]