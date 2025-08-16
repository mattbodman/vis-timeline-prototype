/// <reference types="cypress" />
/// <reference types="mocha" />
/// <reference path="../../cypress/support/component.ts" />
import { VisTimelineWrapperComponent, VisDataItem, VisDataGroup } from './vis-timeline-wrapper.component'
import { TimelineOptions } from 'vis-timeline/standalone'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'

describe('VisTimelineWrapperComponent - Material Design Integration', () => {
  const mockItems: VisDataItem[] = [
    {
      id: 1,
      group: 1,
      content: 'Development Task 1',
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 3)
    },
    {
      id: 2,
      group: 2,
      content: 'Design Task 1',
      start: new Date(2024, 0, 2),
      end: new Date(2024, 0, 4)
    },
    {
      id: 3,
      group: 3,
      content: 'QA Task 1',
      start: new Date(2024, 0, 3),
      end: new Date(2024, 0, 5)
    }
  ]

  const mockGroups: VisDataGroup[] = [
    {
      id: 1,
      content: 'Development Team'
    },
    {
      id: 2,
      content: 'Design Team'
    },
    {
      id: 3,
      content: 'QA Team'
    }
  ]

  const mockOptions: TimelineOptions = {
    width: '100%',
    height: '400px',
    stack: true,
    editable: false,
    showCurrentTime: false
  }

  it('should mount and render timeline container with proper dimensions', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions
      },
      providers: [provideAnimationsAsync()]
    })

    cy.get('.timeline-container').should('exist')
    cy.get('.timeline-container').should('have.css', 'height', '400px')
    cy.get('.timeline-container').should('have.css', 'border', '1px solid rgb(204, 204, 204)')
  })

  it('should render Angular Material raised buttons in group templates', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions
      },
      providers: [provideAnimationsAsync()]
    })

    // Wait for timeline and Material components to initialize
    cy.wait(2000)

    // Check if Material raised buttons are rendered
    cy.get('[mat-raised-button]').should('have.length', 3) // One for each group
    
    // Verify buttons have proper Material Design styling
    cy.get('[mat-raised-button]').first().should('have.css', 'background-color', 'rgb(63, 81, 181)') // Indigo color
    cy.get('[mat-raised-button]').first().should('have.css', 'color', 'rgb(255, 255, 255)') // White text
    
    // Verify button content includes "Add Task" text (case-sensitive)
    cy.get('[mat-raised-button]').first().should('contain.text', 'Add Task')
    
    // Verify buttons have proper elevation (box-shadow)
    cy.get('[mat-raised-button]').first().should('have.css', 'box-shadow')
      .and('not.equal', 'none')
  })

  it('should render Material icons within raised buttons', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions
      },
      providers: [provideAnimationsAsync()]
    })

    // Wait for timeline and Material components to initialize
    cy.wait(2000)

    // Check if Material icons are rendered within buttons
    cy.get('[mat-raised-button] mat-icon').should('have.length', 3) // One icon per button
    
    // Verify icons show the "add" icon
    cy.get('[mat-raised-button] mat-icon').first().should('contain.text', 'add')
    
    // Verify icon styling
    cy.get('[mat-raised-button] mat-icon').first()
      .should('have.css', 'font-size', '16px')
      .should('have.css', 'width', '16px')
      .should('have.css', 'height', '16px')
  })

  it('should render separate Material icons (more_vert) in group templates', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions
      },
      providers: [provideAnimationsAsync()]
    })

    // Wait for timeline and Material components to initialize
    cy.wait(2000)

    // Check for mat-icons (the more_vert icons should be present)
    cy.get('mat-icon').should('have.length.at.least', 1) // At least 1 icon should exist
    
    // Find the more_vert icons specifically - timeline may render fewer groups initially
    cy.get('mat-icon').contains('more_vert').should('have.length.at.least', 1)
    
    // Verify more_vert icon styling
    cy.get('mat-icon').contains('more_vert').first()
      .should('have.css', 'cursor', 'pointer')
      .should('have.css', 'color', 'rgb(102, 102, 102)') // Default gray color
  })

  it('should handle Material button clicks with proper event handling', () => {
    // Spy on console.log to verify click events
    cy.window().then((win: any) => {
      // @ts-ignore - Cypress spy method
      cy.spy(win.console, 'log').as('consoleLog')
    })

    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions
      },
      providers: [provideAnimationsAsync()]
    })

    // Wait for timeline to initialize
    cy.wait(2000)

    // Click on the first Material button
    cy.get('[mat-raised-button]').first().click()
    
    // Verify the console log was called with correct message
    cy.get('@consoleLog').should('have.been.calledWith', '🎯 Material raised button (indigo theme) clicked for group:', 1)
  })

  it('should handle Material icon clicks with proper event handling', () => {
    // Spy on console.log to verify click events
    cy.window().then((win: any) => {
      // @ts-ignore - Cypress spy method
      cy.spy(win.console, 'log').as('consoleLog')
    })

    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions
      },
      providers: [provideAnimationsAsync()]
    })

    // Wait for timeline to initialize
    cy.wait(2000)

    // Click on the first more_vert icon
    cy.get('mat-icon').contains('more_vert').first().click()
    
    // Verify the console log was called with correct message
    cy.get('@consoleLog').should('have.been.calledWith', '🎨 Material icon (indigo theme) clicked for group:', 1)
  })

  it('should apply indigo theme colors correctly', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions
      },
      providers: [provideAnimationsAsync()]
    })

    // Wait for timeline and Material components to initialize
    cy.wait(2000)

    // Verify primary indigo color on buttons - Material Design indigo-500
    cy.get('[mat-raised-button]').first()
      .should('have.css', 'background-color', 'rgb(63, 81, 181)') // #3f51b5 in RGB
    
    // Test hover effect by triggering mouseover
    cy.get('[mat-raised-button]').first().trigger('mouseover')
    cy.get('[mat-raised-button]').first()
      .should('have.css', 'background-color', 'rgb(63, 81, 181)') // Same indigo color after hover
  })

  it('should have proper accessibility attributes', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions
      },
      providers: [provideAnimationsAsync()]
    })

    // Wait for timeline and Material components to initialize
    cy.wait(2000)

    // Check that buttons are properly accessible
    cy.get('[mat-raised-button]').first()
      .should('have.attr', 'type', 'button')
      .should('be.enabled')
    
    // Check that icons have proper titles
    cy.get('mat-icon').contains('more_vert').first()
      .should('have.attr', 'title')
      .and('contain', 'More options for group')
  })

  it('should maintain timeline functionality with custom group templates', () => {
    cy.mount(VisTimelineWrapperComponent, {
      componentProperties: {
        items: mockItems,
        groups: mockGroups,
        options: mockOptions
      },
      providers: [provideAnimationsAsync()]
    })

    // Wait for timeline to initialize
    cy.wait(2000)

    // Verify timeline items are rendered
    cy.get('.vis-item').should('have.length', 3)
    
    // Verify groups are rendered with our custom templates
    cy.get('.vis-group').should('have.length.at.least', 3)
    
    // Verify that timeline still shows proper time axis
    cy.get('.vis-time-axis').should('exist')
    
    // Verify timeline is interactive (should have pan/zoom capabilities)
    cy.get('.vis-timeline').should('exist')
      .should('have.css', 'overflow', 'hidden')
  })
})