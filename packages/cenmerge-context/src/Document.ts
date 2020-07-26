import * as AutoMerge from 'automerge'
import { applyChanges } from 'automerge'

export class Document<T> {
    private docSets = new Set<AutoMerge.DocSet<any>>()
    private doc: AutoMerge.Doc<T>
    private id: string

    constructor(id: string, doc: AutoMerge.Doc<T>) {
        this.id = id
        this.doc = doc
    }

    set(doc: AutoMerge.Doc<T>, from: AutoMerge.DocSet<any>) {
        this.doc = doc

        if (!this.docSets.has(from)) {
            this.register(from)
        }

        this.applyChanges()
    }

    private applyChanges() {
        for (const docSet of this.docSets) {
            if (docSet.getDoc(this.id) === this.doc) {
                continue
            }

            docSet.setDoc(this.id, this.doc)
        }
    }

    private register(set: AutoMerge.DocSet<any>) {
        this.docSets.add(set)
    }

    unregister(set: AutoMerge.DocSet<any>) {
        this.docSets.delete(set)
    }
}
