const mangoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/user';

const connectDB = async () => {
  await mangoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB Connected...');
}

module.exports = connectDB;