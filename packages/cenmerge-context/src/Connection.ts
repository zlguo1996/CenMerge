import * as AutoMerge from 'automerge'
import WebSocket from 'ws'
import {ClientMessage, ServerMessage, encodeMessage, decodeMessage} from 'cenmerge-message'

export class Connection {
    private socket: WebSocket
    public docSet: AutoMerge.DocSet<any> = new AutoMerge.DocSet
    private connection: AutoMerge.Connection<any>

    constructor(
        socket: WebSocket,
        onChange: (docId: string, doc: AutoMerge.Doc<any>, docSet: AutoMerge.DocSet<any>) => void) {
        this.socket = socket

        this.docSet.registerHandler((docId, doc) => onChange(docId, doc, this.docSet))
        this.connection = new AutoMerge.Connection(this.docSet, (msg) => {
            this.socket.send(
                encodeMessage<ServerMessage>({
                    type: 'automerge',
                    msg: msg
                })
            )
        })

        this.handleMessage = this.handleMessage.bind(this)
        this.socket.on('message', (message: string) => {
            try {
                const frame = decodeMessage<ClientMessage>(message)
                console.assert(typeof frame === 'object' && frame !== null)
                this.handleMessage(frame as ClientMessage)
            }
            catch (e) {
                throw e
            }
        })
    }

    handleMessage(frame: ClientMessage) {
        if (frame.type === 'automerge') {
            this.connection.receiveMsg(frame.msg)
        }
        else {
            console.error(`Unrecognized frame type: ${frame.type}`)
        }
    }
}
