module.exports = {
  uris: process.env.MONGO_URL,
  options: {
    useNewUrlParser: true,
    useFindAndModify: true,
  },
};
