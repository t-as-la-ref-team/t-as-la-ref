describe("Page d’accueil", () => {
  it("devrait contenir les éléments principaux", () => {
    cy.visit('/');
    cy.contains("T'as la ref");
    cy.contains('Connexion');
    cy.contains('Se connecteee');
  });
});
