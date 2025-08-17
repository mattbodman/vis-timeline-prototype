import { 
  ApplicationRef, 
  ComponentRef, 
  EnvironmentInjector, 
  Injectable, 
  createComponent,
  inject 
} from '@angular/core';

import { VisDataGroup, GroupTemplateFunction } from './vis-timeline-wrapper.component';
import { CustomGroupTemplateComponent } from './custom-group-template.component';

@Injectable({
  providedIn: 'root'
})
export class CustomGroupTemplateService {
  private readonly applicationRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private componentRefs: ComponentRef<CustomGroupTemplateComponent>[] = [];

  createCustomGroupTemplate(): GroupTemplateFunction {
    return (group: VisDataGroup): HTMLElement => {
      if (!group) {
        const fallback = document.createElement('div');
        fallback.textContent = 'Unknown Group';
        fallback.style.padding = '8px';
        fallback.style.background = '#f0f0f0';
        fallback.style.borderRadius = '4px';
        return fallback;
      }

      try {
        // Create the custom group template component
        const componentRef = createComponent(CustomGroupTemplateComponent, {
          environmentInjector: this.environmentInjector,
        });

        // Set the inputs
        componentRef.setInput('groupId', group.id);
        componentRef.setInput('groupContent', group.content || String(group.id));

        // Attach to Angular lifecycle
        this.applicationRef.attachView(componentRef.hostView);
        this.componentRefs.push(componentRef);

        // Return the native element
        return componentRef.location.nativeElement;
      } catch (error) {
        console.error('Error creating custom group template:', error);
        
        // Fallback to simple HTML element
        const fallback = document.createElement('div');
        fallback.innerHTML = `
          <div style="
            padding: 8px 12px; 
            background: #ff5722; 
            color: white; 
            border-radius: 4px;
            font-size: 12px;
          ">
            ⚠️ ${group.content || group.id} (Fallback)
          </div>
        `;
        return fallback;
      }
    };
  }

  cleanup(): void {
    // Clean up all created components
    this.componentRefs.forEach((ref) => {
      this.applicationRef.detachView(ref.hostView);
      ref.destroy();
    });
    this.componentRefs = [];
  }
}