export default () => ({
  port: parseInt(`${process.env.PORT}`, 10) || 8086,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(`${process.env.DATABASE_PORT}`, 10) || 5432,
    url: process.env.MONGO_URL,
  },
  jwtSecret: process.env.JWT_SECRET,
  cloudinary: {
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  mail: {
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },
});
