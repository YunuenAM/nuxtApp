describe('Página de inicio', () => {
  it('Carga correctamente la página de la tabla', () => {
    cy.visit('/tabla');
 
    
  });


  it('Busca un estado por nombre y muestra los resultados esperados', () => {
    cy.visit('/tabla');
    cy.get('input[placeholder="🔍 Buscar entidad..."]').type('veracruz');
    cy.get('.tabla-lista tbody tr').each($tr => {
      cy.wrap($tr).find('td').first().should('contain.text', 'Veracruz');
    });
  });

  it('Agrega un año nuevo y aparece en el filtro de años después de cerrar el diálogo', () => {
    cy.visit('/tabla');

    // Haz click en el botón para agregar año
    cy.get('.btn-anio[aria-label="Agregar nuevo año"]').click();

    // Elige un año que no esté (por ejemplo, el 2099)
    cy.get('.modal-content input[type="number"]').clear().type('2099');
    cy.get('.modal-content button[aria-label="Agregar año"]').click();
})})
