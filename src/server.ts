import { app } from './app'
import { env } from './env'

// Run the server!
const start = async (): Promise<void> => {
  try {
    await app.listen({
      host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost',
      port: env.PORT
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

void start()
