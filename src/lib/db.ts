import mongoose from 'mongoose'

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
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const uri = process.env.INTERCONSULTAS_CONNTECTIONSTRING // MongoDB connection string
    if (!uri) {
      throw new Error(
        'Please define the INTERCONSULTAS_CONNTECTIONSTRING environment variable inside .env.local'
      )
    }

    cached.promise = mongoose
      .connect(uri, {
        connectTimeoutMS: 30000, // Tiempo de espera de conexión
        socketTimeoutMS: 45000, // Tiempo de espera para operaciones
      })
      .then((mongoose) => mongoose.connection)

    console.log('Connected to MongoDB')
  }

  cached.conn = await cached.promise
  return cached.conn
}
