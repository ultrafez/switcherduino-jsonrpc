FROM node:6-slim
MAINTAINER Alex Silcock (@ultrafez)

HEALTHCHECK CMD curl -f http://localhost/health || exit 1

# Create a new user account so we're not running as root
# dialout group is required to use serial devices mounted at runtime
RUN groupadd -r app && useradd -r -g app -G dialout app

# Create app dirs and ensure they're owned by non-root user
RUN mkdir -p /usr/src/app && chown app: /usr/src/app
WORKDIR /usr/src/app

# npm writes a .npm directory into your home dir; /home/app doesn't exist though
ENV HOME=/tmp

USER app
EXPOSE 80

# Install deps
COPY package.json /usr/src/app/
RUN npm install \
 && npm cache clean

# Copy source
COPY src /usr/src/app/src
COPY test /usr/src/app/test

# Run
ENV NODE_ENV=production
CMD ["node", "src/main.js"]
