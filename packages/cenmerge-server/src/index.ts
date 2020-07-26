import {Context} from 'cenmerge-context'
import * as http from 'http'
import * as WebSocket from 'ws'

const server = http.createServer()
const wss = new WebSocket.Server({server})

const context = new Context()

wss.on('connection', (ws, req) => {
    if (req.url === '/automerge') {
        context.connect(ws, req)
    }
    else {
        ws.send('Invalid route')
        ws.close()
    }
})

const PORT = 3000
server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})
