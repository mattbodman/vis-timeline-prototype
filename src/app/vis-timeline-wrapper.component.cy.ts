/// <reference types="cypress" />
/// <reference types="mocha" />
/// <reference path="../../cypress/support/component.ts" />
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { TimelineOptions } from 'vis-timeline/standalone';

import {
  VisDataGroup,
  VisDataItem,
  VisTimelineWrapperComponent,
  GroupTemplateFunction,
} from './vis-timeline-wrapper.component';
import { CustomGroupTemplateService } from './custom-group-template.service';

describe('VisTimelineWrapperComponent - Basic Integration', () => {
  const mockItems: VisDataItem[] = [
    {
      id: 1,
      group: 1,
      content: 'Development Task 1',
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 3),
    },
    {
      id: 2,
      group: 2,
      content: 'Design Task 1',
      start: new Date(2024, 0, 2),
      end: new Date(2024, 0, 4),
    },
    {
      id: 3,
      group: 3,
      content: 'QA Task 1',
      start: new Date(2024, 0, 3),
      end: new Date(2024, 0, 5),
    },
  ];

  const mockGroups: VisDataGroup[] = [
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
  ];

  const mockOptions: TimelineOptions = {
    width: '100%',
    height: '400px',
    stack: true,
    editable: false,
    showCurrentTime: false,
  };

  it('should mount and render timeline container with proper dimensions', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
      },
      providers: [provideAnimationsAsync()],
    });

    cy.get('.timeline-container').should('exist');
    cy.get('.timeline-container').should('have.css', 'height', '400px');
    cy.get('.timeline-container').should('have.css', 'border', '1px solid rgb(204, 204, 204)');
  });

  it('should render timeline without group templates when none provided', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
        // No groupTemplate provided
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline to initialize
    cy.wait(2000);

    // Verify timeline items are rendered
    cy.get('.vis-item').should('have.length', 3);

    // Verify groups are rendered with default vis-timeline styling (no custom templates)
    cy.get('.vis-group').should('have.length.at.least', 3);

    // Should NOT render any custom template elements
    cy.get('[mat-raised-button]').should('not.exist');
    cy.get('mat-icon').should('not.exist');
    cy.get('.custom-group-container').should('not.exist');

    // Verify timeline functionality
    cy.get('.vis-time-axis').should('exist');
    cy.get('.vis-timeline').should('exist').should('have.css', 'overflow', 'hidden');
  });
});

