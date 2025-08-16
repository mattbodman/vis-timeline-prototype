import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  Injector,
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
  private readonly injector = inject(Injector);
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

  private createGroupTemplate(group: VisDataGroup, element: HTMLElement): HTMLElement {
    // Null safety check
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

      // Set the group ID input
      buttonComponent.setInput('groupId', group.id);

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
      color="primary"
      type="button"
      (click)="onButtonClick()"
      class="group-button"
      [attr.data-group]="groupId()"
    >
      <mat-icon class="button-icon">add</mat-icon>
      Add Task
    </button>
  `,
  styles: [
    `
      .group-button {
        font-size: 12px !important;
        min-width: auto !important;
        height: 32px !important;
        padding: 0 12px !important;
        line-height: 32px !important;
        cursor: pointer !important;

        /* Ensure proper Material elevation */
        box-shadow:
          0px 3px 1px -2px rgba(0, 0, 0, 0.2),
          0px 2px 2px 0px rgba(0, 0, 0, 0.14),
          0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;

        /* Material Design primary color override for indigo theme */
        background-color: #3f51b5 !important;
        color: white !important;

        border-radius: 4px !important;
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.0892857143em;
      }

      .group-button:hover {
        box-shadow:
          0px 2px 4px -1px rgba(0, 0, 0, 0.2),
          0px 4px 5px 0px rgba(0, 0, 0, 0.14),
          0px 1px 10px 0px rgba(0, 0, 0, 0.12) !important;

        background-color: #3949ab !important;
      }

      .button-icon {
        font-size: 16px !important;
        height: 16px !important;
        width: 16px !important;
        margin-right: 4px !important;
        margin-left: -2px !important;
      }

      /* Ensure the button takes up proper space */
      :host {
        display: inline-block;
      }
    `,
  ],
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomGroupButton {
  readonly groupId = input.required<string | number>();

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
        font-size: 20px !important;
        width: 20px !important;
        height: 20px !important;
        cursor: pointer;
        color: #666 !important;
        margin-left: 8px;
        padding: 4px;
        border-radius: 50%;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        /* Material ripple effect simulation */
        position: relative;
        overflow: hidden;
      }

      .group-icon:hover {
        color: #3f51b5 !important; /* Indigo primary color */
        background-color: rgba(63, 81, 181, 0.08) !important; /* Indigo with alpha */
        transform: scale(1.1);
      }

      .group-icon:active {
        background-color: rgba(63, 81, 181, 0.16) !important;
        transform: scale(0.95);
      }

      /* Ensure proper display */
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
