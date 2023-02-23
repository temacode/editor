import { SelectionService } from './services/selection.service';
import { BehaviorSubject } from 'rxjs';
import { Component, ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { CaretService } from '../caret.service';

interface BlockData {
  id: number,
  elem: Element,
  parentElem: Element
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  title = 'blog';

  @ViewChild('editor')
  editor: ElementRef | null = null;

  private readonly blocksCount = new BehaviorSubject(1);
  public readonly focusedBlockId = new BehaviorSubject<number | null>(null);

  private blocksIds: number[] = [1];

  constructor(
    private readonly r2: Renderer2,
    private readonly caretService: CaretService,
    private readonly selectionService: SelectionService
  ) { }

  ngAfterViewInit(): void {
    if (this.editor) {
      this.caretService.anchorNode = this.editor.nativeElement;
      this.editor.nativeElement.addEventListener('keydown', this.input.bind(this));
    }
  }

  click(): void {
    this.updateFocusedBlockId();
  }

  select() {
    const block = document.querySelectorAll("[data-block-id='1']")[0];

    this.selectionService.pasteBreak(block);
    this.selectionService.pasteText(block, "How are you?");
  }

  private updateFocusedBlockId(): void {
    setTimeout(() => {
      if (this.caretService.focusedBlock) {
        const id = this.caretService.focusedBlock.getAttribute('data-block-id');
        if (id && !isNaN(Number(id))) {
          this.focusedBlockId.next(Number(id));
        }
      }
    }, 0);
  }

  input(e: KeyboardEvent) {
    this.preventStandartBehaviour(e);

    if (e.code === 'Enter') {
      this.enterHandler(e);
    }

    if (e.code === 'Backspace') {
      this.backspaceHandler();
    }

    this.updateFocusedBlockId();
  }

  private getFocusedBlock(): BlockData {
    const block = this.caretService.focusedBlock;

    if (!block) {
      throw new Error('Блок не существует');
    }

    const blockId = block.getAttribute('data-block-id');

    if (!blockId) {
      throw new Error('Не удалось получить ID блока');
    }

    if (!block.parentElement) {
      throw new Error('Элемент не принадлежит дереву редактора');
    }

    return {
      id: +blockId,
      elem: block,
      parentElem: block.parentElement,
    }
  }

  private preventStandartBehaviour(e: KeyboardEvent): void {
    switch (e.code) {

      case 'Backspace':
      case 'Enter': {
        e.preventDefault();

        break;
      }
    }

    return;
  }

  private increaseBlocksCount(): void {
    this.blocksCount.next(this.blocksCount.getValue() + 1);
  }

  private enterHandler(e: KeyboardEvent) {
    if (e.shiftKey) {
      this.selectionService.pasteBreak(this.getFocusedBlock().elem);

      return;
    }

    this.increaseBlocksCount();

    const block: Element = this.r2.createElement('span');

    this.r2.setAttribute(block, 'class', 'block');
    this.r2.setAttribute(block, 'data-block-id', `${this.blocksCount.getValue()}`);

    this.r2.appendChild(this.editor?.nativeElement, block);
    this.blocksIds.push(this.blocksCount.getValue());

    this.selectionService.moveCaretToEnd(block);
  }

  private backspaceHandler(): void {
    const blockData = this.getFocusedBlock();

    if (blockData.elem.innerHTML.length > 0 && blockData.elem.innerHTML !== "\n") {
      console.log('Backspace');

      this.selectionService.backspace(blockData.elem);
    } else {
      console.log('Delete block');
      this.deleteBlock(blockData);
    }
  }

  private deleteBlock(blockData: BlockData): void {
    if (blockData.id === 1) {
      console.warn('Элемент не может быть удален');

      return;
    }

    const blockIndex = this.blocksIds.indexOf(blockData.id);

    if (blockIndex === -1) {
      throw new Error('Индекс элемента не найден');
    }

    if (this.chechIfBlockCanBeDeleted(blockData.elem)) {
      blockData.parentElem.removeChild(blockData.elem);
      this.blocksIds.splice(blockIndex, 1);
      this.selectionService.focusOnBlockById(this.blocksIds[blockIndex - 1]);

      return;
    }
  }

  private chechIfBlockCanBeDeleted(block: Element): boolean {
    if (block.innerHTML.length === 0) {
      return true;
    }

    if (block.innerHTML === "\n") {
      return true;
    }

    return false;
  }
}
