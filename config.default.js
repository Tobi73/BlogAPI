module.exports = {
  database: {
    dev: 'mongodb://localhost:27017/blog',
    test: 'mongodb://localhost:27017/test-blog',
    production: 'mongodb://localhost:27017/blog',
  },
  secret: 'secret-key',
  adminCreds: {
    username: process.env.BLOG_ADMIN_USERNAME || 'admin',
    password: process.BLOG_ADMIN_PASS || 'admin',
  },
};
