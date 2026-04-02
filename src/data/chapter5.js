const chapter5 = {
    id: 5,
    title: "Operatoren en Verwachtingswaarden",
    subtitle: "Impulsoperator, commutatoren, onzekerheidsprincipe",
    formulas: [
      { name: "Impulsoperator", latex: "\\hat{p} = -i\\hbar \\frac{\\partial}{\\partial x}" },
      { name: "Verwachtingswaarde impuls", latex: "\\langle p \\rangle = -i\\hbar \\int \\Psi^* \\frac{\\partial \\Psi}{\\partial x} dx" },
      { name: "Hamiltoniaan", latex: "\\hat{H} = \\frac{\\hat{p}^2}{2m} + V(x) = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2}{\\partial x^2} + V(x)" },
      { name: "Commutator", latex: "[\\hat{x}, \\hat{p}] = i\\hbar" },
      { name: "Onzekerheidsprincipe", latex: "\\sigma_x \\sigma_p \\geq \\frac{\\hbar}{2}" },
    ],
    concepts: [
      {
        title: "Operatoren in de quantummechanica",
        content: "Elke observabele correspondeert met een operator. Positie wordt gerepresenteerd door $\\hat{x} = x$ (vermenigvuldiging), en impuls door $\\hat{p} = -i\\hbar \\frac{\\partial}{\\partial x}$."
      },
      {
        title: "De commutator",
        content: "De commutator $[\\hat{A}, \\hat{B}] = \\hat{A}\\hat{B} - \\hat{B}\\hat{A}$ meet hoe twee operatoren van volgorde verwisselen. Als $[\\hat{A}, \\hat{B}] \\neq 0$, kunnen $A$ en $B$ niet simultaan scherp bepaald zijn."
      },
      {
        title: "Heisenbergs onzekerheidsprincipe",
        content: "Het is fundamenteel onmogelijk om positie en impuls tegelijkertijd exact te kennen: $\\sigma_x \\sigma_p \\geq \\hbar/2$. Dit is geen meetfout, maar een fundamentele eigenschap van de natuur."
      },
    ],
    quiz: [
      {
        question: "De impulsoperator in de positierepresentatie is:",
        options: [
          "$\\hat{p} = m\\hat{v}$",
          "$\\hat{p} = -i\\hbar \\frac{\\partial}{\\partial x}$",
          "$\\hat{p} = i\\hbar \\frac{\\partial}{\\partial x}$",
          "$\\hat{p} = \\hbar \\frac{\\partial^2}{\\partial x^2}$"
        ],
        correct: 1,
        explanation: "De impulsoperator is $\\hat{p} = -i\\hbar \\partial/\\partial x$ (let op het minteken!)."
      },
      {
        question: "Wat is $[\\hat{x}, \\hat{p}]$?",
        options: ["$0$", "$i\\hbar$", "$-i\\hbar$", "$\\hbar^2$"],
        correct: 1,
        explanation: "De canonieke commutator is $[\\hat{x}, \\hat{p}] = i\\hbar$. Dit is de basis van het onzekerheidsprincipe."
      },
      {
        question: "Het onzekerheidsprincipe stelt dat:",
        options: [
          "We positie en impuls niet tegelijk nauwkeurig genoeg kunnen meten door technische beperkingen",
          "Het product van de onzekerheden in positie en impuls altijd minstens $\\hbar/2$ is",
          "De onzekerheid in energie altijd oneindig is",
          "Alleen geldt voor microscopische deeltjes"
        ],
        correct: 1,
        explanation: "$\\sigma_x \\sigma_p \\geq \\hbar/2$ is een fundamenteel principe, geen meetbeperking."
      },
      {
        question: "Twee observabelen $A$ en $B$ kunnen simultaan scherp bepaald zijn als:",
        options: [
          "Ze dezelfde eenheden hebben",
          "Hun commutatoren nul is: $[\\hat{A}, \\hat{B}] = 0$",
          "Ze allebei Hermitisch zijn",
          "De golffunctie reëelwaardig is"
        ],
        correct: 1,
        explanation: "Commuterende observabelen delen eigentoestanden en kunnen tegelijk scherp bepaald zijn."
      },
    ],
};

export default chapter5;
