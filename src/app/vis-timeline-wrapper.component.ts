import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  OnInit,
  computed,
  createComponent,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Timeline, TimelineOptions } from 'vis-timeline/standalone';

export interface VisDataItem {
  id: string | number;
  group?: string | number;
  content: string;
  start: Date | string | number;
  end?: Date | string | number;
  type?: string;
}

export interface VisDataGroup {
  id: string | number;
  content: string;
  title?: string;
}

@Component({
  selector: 'app-vis-timeline-wrapper',
  template: ` <div #timelineContainer class="timeline-container"></div> `,
  styles: [
    `
      .timeline-container {
        width: 100%;
        height: 400px;
        border: 1px solid #ccc;
      }
    `,
  ],
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisTimelineWrapperComponent implements OnInit, OnDestroy {
  private readonly applicationRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);

  private timelineContainer = viewChild.required<ElementRef<HTMLDivElement>>('timelineContainer');

  readonly items = input.required<VisDataItem[]>();
  readonly groups = input.required<VisDataGroup[]>();
  readonly options = input<TimelineOptions>({});

  private timeline: Timeline | null = null;
  private componentRefs: ComponentRef<any>[] = [];

  private readonly timelineOptions = computed(() => {
    const baseOptions = { ...this.options() };

    // Add custom group template
    if (this.groups().length > 0) {
      baseOptions.groupTemplate = this.createGroupTemplate.bind(this);
    }

    return baseOptions;
  });

  constructor() {
    effect(() => {
      if (this.timeline) {
        this.timeline.setItems(this.items());
        this.timeline.setGroups(this.groups());
        this.timeline.setOptions(this.timelineOptions());
      }
    });
  }

  ngOnInit(): void {
    this.initializeTimeline();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private initializeTimeline(): void {
    const container = this.timelineContainer().nativeElement;

    this.timeline = new Timeline(container, this.items(), this.groups(), this.timelineOptions());
  }

  private createGroupTemplate(group: VisDataGroup): HTMLElement {
    if (!group) {
      const fallback = document.createElement('div');
      fallback.textContent = 'Unknown Group';
      return fallback;
    }

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '8px';
    container.style.padding = '4px 8px';
    container.style.fontSize = '14px';

    // Create group text with null safety
    const textSpan = document.createElement('span');
    textSpan.textContent = group.content || String(group.id || 'Unknown');
    textSpan.style.fontWeight = '500';
    textSpan.style.marginRight = '8px';
    container.appendChild(textSpan);

    try {
      // Create Angular Material button component
      const buttonComponent = createComponent(CustomGroupButton, {
        environmentInjector: this.environmentInjector,
      });

      // Set the group ID input and color based on group
      buttonComponent.setInput('groupId', group.id);

      // Assign different colors and icons to different groups
      const colors: Array<'primary' | 'accent' | 'warn'> = ['primary', 'accent', 'warn'];
      const icons: string[] = ['add', 'edit', 'star'];
      const groupIndex = (typeof group.id === 'number' ? group.id - 1 : 0) % colors.length;
      
      buttonComponent.setInput('color', colors[groupIndex]);
      buttonComponent.setInput('iconName', icons[groupIndex]);

      // Attach to Angular lifecycle
      this.applicationRef.attachView(buttonComponent.hostView);
      this.componentRefs.push(buttonComponent);

      // Append the button element to container
      const buttonElement = buttonComponent.location.nativeElement;
      buttonElement.style.marginRight = '4px';
      buttonElement.style.cursor = 'pointer';

      // Also set cursor on the actual button inside
      const actualButton = buttonElement.querySelector('button');
      if (actualButton) {
        actualButton.style.cursor = 'pointer';
      }

      container.appendChild(buttonElement);

      // Ensure button cursor styling (keeping the functionality even if cursor display has issues)
      setTimeout(() => {
        const allButtons = buttonElement.querySelectorAll('button, [mat-raised-button]');
        allButtons.forEach((btn: Element) => {
          const htmlBtn = btn as HTMLElement;
          htmlBtn.style.cursor = 'pointer';
          htmlBtn.style.setProperty('cursor', 'pointer', 'important');
        });
        buttonElement.style.cursor = 'pointer';
      }, 100);

      // Create Angular Material icon component
      const iconComponent = createComponent(CustomGroupIcon, {
        environmentInjector: this.environmentInjector,
      });

      // Set the group ID input
      iconComponent.setInput('groupId', group.id);

      // Attach to Angular lifecycle
      this.applicationRef.attachView(iconComponent.hostView);
      this.componentRefs.push(iconComponent);

      // Append the icon element to container
      container.appendChild(iconComponent.location.nativeElement);
    } catch (error) {
      console.error('Error creating Angular Material components:', error);

      // Fallback to simple HTML elements if Angular component creation fails
      const fallbackButton = document.createElement('button');
      fallbackButton.textContent = 'Action (Fallback)';
      fallbackButton.style.marginRight = '8px';
      fallbackButton.style.padding = '4px 8px';
      fallbackButton.onclick = () => console.log('Fallback button clicked for group:', group.id);
      container.appendChild(fallbackButton);
    }

    return container;
  }

  private cleanup(): void {
    // Destroy timeline
    if (this.timeline) {
      this.timeline.destroy();
      this.timeline = null;
    }

    // Clean up Angular components
    this.componentRefs.forEach((ref) => {
      this.applicationRef.detachView(ref.hostView);
      ref.destroy();
    });
    this.componentRefs = [];
  }
}

@Component({
  selector: 'app-custom-group-button',
  template: `
    <button
      mat-raised-button
      [color]="color()"
      type="button"
      (click)="onButtonClick()"
      class="group-button"
      [attr.data-group]="groupId()"
    >
      <mat-icon class="button-icon">{{ iconName() }}</mat-icon>
      Add Task
    </button>
  `,
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomGroupButton {
  readonly groupId = input.required<string | number>();
  readonly color = input<'primary' | 'accent' | 'warn'>('primary');
  readonly iconName = input.required<string>();

  onButtonClick(): void {
    console.log('🎯 Material raised button (indigo theme) clicked for group:', this.groupId());
  }
}

@Component({
  selector: 'app-custom-group-icon',
  template: `
    <mat-icon
      class="group-icon"
      [attr.title]="'More options for group ' + groupId()"
      (click)="onIconClick()"
      [attr.data-group]="groupId()"
    >
      more_vert
    </mat-icon>
  `,
  styles: [
    `
      .group-icon {
        font-size: 20px;
        cursor: pointer;
        margin-left: 8px;
        padding: 4px;
        border-radius: 50%;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .group-icon:hover {
        background-color: rgba(0, 0, 0, 0.04);
        transform: scale(1.1);
      }

      .group-icon:active {
        background-color: rgba(0, 0, 0, 0.08);
        transform: scale(0.95);
      }

      :host {
        display: inline-block;
        vertical-align: middle;
      }
    `,
  ],
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomGroupIcon {
  readonly groupId = input.required<string | number>();

  onIconClick(): void {
    console.log('🎨 Material icon (indigo theme) clicked for group:', this.groupId());
  }
}
