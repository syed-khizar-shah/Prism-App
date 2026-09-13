// const mongoose = require('mongoose')
// require('dotenv').config()
// const dbConnect = () => {
//   mongoose
//     .connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => {
//       console.log('Connected to MongoDB')
//     })
//     .catch((error) => {
//       console.error('MongoDB connection error:', error)
//     })
// }

// module.exports = dbConnect


const mongoose = require('mongoose')
require('dotenv').config()

let isConnected = false // track connection state across invocations

const dbConnect = async () => {
  if (isConnected) {
    return
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL, {
      // useNewUrlParser/useUnifiedTopology are no-ops in modern mongoose, safe to remove
      bufferCommands: false, // fail fast instead of buffering for 10s
    })
    isConnected = db.connections[0].readyState === 1
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

module.exports = dbConnect