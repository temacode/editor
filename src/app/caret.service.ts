import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CaretService {
    get anchorNode(): Node {
        if (this._anchorNode) {
            return this._anchorNode;
        }

        throw new Error('Базовый элемент не существует');
    };

    set anchorNode(node: Node) {
        this._anchorNode = node;
    }

    private _anchorNode: Node | null = null;

    get position() {
        const selection = window.getSelection();
        const range = selection!.getRangeAt(0);

        if (!this.anchorNode.contains(range.endContainer)) return -1;

        var position = range.endOffset;
        var currentNode = range.endContainer;

        while (currentNode !== this.anchorNode) {
            const parentNode = currentNode.parentNode;

            for (let i = 0; i < parentNode!.childNodes.length; i++) {
                if (parentNode!.childNodes[i] === currentNode) break;
                position += parentNode!.childNodes[i].textContent!.length;
            }

            currentNode = parentNode!;
        }

        return position;
    }

    get focusedBlock(): Element | null {
        return this.getCaretParentNode();
    }

    set position(position) {
        var currentNode = this.anchorNode;
        var offset = 0;

        var childNodes = Array.from(currentNode.childNodes);
        while (offset < position && childNodes.length) {
            const node = childNodes.shift();
            const textLength = node!.textContent!.length;
            if ((offset + textLength) >= position) {
                currentNode = node!;
                childNodes = Array.from(currentNode.childNodes);
                continue;
            }
            offset += textLength;
        }

        position = Math.min(offset + currentNode.textContent!.length, position);
        window.getSelection()!.collapse(currentNode, position - offset);
    }

    private getCaretParentNode(): Element | null {
        var target = null;

        if (window.getSelection) {
            target = window.getSelection()!.getRangeAt(0).commonAncestorContainer;

            return ((target.nodeType === 1) ? target : target.parentNode) as HTMLElement;
        }

        //@ts-ignore
        if (document.selection) {
            //@ts-ignore
            var target = document.selection.createRange().parentElement();
        }

        return target;
    }
}