describe("Secrets", function() {
  context("Secrets Table", function() {
    beforeEach(function() {
      cy.configureCluster({
          mesos: "1-task-healthy"
        })
        .visitUrl({ url: "/secrets" });

      cy.get(".page-header-actions-inner .button")
        .click();

      cy.get('input[name="path"]')
        .type("testsecret");

      cy.get('input[name="value"]')
        .type("testvalue");

      cy.contains("Create Secret")
        .click();
    });

    it("shows a link for secrets in table", function() {
      cy.get(".table-cell-link-primary");
    });
  });
});
