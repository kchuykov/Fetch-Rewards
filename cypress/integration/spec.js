describe("Finding a Fake Bar", () => {
  it("Should find the Fake Bar", () => {
    const filePath = 'result.txt'
    let contents = [];
    const bars = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    cy.visit("http://ec2-54-208-152-154.compute-1.amazonaws.com/");
    checkBars(bars);
    cy.writeFile(filePath, contents)

    
    //this functions clicks on the found bar and validates that 
    //bar is correct
    function clickAndValidateBar(bar) {
      const stub = cy.stub();
      cy.on("window:alert", stub)
      cy.get(`#coin_${bar}`)
        .click()
        .then(() => {
          console.log()
          cy.pause()
          expect(stub.getCall(0)).to.be.calledWith("Yay! You find it!");
          contents.push(`Found the fake gold bar is number ${bar}`)
          contents.push(`Alert Message Text: ${stub.getCall(0).args[0]}`)
          cy.get('.game-info ol li').then( items => {
            contents.push(`Number of weighing: ${items.length}`)
            contents.push('List of weighing were made:')
            items.each(( i, el)=> {
                    contents.push(`${i}. ${el.innerText}` )
                })
            })
        });
    }

    //function given the array of bars, will split the array in 2
    //halfs, it puts each half on the array, and calls itself with the
    // array that has the fake bar
    // once it only has one fake bar it will call the function to validate
    // the fake bar.
    function checkBars(bars) {
      const half = Math.ceil(bars.length / 2);
      const firstHalf = bars.splice(0, half);
      const secondHalf = bars.splice(-half);

      firstHalf.forEach((bar) => {
        cy.get(`#left_${bar}`).type(bar);
      });
      secondHalf.forEach((bar) => {
        cy.get(`#right_${bar}`).type(bar);
      });
      cy.get("#weigh").click();
      //cy.get(".game-info ol li:last-child")
      cy.get('#reset')
        .invoke("text")
        .then((weighResult) => {
          //cy.get('#reset').click()
          cy.xpath('//button[text()="Reset"]').click();
          if (weighResult.includes(">")) {
            if (secondHalf.length === 1) {
              clickAndValidateBar(secondHalf[0]);
            } else {
              checkBars(secondHalf);
            }
          } else {
            if (firstHalf.length === 1) {
              clickAndValidateBar(firstHalf[0]);
            } else {
              checkBars(firstHalf);
            }
          }
        });
    }
  });
});
