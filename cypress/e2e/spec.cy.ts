describe('Basic UI Functionality Test', () => {
  it('Loads the initial elements', () => {
    cy.visit('/')
    cy.contains('EU Population Browser')
    cy.contains('No Country selected')
    cy.get('mat-form-field#country-autocomplete')
  })

  it('Selects Hungary and makes sure its Table data is Loaded', () => {
    cy.visit('/')
    cy.get('mat-form-field#country-autocomplete').click()
    cy.get('#mat-option-4').click()
    cy.get('div.table-section').click();
    cy.get('#selected-country-title')
      .should('have.class', 'country-selection-title')
      .should('contain', 'Hungary')
      .should('contain', 'Population');
    cy.get('mat-table#selected-country-city-data-source').contains('Capital');
  })

  it('Selects ALL and makes sure the proper Table is loaded', () => {
    cy.visit('/')
    cy.get('mat-form-field#country-autocomplete').click()
    cy.get('#mat-option-3').click()
    cy.get('div.table-section').click()
    cy.get('#All-country-title')
      .should('have.class', 'country-selection-title')
      .should('contain', 'All Countries Data')
    cy.get('mat-table#all-countries-data-source').within(() => {
      cy.get('mat-header-row').within(() => {
        cy.get('mat-header-cell').contains('Country')
        cy.get('mat-header-cell').contains('Population')
        cy.get('mat-header-cell').contains('Code')
        cy.get('mat-header-cell').contains('Flag')
      })
    })
  })
})
