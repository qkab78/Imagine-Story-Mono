/*
|--------------------------------------------------------------------------
| HTTP server entrypoint
|--------------------------------------------------------------------------
|
| The "server.ts" file is the entrypoint for starting the AdonisJS HTTP
| server. Either you can run this file directly or use the "serve"
| command to run this file and monitor file changes
|
*/

import 'reflect-metadata'
import { Ignitor, prettyPrintError } from '@adonisjs/core'

/**
 * URL to the application root. AdonisJS need it to resolve
 * paths to file and directories for scaffolding commands
 */
const APP_ROOT = new URL('../', import.meta.url)

/**
 * The importer is used to import files in context of the
 * application.
 */
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    app.booting(async () => {
      await import('#start/env')
    })
    app.listen('SIGTERM', () => {
      console.log('[Server] Received SIGTERM, shutting down gracefully')
      app.terminate()
    })
    app.listenIf(app.managedByPm2, 'SIGINT', () => {
      console.log('[Server] Received SIGINT, shutting down gracefully')
      app.terminate()
    })
  })
  .httpServer()
  .start()
  .then(() => {
    console.log('[Server] HTTP server started successfully')
  })
  .catch((error) => {
    console.error('[Server] Failed to start HTTP server:', error)
    console.error('[Server] Error stack:', error.stack)
    process.exitCode = 1
    prettyPrintError(error)
    process.exit(1)
  })

// Gérer les erreurs non catchées
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught Exception:', error)
  process.exit(1)
})
