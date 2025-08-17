import { Component, computed, signal } from '@angular/core';

import { TimelineOptions } from 'vis-timeline/standalone';

import {
  VisDataGroup,
  VisDataItem,
  VisTimelineWrapperComponent,
  GroupTemplateFunction,
} from './vis-timeline-wrapper.component';
import { CustomGroupTemplateService } from './custom-group-template.service';

@Component({
  selector: 'app-root',
  imports: [VisTimelineWrapperComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly customTemplateService = new CustomGroupTemplateService();
  protected readonly title = signal('vis-timeline-prototype');

  protected readonly timelineItems = signal<VisDataItem[]>([
    {
      id: 1,
      group: 1,
      content: 'Task 1',
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 3),
    },
    {
      id: 2,
      group: 1,
      content: 'Task 2',
      start: new Date(2024, 0, 4),
      end: new Date(2024, 0, 6),
    },
    {
      id: 3,
      group: 2,
      content: 'Task 3',
      start: new Date(2024, 0, 2),
      end: new Date(2024, 0, 8),
    },
    {
      id: 4,
      group: 2,
      content: 'Task 4',
      start: new Date(2024, 0, 7),
      end: new Date(2024, 0, 10),
    },
    {
      id: 5,
      group: 3,
      content: 'Task 5',
      start: new Date(2024, 0, 5),
      end: new Date(2024, 0, 12),
    },
  ]);

  protected readonly timelineGroups = signal<VisDataGroup[]>([
    {
      id: 1,
      content: 'Development Team',
    },
    {
      id: 2,
      content: 'Design Team',
    },
    {
      id: 3,
      content: 'QA Team',
    },
  ]);

  protected readonly timelineOptions = signal<TimelineOptions>({
    width: '100%',
    height: '400px',
    stack: true,
    editable: false,
    showCurrentTime: false,
  });

  // Toggle between default and custom template
  protected readonly useCustomTemplate = signal(false);

  // Custom group template function
  protected readonly customGroupTemplate = computed<GroupTemplateFunction | undefined>(() => {
    return this.useCustomTemplate() 
      ? this.customTemplateService.createCustomGroupTemplate()
      : undefined;
  });

  protected toggleTemplate(): void {
    this.useCustomTemplate.update(current => !current);
  }
}
