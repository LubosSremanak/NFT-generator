import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
// @ts-ignore
import * as svg from 'save-svg-as-png';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements OnInit, AfterViewInit {
  @Input() id: string | undefined;
  @ViewChild('generator') generator: ElementRef | undefined;
  generatorElement: HTMLElement | undefined;
  private svg: string;
  disabled: boolean;
  colors: any;
  loaded: any;

  constructor() {
    this.svg = '';
    this.disabled = false;
    this.loaded = {glasses: false}
    this.colors = {
      'background': ['black'],
      'face': ['white',
      ],
      'eyes': ['white'],
      'glasses': ['white',],
      'eyesInner': ['white'],
      'teeth': ['white'],
      'hat': ['#563f0d', '#3f1b0a', '#330b1b', '#10071e',
      ]
    };
  }

  ngOnInit(): void {
  }

  async ngAfterViewInit(): Promise<void> {
    this.generatorElement = this.generator?.nativeElement;
  }

  async generate(): Promise<void> {

    await this.loadHead();
    await this.loadEars();
    await this.loadEyes();
    await this.loadEyebrows();
    await this.loadAccessory();
    await this.loadNose();
    return this.createSvg(1189, 1030, 'boar', this.svg);

  }

  private loadHead = async (): Promise<void> => {
    await this.load('mouth');
    await this.load('teeth');
    await this.load('head');
    return this.load('face');
  };

  private loadNose = async (): Promise<void> => {
    await this.load('tusk-color', 'tusk-color1');
    await this.load('tusk-color', 'tusk-color2');
    await this.load('tusk', 'tusk1');
    await this.load('tusk', 'tusk2');
    return this.load('nose');
  };


  private loadEyes = async (): Promise<void> => {
    const gen = this.generateNumber(1, 4);
    await this.load(`eye${gen}`, 'eye1');
    await this.load(`eye${gen}`, 'eye2');
    await this.load(`eye-inner-color${gen}`, 'eye-inner-color1');
    await this.load(`eye-inner-color${gen}`, 'eye-inner-color2');
    await this.load('eye-color', 'eye-color1');
    return this.load('eye-color', 'eye-color2');
  };

  private loadEars = async (): Promise<void> => {
    await this.load('ear-color', 'ear-color1');
    await this.load('ear-color', 'ear-color2');
    await this.load('ear', 'ear1');
    return this.load('ear', 'ear2');
  };

  private loadEyebrows = async (): Promise<void> => {
    const gen = this.generateNumber(1, 4);
    await this.load(`eyebrow${gen}`, 'eyebrow1');
    return this.load(`eyebrow${gen}`, 'eyebrow2');
  };

  private loadAccessory = async (): Promise<void> => {

    const gen1 = this.generateNumber(1, 10);
    const gen2 = this.generateNumber(1, 10);
    const gen3 = this.generateNumber(1, 10);
    const gen4 = this.generateNumber(1, 10);
    if (gen1 === 1) {
      await this.load(`tear`);
    }
    if (gen1 === 3) {
      await this.load(`cross`);
    }
    if (gen2 === 3) {
      await this.load(`ear-piercing`);
    }
    if (gen2 === 4) {
      await this.load(`airpod`, 'airpod1');
      await this.load(`airpod`, 'airpod2');
    }
    if (gen3 === 3) {
      await this.load(`glasses`);
      this.loaded.glasses = true;
    }

    if (gen4 <= 2) {
      await this.load(`bull-ring`);
    }
    await this.load(`hat`);
  };

  private load(file: string, id: string = file, path: string = `assets/images/${file}.svg`): Promise<any> {
    return new Promise(resolve => this.fetchFile(file, path, id + this.id, resolve));
  }

  private fetchFile = (file: string, path: string, id: string, resolve: any): void => {
    fetch(path)
      .then(r => r.text())
      .then(svg => {
        this.svg += this.groupId(id, svg);
        resolve(svg);
      })
      .catch(console.error.bind(console));
  };

  private createSvg = async (height: number, width: number, id: string, inner: string = ''): Promise<void> => {
    const url = 'http://www.w3.org/2000/svg';
    const svgElement = document.createElementNS(url, "svg");
    svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svgElement.setAttribute('xmlns', url);
    svgElement.setAttribute("id", `boar${this.id}`);
    const groupElement = document.createElementNS(url, "g");
    groupElement.setAttribute("id", `group${this.id}`);
    groupElement.innerHTML += inner;
    let style = await this.load('', '', 'assets/style.css');
    style = this.generateStyle(style);
    const defsElement = document.createElementNS(url, "defs");
    const styleElement = document.createElementNS(url, "style");
    styleElement.innerHTML = style;
    defsElement.appendChild(styleElement);
    svgElement.appendChild(defsElement);
    svgElement.appendChild(groupElement);
    this.generatorElement?.append(svgElement);
  };

  private generateStyle(style: string): string {
    const background = this.chooseColorAndGenerate('background');
    const face = this.chooseColorAndGenerate('face');
    const eyes = this.chooseColorAndGenerate('eyes');
    const eyesInner = this.chooseRandomColor('eyesInner');
    const tusk = this.generateColor();
    const tuskSize = this.generateNumber(80, 110);
    const teeth = this.chooseRandomColor('teeth');
    const eyeRadius = this.generateNumber(100, 250);
    const eyeBrow1Y = this.generateNumber(29, 33);
    const eyeBrow2Y = this.generateNumber(29, 33);
    const hat = this.chooseColorAndGenerate('hat');
    const hatOn = this.generateNumber(0, 8);
    const glassesColor = this.chooseRandomColor('glasses');

    const glassesEyeColor1Transform = 'translate(36%, 37%) scale(0.06, -0.06)';
    const glassesEyeColor2Transform = 'translate(64%, 37%) scale(0.06, -0.06)';
    const glassesEye1Transform = ' translate(27.5%, 32.5%) scale(0.06, 0.06)';
    const glassesEye2Transform = 'translate(72.5%, 32.5%) scale(0.06, 0.06) scaleX(-1)';

    const eyeColor1Transform = 'translate(36%, 38%) scale(0.08, -0.08)';
    const eyeColor2Transform = 'translate(64%, 38%) scale(0.08, -0.08)';
    const eye1Transform = ' translate(26%, 32.5%) scale(0.075, 0.075)';
    const eye2Transform = 'translate(74%, 32.5%) scale(0.075, 0.075) scaleX(-1)';
    if (typeof this.id === "string") {
      style = style.replace(new RegExp("--id", "g"), this.id);
    }
    style = style.replace(new RegExp("--hat-on", "g"), hatOn === 1 ? 'block' : 'none');
    style = style.replace(new RegExp("--hat-of", "g"), hatOn !== 1 ? 'block' : 'none');

    style = this.changeStyle(style, '--id', `${this.id}`);
    style = this.changeStyle(style, '--background-color', background);
    style = this.changeStyle(style, '--ears-color', face);
    style = this.changeStyle(style, '--face-color', face);
    style = this.changeStyle(style, '--eyes-color', eyes);
    style = this.changeStyle(style, '--eyes-inner-color', eyesInner);
    style = this.changeStyle(style, '--tusk-color', tusk);
    style = this.changeStyle(style, '--tusk-size1', `scale(${tuskSize / 1000},-${tuskSize / 1000})`);
    style = this.changeStyle(style, '--tusk-size2', `scale(${tuskSize / 1000},-${tuskSize / 1000})`);
    style = this.changeStyle(style, '--teeth-color', teeth);
    style = this.changeStyle(style, '--eyes-radius', `${eyeRadius}px!important`);
    style = this.changeStyle(style, '--eyebrow1Y', `${eyeBrow1Y}%`);
    style = this.changeStyle(style, '--eyebrow2Y', `${eyeBrow2Y}%`);
    style = this.changeStyle(style, '--hat-color', `${hat}`);
    style = this.changeStyle(style, ' --glasses-color', glassesColor);

    if (this.loaded.glasses) {
      style = this.changeStyle(style, '--eye-color1-transform', glassesEyeColor1Transform);
      style = this.changeStyle(style, '--eye-color2-transform', glassesEyeColor2Transform);
      style = this.changeStyle(style, '--eye1-transform', glassesEye1Transform);
      style = this.changeStyle(style, '--eye2-transform', glassesEye2Transform);
    } else {
      style = this.changeStyle(style, '--eye-color1-transform', eyeColor1Transform);
      style = this.changeStyle(style, '--eye-color2-transform', eyeColor2Transform);
      style = this.changeStyle(style, '--eye1-transform', eye1Transform);
      style = this.changeStyle(style, '--eye2-transform', eye2Transform);
    }

    for (let i = 0; i < 4; i++) {
      const goldenTeeth = this.generateNumber(1, 40);
      style = this.changeStyle(style, `--goldenTeeth${goldenTeeth}`, 'yellow');
    }
    return style;
  }

  async saveNFT():Promise<void> {
    const svgData = this.generatorElement?.children[0];
    if (svgData && !this.disabled) {
     return svg.saveSvgAsPng(svgData, `boar${this.id}.png`, {encoderOptions: 1, height: '1189', width: '1030', left: 40});
    }
  }

  private chooseRandomColor = (category: 'background' | 'face' | 'eyes' | 'eyesInner' | 'teeth' | 'hat' | 'glasses'): string => {
    return this.colors[category][Math.floor(Math.random() * this.colors[category].length)];
  };

  private generateNumber = (from: number, to: number): number => {
    return Math.floor(Math.random() * (to - from + 1) + from);
  };

  private chooseColorAndGenerate(category: 'background' | 'face' | 'eyes' | 'eyesInner' | 'teeth' | 'hat'): string {
    const id = parseInt(this.id!) - 1;
    if (id < this.colors[category].length) {
      return this.colors[category][id];
    }
    return this.generateColor();
  }

  private generateColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  private changeStyle = (style: string, variable: string, value: string, all: boolean = false): string => {
    return style.replace(variable, value);
  };

  private groupId = (id: string, svg: string): string => {
    const group = svg.split('<g>');
    return group.join(`<g id=${id}>`);
  };

  public async disable(): Promise<void> {
    this.disabled = !this.disabled;
  }
}
