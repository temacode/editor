import { Injectable } from "@angular/core";

@Injectable()
export class SelectionService {
    private range = document.createRange();
    private selection = window.getSelection();

    public selectAllText(block: Element): void {
        this.prepareSelection();

        this.range.selectNodeContents(block);

        this.updateSelection();
    }

    public selectFromTo(block: Element, start: number = 0, end: number = 0): void {
        this.prepareSelection();

        const text = block.childNodes[0];

        this.range.setStart(text, start);
        try {
            this.range.setEnd(text, end);
        } catch (e) {
            console.error('Неверный параметр end');
        }

        this.updateSelection();
    }

    public moveCaretTo(block: Element, index: number): void {
        if (isNaN(index)) {
            throw new Error('Позиция не задана');
        }
        this.prepareSelection();

        const text = block.childNodes[0];
        if (!text) {
            this.range.setStart(block, 0);
        } else {
            this.range.setStart(text, index);
        }

        this.range.collapse(true);

        this.updateSelection();
    }

    public moveCaretToStart(block: Element): void {
        this.prepareSelection();

        this.range.selectNodeContents(block);
        this.range.collapse(true);

        this.updateSelection();
    }

    public moveCaretToEnd(block: Element): void {
        this.prepareSelection();

        if (block.innerHTML && block.innerHTML.length > 0) {
            const text = block.childNodes[0];

            this.range.selectNodeContents(text);
        } else {
            this.range.setStart(block, 0);
        }

        this.range.collapse(false);

        this.updateSelection();
    }

    public pasteText(block: Element, text: string): void {
        block.innerHTML = block.innerHTML + text;

        this.moveCaretToEnd(block);
    }

    public pasteBreak(block: Element): void {
        block.innerHTML = block.innerHTML.length > 0 ? block.innerHTML + `\n` : block.innerHTML + `\n\n`;

        this.moveCaretToEnd(block);
    }

    public focusOnBlockById(blockId: number): void {
        const block = document.querySelectorAll(`[data-block-id='${blockId}']`)[0];

        this.moveCaretToEnd(block);
    }

    public backspace(block: Element) {
        const range = this.selection?.getRangeAt(0);
        if (!range) {
            throw new Error('Ошибка Range');
        }
        this.range = range;

        if (!this.selection) {
            throw new Error('Ничего не выбрано');
        }

        const start = this.range.startOffset;
        const end = this.range.endOffset
        const length = block.innerHTML.length;

        if (start === end && start === 0) {
            console.warn('Нечего удалять');

            return;
        }

        if (start == end) { //Если текст не выбран
            block.innerHTML = block.innerHTML.substring(0, start - 1) + block.innerHTML.substring(end, length);

            this.moveCaretTo(block, start - 1);
        } else {
            const textBefore = block.innerHTML.substring(0, start);    //text in front of selected text
            const textAfter = block.innerHTML.substring(end, length);    //text following selected text

            block.innerHTML = textBefore + textAfter;

            this.moveCaretTo(block, textBefore.length);
        }
    }

    private prepareSelection(): void {
        this.range = document.createRange();
        this.selection = window.getSelection();
    }

    private updateSelection(): void {
        this.selection?.removeAllRanges();
        this.selection?.addRange(this.range);
    }
}