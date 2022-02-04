import {AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {DynamicLoaderService} from "../dynamic-loader/dynamic-loader.service";
import {GeneratorComponent} from "../generator/generator.component";

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit, AfterViewInit {

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef | undefined;
  images: number;
  private instances: any[];
  progress: number | undefined;

  constructor(private dynamicLoader: DynamicLoaderService) {
    this.instances = [];
    this.progress = 0;
    this.images = 0;
  }

  async ngAfterViewInit(): Promise<void> {
    this.generate();
  }

  async generate(): Promise<void> {
    this.progress = 0;
    if (this.container) {
      for (let i = 1; i <= this.images; i++) {
        const instance: GeneratorComponent = this.dynamicLoader.createComponent(this.container, GeneratorComponent);
        instance.id = i + '';
        this.instances.push(instance)
        this.progress = i / this.images * 100;
        await instance.generate();
      }
      this.progress = undefined;
    }
  }

  ngOnInit(): void {

  }

  async save(): Promise<void> {
    for (const instance of this.instances) {
     await instance.saveNFT();
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  regenerate(): void {
    this.instances = [];
    this.container?.clear();
    this.generate();
  }
}
