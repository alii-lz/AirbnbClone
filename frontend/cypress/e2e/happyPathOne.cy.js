describe('happy path one as decribed in the spec', () => {
  it('check if we are at homepage', () => {
    cy.visit('localhost:3000');
    cy.url().should('include', 'localhost:3000');
  });

  it('successful register', () => {
    cy.get('#nav-register-btn').click();
    cy.url().should('include', 'localhost:3000/register');

    cy.get('input[name=register-name]').focus().type('test');

    cy.get('input[name=register-email]').focus().type('test@gmail.com');

    cy.get('input[name=register-password]').focus().type('test123');

    cy.get('input[name=register-password-confirm]').focus().type('test123');

    cy.get('#register-submit-btn').click();
    cy.url().should('include', 'localhost:3000');
  });

  it('successfully create listing', () => {
    // first we must log in
    cy.get('#nav-login-btn').click();
    cy.url().should('include', 'localhost:3000/login');

    cy.get('input[name=login-email]').focus().type('test@gmail.com');

    cy.get('input[name=login-password]').focus().type('test123');

    cy.get('login-submit-btn').click();
    cy.url().should('include', 'localhost:3000');

    cy.get('#nav-yourListings-btn').click();
    cy.url().should('include', 'localhost:3000/yourListings');

    cy.get('#create-listing-btn').click();
    cy.url().should('include', 'localhost:3000/createListing');

    cy.get('input[name=title]').focus().type('unsw');

    cy.get('input[name=street]').focus().type('high st');

    cy.get('input[name=city]').focus().type('sydney');

    cy.get('input[name=country]').focus().type('australia');

    cy.get('input[name=price]').focus().type('100');

    cy.get('input[name=price]').focus().type('100');

    cy.get('input[name=thumbail]').selectFile('src/images/thumbnail.jfif');

    cy.get('input[name=thumbail]').selectFile('src/images/thumbnail.jfif');
  });
});
