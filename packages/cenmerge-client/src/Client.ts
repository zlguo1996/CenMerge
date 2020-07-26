import * as AutoMerge from 'automerge'
import {ClientMessage, ServerMessage, encodeMessage, decodeMessage} from 'cenmerge-message'

export class Client {
    private docSet = new AutoMerge.DocSet<any>()
    private connection: AutoMerge.Connection<any>

    constructor(socket: WebSocket) {
        this.connection = new AutoMerge.Connection<any>(this.docSet, (msg) => {
            socket.send(encodeMessage<ClientMessage>({
                type: 'automerge',
                msg: msg
            }))
        })

        this.handleMessage = this.handleMessage.bind(this)
        socket.addEventListener('message', (ev) => {
            try {
                console.assert(typeof ev.data === 'string')
                const frame = decodeMessage<ServerMessage>(ev.data)
                console.assert(typeof frame === 'object' && frame !== null)
                this.handleMessage(frame)
            }
            catch (e) {
                throw e
            }
        })
    }

    register(id: string, doc: AutoMerge.Doc<any>) {
        console.assert(this.docSet.getDoc(id) === undefined)
        this.docSet.setDoc(id, doc)
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
