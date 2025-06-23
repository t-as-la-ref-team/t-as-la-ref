describe('Page d’accueil', () => {
  it('devrait contenir Vite', () => {
    cy.visit('/')
    cy.contains('Vite') // adapte au vrai texte de ta page
  })
})
