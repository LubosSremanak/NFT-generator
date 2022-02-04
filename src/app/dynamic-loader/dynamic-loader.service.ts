import {
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicLoaderService {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public createComponent(
    container: ViewContainerRef,
    componentClass: any
  ): any {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(componentClass);
    return container?.createComponent(componentFactory)?.instance;
  }
}
