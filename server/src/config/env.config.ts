export default () => ({
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 4001,
  database: {
    uri:
      process.env.DB_URI ||
      'mongodb://localhost:27017/tutr-local-service',
  },
  redis: {
    url: process.env.REDIS_URI || 'redis://localhost:6379',
    nodes: process.env.REDIS_NODES ? [process.env.REDIS_NODES] : null,
  },
  socket: {
    url: process.env.SOCKET_URL,
  },
});