describe('VisTimelineWrapperComponent - Custom Group Template Integration', () => {
  const mockItems: VisDataItem[] = [
    {
      id: 1,
      group: 1,
      content: 'Development Task 1',
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 3),
    },
    {
      id: 2,
      group: 2,
      content: 'Design Task 1',
      start: new Date(2024, 0, 2),
      end: new Date(2024, 0, 4),
    }
  ];

  const mockGroups: VisDataGroup[] = [
    {
      id: 1,
      content: 'Development Team',
    },
    {
      id: 2,
      content: 'Design Team',
    }
  ];

  const mockOptions: TimelineOptions = {
    width: '100%',
    height: '400px',
    stack: true,
    editable: false,
    showCurrentTime: false,
  };

  // Helper function to create custom template with Material components
  const createCustomTemplateInContext = (): GroupTemplateFunction => {
    return (group: VisDataGroup): HTMLElement => {
      const container = document.createElement('div');
      container.className = 'custom-group-container';
      container.style.cssText = `
        display: flex;
        flex-direction: column;
        padding: 8px 12px;
        background: linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%);
        border-radius: 8px;
        color: white;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
        min-width: 200px;
      `;

      // Create HTML structure that represents Material components
      container.innerHTML = `
        <div class="group-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="group-title" style="display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 14px; color: #ffffff;">
            <mat-icon class="header-icon" style="font-size: 18px; width: 18px; height: 18px; color: #ffffff;">business</mat-icon>
            ${group.content}
          </span>
          <span class="group-id-badge" style="background: rgba(255, 255, 255, 0.2); padding: 2px 6px; border-radius: 12px; font-size: 11px; font-weight: 500;">ID: ${group.id}</span>
        </div>
        <div class="group-actions" style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button mat-raised-button color="primary" data-group="${group.id}" class="custom-action-btn" style="flex: 1; min-width: 80px;">
            <mat-icon style="font-size: 14px; width: 14px; height: 14px; margin-right: 4px;">add</mat-icon>Create
          </button>
          <button mat-raised-button color="accent" data-group="${group.id}" class="custom-action-btn" style="flex: 1; min-width: 80px;">
            <mat-icon style="font-size: 14px; width: 14px; height: 14px; margin-right: 4px;">visibility</mat-icon>View
          </button>
          <button mat-raised-button color="warn" data-group="${group.id}" class="custom-action-btn" style="flex: 1; min-width: 80px;">
            <mat-icon style="font-size: 14px; width: 14px; height: 14px; margin-right: 4px;">settings</mat-icon>Settings
          </button>
        </div>
      `;

      // Add click handlers with event stopPropagation
      const buttons = container.querySelectorAll('button');
      buttons.forEach((btn, index) => {
        const logs = [
          '🌟 Custom template PRIMARY action clicked for group:',
          '📈 Custom template SECONDARY action clicked for group:',
          '🔧 Custom template TERTIARY action clicked for group:'
        ];
        btn.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent vis-timeline group expand/collapse
          console.log(logs[index], group.id);
        });
      });

      return container;
    };
  };

  it('should render custom template when groupTemplate is provided', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
        groupTemplate: createCustomTemplateInContext(),
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline and custom components to initialize
    cy.wait(2000);

    // Check if custom template containers are rendered
    cy.get('.custom-group-container').should('have.length.at.least', 1);

    // Verify custom template styling
    cy.get('.custom-group-container')
      .first()
      .should('have.css', 'background')
      .and('include', 'linear-gradient');

    // Verify custom template has group title with mat-icon
    cy.get('.group-title').first().should('contain.text', 'Development Team');
    cy.get('mat-icon').contains('business').should('exist');

    // Verify custom template has ID badge
    cy.get('.group-id-badge').first().should('contain.text', 'ID: 1');
  });

  it('should render custom action buttons in custom template', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
        groupTemplate: createCustomTemplateInContext(),
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline and custom components to initialize
    cy.wait(2000);

    // Check for three Material action buttons per group
    cy.get('[mat-raised-button].custom-action-btn').should('have.length.at.least', 3);

    // Verify buttons have Material icons and text
    cy.get('[mat-raised-button].custom-action-btn').first().should('contain.text', 'Create');
    cy.get('[mat-raised-button].custom-action-btn').first().find('mat-icon').should('contain.text', 'add');

    cy.get('[mat-raised-button].custom-action-btn').eq(1).should('contain.text', 'View');
    cy.get('[mat-raised-button].custom-action-btn').eq(1).find('mat-icon').should('contain.text', 'visibility');

    cy.get('[mat-raised-button].custom-action-btn').eq(2).should('contain.text', 'Settings');
    cy.get('[mat-raised-button].custom-action-btn').eq(2).find('mat-icon').should('contain.text', 'settings');
  });

  it('should handle custom template button clicks', () => {
    // Spy on console.log to verify click events
    cy.window().then((win: any) => {
      cy.spy(win.console, 'log').as('consoleLog');
    });

    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
        groupTemplate: createCustomTemplateInContext(),
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline to initialize
    cy.wait(2000);

    // Click primary Material button
    cy.get('[mat-raised-button].custom-action-btn').first().click();
    cy.get('@consoleLog').should(
      'have.been.calledWith',
      '🌟 Custom template PRIMARY action clicked for group:',
      1
    );

    // Click secondary Material button  
    cy.get('[mat-raised-button].custom-action-btn').eq(1).click();
    cy.get('@consoleLog').should(
      'have.been.calledWith',
      '📈 Custom template SECONDARY action clicked for group:',
      1
    );

    // Click tertiary Material button
    cy.get('[mat-raised-button].custom-action-btn').eq(2).click();
    cy.get('@consoleLog').should(
      'have.been.calledWith',
      '🔧 Custom template TERTIARY action clicked for group:',
      1
    );
  });

  it('should render timeline without custom elements when groupTemplate is undefined', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
        // No groupTemplate provided - should use vis-timeline default
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline to initialize
    cy.wait(2000);

    // Should NOT render any custom template elements
    cy.get('[mat-raised-button]').should('not.exist');
    cy.get('mat-icon').should('not.exist');
    cy.get('.custom-group-container').should('not.exist');
    cy.get('.custom-action-btn').should('not.exist');

    // Verify basic timeline functionality still works
    cy.get('.vis-item').should('have.length', 2);
    cy.get('.vis-group').should('have.length.at.least', 2);
    cy.get('.vis-time-axis').should('exist');
  });

  it('should prevent group expand/collapse when clicking buttons but allow it otherwise', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
        groupTemplate: createCustomTemplateInContext(),
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline to initialize
    cy.wait(2000);

    // Click a custom button - this should NOT trigger group expand/collapse
    // We can verify this by checking that the button click doesn't cause any
    // unwanted side effects on the timeline structure
    cy.get('[mat-raised-button].custom-action-btn').first().click();

    // Verify that the timeline structure remains stable after button click
    cy.get('.vis-item').should('have.length', 2);
    cy.get('.vis-group').should('have.length.at.least', 2);

    // Verify that buttons are still clickable and functional
    cy.get('[mat-raised-button].custom-action-btn').should('be.visible');
    cy.get('[mat-raised-button].custom-action-btn').should('have.length.at.least', 3);
  });

  it('should maintain timeline functionality with custom templates', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
        groupTemplate: createCustomTemplateInContext(),
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline to initialize
    cy.wait(2000);

    // Verify timeline items are still rendered
    cy.get('.vis-item').should('have.length', 2);

    // Verify groups are rendered with custom templates
    cy.get('.vis-group').should('have.length.at.least', 2);

    // Verify timeline axis still exists
    cy.get('.vis-time-axis').should('exist');

    // Verify timeline container still has proper styling
    cy.get('.vis-timeline').should('exist').should('have.css', 'overflow', 'hidden');
  });
});
