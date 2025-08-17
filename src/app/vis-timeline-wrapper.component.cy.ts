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

describe('VisTimelineWrapperComponent - Material Design Integration', () => {
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

  it('should render Angular Material raised buttons in group templates', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline and Material components to initialize
    cy.wait(2000);

    // Check if Material raised buttons are rendered
    cy.get('[mat-raised-button]').should('have.length', 3); // One for each group

    // Verify buttons have proper Material Design styling
    cy.get('[mat-raised-button]')
      .first()
      .should('have.css', 'background-color', 'rgb(63, 81, 181)'); // Indigo color
    cy.get('[mat-raised-button]').first().should('have.css', 'color', 'rgb(255, 255, 255)'); // White text

    // Verify button content includes "Add Task" text (case-sensitive)
    cy.get('[mat-raised-button]').first().should('contain.text', 'Add Task');

    // Verify buttons have proper elevation (box-shadow)
    cy.get('[mat-raised-button]').first().should('have.css', 'box-shadow').and('not.equal', 'none');
  });

  it('should render Material icons within raised buttons', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline and Material components to initialize
    cy.wait(2000);

    // Check if Material icons are rendered within buttons
    cy.get('[mat-raised-button] mat-icon').should('have.length', 3); // One icon per button

    // Verify different icons for each group
    cy.get('[mat-raised-button] mat-icon').eq(0).should('contain.text', 'add'); // Group 1
    cy.get('[mat-raised-button] mat-icon').eq(1).should('contain.text', 'edit'); // Group 2  
    cy.get('[mat-raised-button] mat-icon').eq(2).should('contain.text', 'star'); // Group 3

    // Verify icon styling (Material default sizes)
    cy.get('[mat-raised-button] mat-icon')
      .first()
      .should('have.css', 'font-size', '18px')
      .should('have.css', 'width', '18px')
      .should('have.css', 'height', '18px');
  });

  it('should render separate Material icons (more_vert) in group templates', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline and Material components to initialize
    cy.wait(2000);

    // Check for mat-icons (the more_vert icons should be present)
    cy.get('mat-icon').should('have.length.at.least', 1); // At least 1 icon should exist

    // Find the more_vert icons specifically - timeline may render fewer groups initially
    cy.get('mat-icon').contains('more_vert').should('have.length.at.least', 1);

    // Verify more_vert icon content
    cy.get('mat-icon')
      .contains('more_vert')
      .first()
      .should('contain.text', 'more_vert');
  });

  it('should handle Material button clicks with proper event handling', () => {
    // Spy on console.log to verify click events
    cy.window().then((win: any) => {
      // @ts-ignore - Cypress spy method
      cy.spy(win.console, 'log').as('consoleLog');
    });

    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline to initialize
    cy.wait(2000);

    // Click on the first Material button
    cy.get('[mat-raised-button]').first().click();

    // Verify the console log was called with correct message
    cy.get('@consoleLog').should(
      'have.been.calledWith',
      '🎯 Material raised button (indigo theme) clicked for group:',
      1
    );
  });

  it('should handle Material icon clicks with proper event handling', () => {
    // Spy on console.log to verify click events
    cy.window().then((win: any) => {
      // @ts-ignore - Cypress spy method
      cy.spy(win.console, 'log').as('consoleLog');
    });

    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline to initialize
    cy.wait(2000);

    // Click on the first more_vert icon
    cy.get('mat-icon').contains('more_vert').first().click();

    // Verify the console log was called with correct message
    cy.get('@consoleLog').should(
      'have.been.calledWith',
      '🎨 Material icon (indigo theme) clicked for group:',
      1
    );
  });

  it('should render three different Material icons (add, edit, star)', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline and Material components to initialize
    cy.wait(2000);

    // Verify we have 3 buttons with different icons
    cy.get('[mat-raised-button] mat-icon').should('have.length', 3);

    // Check Group 1 has 'add' icon
    cy.get('[mat-raised-button]')
      .eq(0)
      .find('mat-icon')
      .should('contain.text', 'add');

    // Check Group 2 has 'edit' icon
    cy.get('[mat-raised-button]')
      .eq(1)
      .find('mat-icon')
      .should('contain.text', 'edit');

    // Check Group 3 has 'star' icon
    cy.get('[mat-raised-button]')
      .eq(2)
      .find('mat-icon')
      .should('contain.text', 'star');
  });

  it('should render all three Material color variants (primary, accent, warn)', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline and Material components to initialize
    cy.wait(2000);

    // Verify we have 3 buttons with different colors
    cy.get('[mat-raised-button]').should('have.length', 3);

    // Check first button (Group 1) has primary color (indigo)
    cy.get('[mat-raised-button]')
      .eq(0)
      .should('have.css', 'background-color', 'rgb(63, 81, 181)'); // Primary - Indigo

    // Check second button (Group 2) has accent color (pink)
    cy.get('[mat-raised-button]')
      .eq(1)
      .should('have.css', 'background-color', 'rgb(255, 64, 129)'); // Accent - Pink

    // Check third button (Group 3) has warn color (red)  
    cy.get('[mat-raised-button]')
      .eq(2)
      .should('have.css', 'background-color', 'rgb(244, 67, 54)'); // Warn - Red
  });

  it('should apply indigo theme colors correctly', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline and Material components to initialize
    cy.wait(2000);

    // Verify primary indigo color on buttons - Material Design indigo-500
    cy.get('[mat-raised-button]')
      .first()
      .should('have.css', 'background-color', 'rgb(63, 81, 181)'); // #3f51b5 in RGB

    // Test hover effect by triggering mouseover
    cy.get('[mat-raised-button]').first().trigger('mouseover');
    cy.get('[mat-raised-button]')
      .first()
      .should('have.css', 'background-color', 'rgb(63, 81, 181)'); // Same indigo color after hover
  });

  it('should have proper accessibility attributes', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline and Material components to initialize
    cy.wait(2000);

    // Check that buttons are properly accessible
    cy.get('[mat-raised-button]')
      .first()
      .should('have.attr', 'type', 'button')
      .should('be.enabled');

    // Check that icons have proper titles
    cy.get('mat-icon')
      .contains('more_vert')
      .first()
      .should('have.attr', 'title')
      .and('contain', 'More options for group');
  });

  it('should maintain timeline functionality with custom group templates', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline to initialize
    cy.wait(2000);

    // Verify timeline items are rendered
    cy.get('.vis-item').should('have.length', 3);

    // Verify groups are rendered with our custom templates
    cy.get('.vis-group').should('have.length.at.least', 3);

    // Verify that timeline still shows proper time axis
    cy.get('.vis-time-axis').should('exist');

    // Verify timeline is interactive (should have pan/zoom capabilities)
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

      // Add click handlers
      const buttons = container.querySelectorAll('button');
      buttons.forEach((btn, index) => {
        const logs = [
          '🌟 Custom template PRIMARY action clicked for group:',
          '📈 Custom template SECONDARY action clicked for group:',
          '🔧 Custom template TERTIARY action clicked for group:'
        ];
        btn.addEventListener('click', () => console.log(logs[index], group.id));
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

  it('should fallback to default template when groupTemplate is undefined', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions,
        // No groupTemplate provided - should use default
      },
      providers: [provideAnimationsAsync()],
    });

    // Wait for timeline to initialize
    cy.wait(2000);

    // Should render default Material Design buttons (not custom template)
    cy.get('[mat-raised-button]').should('have.length.at.least', 1);
    
    // Should NOT render custom template elements
    cy.get('.custom-group-container').should('not.exist');
    cy.get('.custom-action-btn').should('not.exist');
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
