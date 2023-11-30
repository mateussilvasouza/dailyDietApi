import { app } from './app'

// Run the server!
const port = 8000
const start = async (): Promise<void> => {
  try {
    await app.listen({ port })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

void start()
