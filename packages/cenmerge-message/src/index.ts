import * as AutoMerge from 'automerge'

interface BaseMessage {
    type: string
}

interface AutoMergeMessage extends BaseMessage {
    type: 'automerge'
    msg: AutoMerge.Message
}

export type ClientMessage = AutoMergeMessage

export type ServerMessage = AutoMergeMessage

export function encodeMessage<T extends ClientMessage | ServerMessage>(msg: T): string {
    return JSON.stringify(msg)
}

export function decodeMessage<T extends ClientMessage | ServerMessage>(data: string): T {
    return JSON.parse(data)
}
