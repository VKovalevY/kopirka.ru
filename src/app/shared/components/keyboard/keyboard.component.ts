import {Component, Input, Output, EventEmitter, ElementRef, Renderer2, OnInit, AfterViewInit} from "@angular/core";
import {KeyboardLayout} from "../../interfaces/keyboard-layout";
import {KeyboardKey} from "../../interfaces/keyboard-key";

@Component({
  selector: 'app-shared-keyboard',
  templateUrl: './keyboard.component.html'
})
export class KeyboardComponent implements OnInit {
  keyboardType: 'type' | 'numeric';
  //@ts-ignore()
  public rows: KeyboardKey[][];
  @Output() public keyUp = new EventEmitter<string>();
  @Output() public valueChange = new EventEmitter<string[]>();
  @Input() public extraKeys: string[] = [];
  @Input() public fontName: string = 'Ubuntu';
  @Input() public fontSize: string = '24px';
  @Input() inputKeys: string[] = [];
  @Input() placeholder: string = '';
  @Input() password: boolean = false;
  @Input() confirmTitle: string = "Применить";
  private isCaps = false;
  private isShift = false;
  private capsSvg = '<i style="font-size: 24px" class="mdi mdi-apple-keyboard-caps"></i>'
  private shiftSvg = '<i style="font-size: 24px" class="mdi mdi-apple-keyboard-shift"></i>'
  private earth = '<i style="font-size: 24px; margin: 0; padding: 0" class="mdi mdi-earth button-control-bottom"></i>';
  private currentLanguage = 'english';
  private lastRowNumeric: KeyboardKey[] = [
    <KeyboardKey> { key: 'numeric_switch', classes: 'button-control', innerHtml: this.getLetterKey('123', this.fontName, this.fontSize) },
    <KeyboardKey> { key: 'space', classes: 'button-space', innerHtml: '' },
    <KeyboardKey> { key: 'layout_switch', classes: 'button-control', innerHtml: this.earth }
  ];
  private lastRowCharacter: KeyboardKey[] =  [
    <KeyboardKey> { key: 'character_switch', classes: 'button-control-bottom', innerHtml: this.getLetterKey('ABC', this.fontName, this.fontSize) },
    <KeyboardKey> { key: 'space', classes: 'button-space', innerHtml: '<space></space>' },
    <KeyboardKey> { key: 'layout_switch', classes: 'button-control-bottom', innerHtml: this.earth }
  ];
  layouts: KeyboardLayout = {
    selectable: ['english', 'russian'],
    english: {
      layoutData: [
        [
          <KeyboardKey> { key: 'q', classes: 'button_key', innerHtml: this.getLetterKey('q', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'w', classes: 'button_key', innerHtml: this.getLetterKey('w', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'e', classes: 'button_key', innerHtml: this.getLetterKey('e', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'r', classes: 'button_key', innerHtml: this.getLetterKey('r', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 't', classes: 'button_key', innerHtml: this.getLetterKey('t', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'y', classes: 'button_key', innerHtml: this.getLetterKey('y', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'u', classes: 'button_key', innerHtml: this.getLetterKey('u', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'i', classes: 'button_key', innerHtml: this.getLetterKey('i', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'o', classes: 'button_key', innerHtml: this.getLetterKey('o', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'p', classes: 'button_key', innerHtml: this.getLetterKey('p', this.fontName, this.fontSize) }
        ],
        [
          <KeyboardKey> { key: 'caps', classes: 'button-control caps', innerHtml: this.capsSvg },
          <KeyboardKey> { key: 'a', classes: 'button_key', innerHtml: this.getLetterKey('a', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 's', classes: 'button_key', innerHtml: this.getLetterKey('s', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'd', classes: 'button_key', innerHtml: this.getLetterKey('d', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'f', classes: 'button_key', innerHtml: this.getLetterKey('f', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'g', classes: 'button_key', innerHtml: this.getLetterKey('g', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'h', classes: 'button_key', innerHtml: this.getLetterKey('h', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'j', classes: 'button_key', innerHtml: this.getLetterKey('j', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'k', classes: 'button_key', innerHtml: this.getLetterKey('k', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'l', classes: 'button_key', innerHtml: this.getLetterKey('l', this.fontName, this.fontSize) }
        ],
        [
          <KeyboardKey> { key: 'shift', classes: 'button-control shift', innerHtml: this.shiftSvg },
          <KeyboardKey> { key: 'z', classes: 'button_key', innerHtml: this.getLetterKey('z', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'x', classes: 'button_key', innerHtml: this.getLetterKey('x', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'c', classes: 'button_key', innerHtml: this.getLetterKey('c', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'v', classes: 'button_key', innerHtml: this.getLetterKey('v', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'b', classes: 'button_key', innerHtml: this.getLetterKey('b', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'n', classes: 'button_key', innerHtml: this.getLetterKey('n', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'm', classes: 'button_key', innerHtml: this.getLetterKey('m', this.fontName, this.fontSize) }
        ],
        this.lastRowNumeric
      ]
    },
    russian: {
      layoutData: [
        [
          <KeyboardKey> { key: 'й', classes: 'button_key', innerHtml: this.getLetterKey('й', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'ц', classes: 'button_key', innerHtml: this.getLetterKey('ц', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'у', classes: 'button_key', innerHtml: this.getLetterKey('у', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'к', classes: 'button_key', innerHtml: this.getLetterKey('к', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'е', classes: 'button_key', innerHtml: this.getLetterKey('е', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'н', classes: 'button_key', innerHtml: this.getLetterKey('н', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'г', classes: 'button_key', innerHtml: this.getLetterKey('г', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'ш', classes: 'button_key', innerHtml: this.getLetterKey('ш', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'щ', classes: 'button_key', innerHtml: this.getLetterKey('щ', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'з', classes: 'button_key', innerHtml: this.getLetterKey('з', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'х', classes: 'button_key', innerHtml: this.getLetterKey('х', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'ъ', classes: 'button_key', innerHtml: this.getLetterKey('ъ', this.fontName, this.fontSize) },
        ],
        [
          <KeyboardKey> { key: 'caps', classes: 'button-control caps', innerHtml: this.capsSvg },
          <KeyboardKey> { key: 'ф', classes: 'button_key', innerHtml: this.getLetterKey('ф', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'ы', classes: 'button_key', innerHtml: this.getLetterKey('ы', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'в', classes: 'button_key', innerHtml: this.getLetterKey('в', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'а', classes: 'button_key', innerHtml: this.getLetterKey('а', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'п', classes: 'button_key', innerHtml: this.getLetterKey('п', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'р', classes: 'button_key', innerHtml: this.getLetterKey('р', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'о', classes: 'button_key', innerHtml: this.getLetterKey('о', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'л', classes: 'button_key', innerHtml: this.getLetterKey('л', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'д', classes: 'button_key', innerHtml: this.getLetterKey('д', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'ж', classes: 'button_key', innerHtml: this.getLetterKey('ж', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'э', classes: 'button_key', innerHtml: this.getLetterKey('э', this.fontName, this.fontSize) }
        ],
        [
          <KeyboardKey> { key: 'shift', classes: 'button-control shift', innerHtml: this.shiftSvg },
          <KeyboardKey> { key: 'я', classes: 'button_key', innerHtml: this.getLetterKey('я', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'ч', classes: 'button_key', innerHtml: this.getLetterKey('ч', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'с', classes: 'button_key', innerHtml: this.getLetterKey('с', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'м', classes: 'button_key', innerHtml: this.getLetterKey('м', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'и', classes: 'button_key', innerHtml: this.getLetterKey('и', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'т', classes: 'button_key', innerHtml: this.getLetterKey('т', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'ь', classes: 'button_key', innerHtml: this.getLetterKey('ь', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'б', classes: 'button_key', innerHtml: this.getLetterKey('б', this.fontName, this.fontSize) },
          <KeyboardKey> { key: 'ю', classes: 'button_key', innerHtml: this.getLetterKey('ю', this.fontName, this.fontSize) }
        ],
        this.lastRowNumeric
      ],
    },
    numeric: {
      layoutData: [
        [
          <KeyboardKey> { key: '1', classes: 'button_key', innerHtml: this.getLetterKey('1', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '2', classes: 'button_key', innerHtml: this.getLetterKey('2', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '3', classes: 'button_key', innerHtml: this.getLetterKey('3', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '4', classes: 'button_key', innerHtml: this.getLetterKey('4', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '5', classes: 'button_key', innerHtml: this.getLetterKey('5', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '6', classes: 'button_key', innerHtml: this.getLetterKey('6', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '7', classes: 'button_key', innerHtml: this.getLetterKey('7', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '8', classes: 'button_key', innerHtml: this.getLetterKey('8', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '9', classes: 'button_key', innerHtml: this.getLetterKey('9', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '0', classes: 'button_key', innerHtml: this.getLetterKey('0', this.fontName, this.fontSize) },
        ],
        [
          <KeyboardKey> { key: '-', classes: 'button_key', innerHtml: this.getLetterKey('-', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '/', classes: 'button_key', innerHtml: this.getLetterKey('/', this.fontName, this.fontSize) },
          <KeyboardKey> { key: ':', classes: 'button_key', innerHtml: this.getLetterKey(':', this.fontName, this.fontSize) },
          <KeyboardKey> { key: ';', classes: 'button_key', innerHtml: this.getLetterKey(';', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '(', classes: 'button_key', innerHtml: this.getLetterKey('(', this.fontName, this.fontSize) },
          <KeyboardKey> { key: ')', classes: 'button_key', innerHtml: this.getLetterKey(')', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '$', classes: 'button_key', innerHtml: this.getLetterKey('$', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '&', classes: 'button_key', innerHtml: this.getLetterKey('&', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '@', classes: 'button_key', innerHtml: this.getLetterKey('@', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '\\', classes: 'button_key', innerHtml: this.getLetterKey('\\', this.fontName, this.fontSize) }
        ],
        [
          <KeyboardKey> { key: 'symbol_switch', classes: 'button-control', innerHtml: this.getLetterKey('#+=', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '.', classes: 'button-control', innerHtml: this.getLetterKey('.', this.fontName, this.fontSize) },
          <KeyboardKey> { key: ',', classes: 'button-control', innerHtml: this.getLetterKey(',', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '?', classes: 'button-control', innerHtml: this.getLetterKey('?', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '!', classes: 'button-control', innerHtml: this.getLetterKey('!', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '\'', classes: 'button-control', innerHtml: this.getLetterKey('\'', this.fontName, this.fontSize) },
        ],
        this.lastRowCharacter
      ]
    },
    symbolic: {
      layoutData: [
        [
          <KeyboardKey> { key: '[', classes: 'button_key', innerHtml: this.getLetterKey('[', this.fontName, this.fontSize) },
          <KeyboardKey> { key: ']', classes: 'button_key', innerHtml: this.getLetterKey(']', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '{', classes: 'button_key', innerHtml: this.getLetterKey('}', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '}', classes: 'button_key', innerHtml: this.getLetterKey('}', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '#', classes: 'button_key', innerHtml: this.getLetterKey('#', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '%', classes: 'button_key', innerHtml: this.getLetterKey('%', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '^', classes: 'button_key', innerHtml: this.getLetterKey('^', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '*', classes: 'button_key', innerHtml: this.getLetterKey('*', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '+', classes: 'button_key', innerHtml: this.getLetterKey('+', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '=', classes: 'button_key', innerHtml: this.getLetterKey('=', this.fontName, this.fontSize) },
        ],
        [
          <KeyboardKey> { key: '_', classes: 'button-control', innerHtml: this.getLetterKey('_', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '\\', classes: 'button-control', innerHtml: this.getLetterKey('\\', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '|', classes: 'button-control', innerHtml: this.getLetterKey('|', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '~', classes: 'button-control', innerHtml: this.getLetterKey('~', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '<', classes: 'button-control', innerHtml: this.getLetterKey('<', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '>', classes: 'button-control', innerHtml: this.getLetterKey('>', this.fontName, this.fontSize) },
        ],
        [
          <KeyboardKey> { key: 'numeric_switch', classes: 'button-control', innerHtml: this.getLetterKey('123', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '.', classes: 'button-control', innerHtml: this.getLetterKey('.', this.fontName, this.fontSize) },
          <KeyboardKey> { key: ',', classes: 'button-control', innerHtml: this.getLetterKey(',', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '?', classes: 'button-control', innerHtml: this.getLetterKey('?', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '!', classes: 'button-control', innerHtml: this.getLetterKey('!', this.fontName, this.fontSize) },
          <KeyboardKey> { key: '\'', classes: 'button-control', innerHtml: this.getLetterKey('\'', this.fontName, this.fontSize) },
        ],
        this.lastRowCharacter
      ]
    }
  };
  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.keyboardType = 'type';
  }

  ngOnInit(): void {
    this.rows = this.layouts.english.layoutData;
  }
  get value(): string {
    if (this.inputKeys != null && this.inputKeys.length > 0)
      return this.inputKeys.join('');
    else
      return '';
  }
  getLetterKey(letter: string, fontName: string, fontSize: string): string {
    return `<span style="font-size:${fontSize};font-family:${fontName};margin: 0 auto;">${letter}</span>`;
  }
  keyHandler(key: string): void {
    switch (key) {
      case 'caps': {
        this.caps();
        break;
      }
      case 'shift': {
        this.shift();
        break;
      }
      case 'layout_switch': {
        this.isShift = false;
        this.isCaps = false;
        this.changeLanguage();
        break;
      }
      case 'numeric_switch': {
        this.isShift = false;
        this.isCaps = false;
        this.rows = this.layouts.numeric.layoutData;
        break;
      }
      case 'character_switch': {
        this.isShift = false;
        this.isCaps = false;
        this.characterSwitch();
        break;
      }
      case 'symbol_switch': {
        this.isShift = false;
        this.isCaps = false;
        this.rows = this.layouts.symbolic.layoutData;
        break;
      }
      case 'space': {
        this.inputKeys.push(' ');
        this.keyUp.emit(' ');
        break;
      }
      default: {
        this.inputKeys.push(key);
        this.keyUp.emit(this.valueHandler(key));
        if (this.isShift) {
          this.isShift = false;
          this.clearShift();
        }
      }
    }
  }
  private changeLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'english' ? 'russian' : 'english';
    //@ts-ignore()
    this.rows = this.layouts[this.currentLanguage].layoutData;
  }
  private characterSwitch(): void {
    //@ts-ignore()
    this.rows = this.layouts[this.currentLanguage].layoutData;
  }
  private caps(): void {
    if (this.isShift) {
      this.isShift = false;
      this.isCaps = true;
      this.changeCapsShift();
    }
    else {
      this.isCaps = !this.isCaps;
      if (this.isCaps) {
        this.setCaps();
      } else {
        this.clearCaps();
      }
    }
  }
  private setCaps(): void {
    const capsButton = this.element.nativeElement.querySelectorAll('.caps');
    if (capsButton != null) {
      for (const el of capsButton) {
        this.renderer.addClass(el, 'active');
      }
    }
    const buttonKeys = this.element.nativeElement.querySelectorAll('.button_key, .ribbon_button');
    if (buttonKeys != null) {
      for (const el of buttonKeys) {
        this.renderer.setStyle(el, 'text-transform', 'uppercase');
      }
    }
  }
  clearCaps(): void {
    const capsButton = this.element.nativeElement.querySelectorAll('.caps');
    if (capsButton != null) {
      for (const el of capsButton) {
        this.renderer.removeClass(el, 'active');
      }
    }
    const buttonKeys = this.element.nativeElement.querySelectorAll('.button_key, .ribbon_button');
    if (buttonKeys != null) {
      for (const el of buttonKeys) {
        this.renderer.removeStyle(el, 'text-transform');
      }
    }
  }
  shift(): void {
    if (this.isCaps) {
      this.isCaps = false;
      this.isShift = false;
      this.clearCaps();
    }
    else {
      this.isShift = !this.isShift;
      if (this.isShift) {
        this.setShift();
      } else {
        this.clearShift();
      }
    }
  }
  setShift(): void {
    const shiftButtons = this.element.nativeElement.querySelectorAll('.shift');
    const buttonKeys = this.element.nativeElement.querySelectorAll('.button_key, .ribbon_button');
    if (buttonKeys != null) {
      for (const el of buttonKeys) {
        this.renderer.setStyle(el, 'text-transform', 'uppercase');
      }
    }
    if (shiftButtons != null) {
      for (const el of shiftButtons) {
        this.renderer.addClass(el, 'active');
      }
    }
  }
  clearShift(): void {
    const shiftButtons = this.element.nativeElement.querySelectorAll('.shift');
    const buttonKeys = this.element.nativeElement.querySelectorAll('.button_key, .ribbon_button');
    if (buttonKeys != null) {
      for (const el of buttonKeys) {
        this.renderer.removeStyle(el, 'text-transform');
      }
    }
    for (const el of shiftButtons) {
      this.renderer.removeClass(el, 'active');
    }
  }
  changeCapsShift(): void {
    const shiftButtons = this.element.nativeElement.querySelectorAll('.shift');
    for (const el of shiftButtons) {
      this.renderer.removeClass(el, 'active');
    }
    const capsButton = this.element.nativeElement.querySelectorAll('.caps');
    for (const el of capsButton) {
      this.renderer.addClass(el, 'active');
    }
  }
  valueHandler(key: string): string {
    return this.isCaps || this.isShift ? key.toUpperCase() : key;
  }
  backSpace() {
    if (this.inputKeys.length > 0)
      this.inputKeys.pop();
  }
  confirm() {
    this.valueChange.emit(this.inputKeys)
  }
}
