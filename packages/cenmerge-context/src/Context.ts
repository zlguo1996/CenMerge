import * as AutoMerge from 'automerge'
import {Document} from './Document'
import {Connection} from './Connection'
import WebSocket from 'ws'

export class Context {
    private docs = new Map<string, Document<any>>()
    private connections = new Set<Connection>()

    constructor() {
        this.docChange = this.docChange.bind(this)
    }

    connect(socket: WebSocket, request: Request) {
        const connection = new Connection(socket, this.docChange)
        this.connections.add(connection)
        socket.on('close', () => {
            connection.docSet.docIds.forEach((id) => {
                this.docs.get(id)?.unregister(connection.docSet)
            })
            this.connections.delete(connection)
        })
    }

    docChange(docId: string, doc: AutoMerge.Doc<any>, from: AutoMerge.DocSet<any>) {
        let document = this.docs.get(docId)
        if (document === undefined) {
            document = new Document(docId, doc)
            this.docs.set(docId, document)
        }
        document.set(doc, from)
    }
}
