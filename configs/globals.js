require("dotenv").config();

const configurations = {
  ConnectionStrings: {
    MongoDB: process.env.MONGO_URI,
  },
  Authentication: {
    Google: {
      ClientId: process.env.GOOGLE_CLIENT_ID,
      ClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      CallbackURL: process.env.GOOGLE_CALLBACK_URL
    },
  },
};

module.exports = configurations;
