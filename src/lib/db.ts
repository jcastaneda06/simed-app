import mongoose from 'mongoose'
import dns from 'dns'

declare global {
  var mongoose: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  }
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}
export async function connectToDatabase() {
  dns.setServers(['8.8.8.8'])
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI // MongoDB connection string
    if (!uri) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      )
    }

    cached.promise = mongoose
      .connect(uri)
      .then((mongoose) => mongoose.connection)

    console.log('Connected to MongoDB')
  }

  cached.conn = await cached.promise
  return cached.conn
}
