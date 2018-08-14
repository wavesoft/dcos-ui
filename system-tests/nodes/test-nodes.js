const hostnameSelector =
  ".BottomLeftGrid_ScrollWrapper .ReactVirtualized__Grid__innerScrollContainer a";

describe("Nodes", function() {
  afterEach(() => {
    cy.window().then(win => {
      win.location.href = "about:blank";
    });
  });

  it("shows all nodes as healthy", () => {
    cy.visitUrl("/nodes");
    cy.get(hostnameSelector).should("have.length", 2);
  });

  it("shows all nodes as healthy", () => {
    cy.get(
      ".ReactVirtualized__Grid__innerScrollContainer > div:contains('Healthy')"
    ).should("have.length", 2);
  });
});
