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
  sdk100ms: {
    templateId: process.env.RTC_TEMPLATE_ID || "663a246d5afd7e4281e31430",
    managementToken: process.env.RTC_MANAGEMENT_TOKEN,
  },
});
