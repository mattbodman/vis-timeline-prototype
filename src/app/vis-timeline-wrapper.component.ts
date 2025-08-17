import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  effect,
  input,
  viewChild,
} from '@angular/core';

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

export type GroupTemplateFunction = (group: VisDataGroup) => HTMLElement;

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisTimelineWrapperComponent implements OnInit, OnDestroy {
  private timelineContainer = viewChild.required<ElementRef<HTMLDivElement>>('timelineContainer');

  readonly items = input.required<VisDataItem[]>();
  readonly groups = input.required<VisDataGroup[]>();
  readonly options = input<TimelineOptions>({});
  readonly groupTemplate = input<GroupTemplateFunction>();

  private timeline: Timeline | null = null;

  private readonly timelineOptions = computed(() => {
    const baseOptions = { ...this.options() };

    // Add custom group template only if one is provided
    const customTemplate = this.groupTemplate();
    if (customTemplate) {
      baseOptions.groupTemplate = customTemplate;
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

  private cleanup(): void {
    // Destroy timeline
    if (this.timeline) {
      this.timeline.destroy();
      this.timeline = null;
    }
  }
}
