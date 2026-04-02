const chapter8 = {
    id: 8,
    title: "De Harmonische Oscillator",
    subtitle: "Ladderoperatoren, energieniveaus, nulpuntsenergie",
    formulas: [
      { name: "Potentiaal", latex: "V(x) = \\frac{1}{2}m\\omega^2 x^2" },
      { name: "Energieniveaus", latex: "E_n = \\left(n + \\frac{1}{2}\\right)\\hbar\\omega, \\quad n = 0, 1, 2, \\ldots" },
      { name: "Ladderoperatoren", latex: "\\hat{a}_{\\pm} = \\frac{1}{\\sqrt{2\\hbar m\\omega}}(\\mp i\\hat{p} + m\\omega\\hat{x})" },
      { name: "Commutator", latex: "[\\hat{a}_-, \\hat{a}_+] = 1" },
      { name: "Hamiltoniaan", latex: "\\hat{H} = \\hbar\\omega\\left(\\hat{a}_+\\hat{a}_- + \\frac{1}{2}\\right)" },
    ],
    concepts: [
      {
        title: "Equidistante energieniveaus",
        content: "De energieniveaus van de harmonische oscillator zijn equidistant: het verschil is altijd $\\hbar\\omega$. De nulpuntsenergie is $E_0 = \\frac{1}{2}\\hbar\\omega$."
      },
      {
        title: "Ladder (ophef- en verlagings-) operatoren",
        content: "$\\hat{a}_+$ (ophefoperator) brengt het systeem naar een hogere eigentoestand: $\\hat{a}_+|n\\rangle \\propto |n+1\\rangle$. $\\hat{a}_-$ (verlagingsoperator) verlaagt: $\\hat{a}_-|n\\rangle \\propto |n-1\\rangle$. De grondtoestand $|0\\rangle$ wordt gedefinieerd door $\\hat{a}_-|0\\rangle = 0$."
      },
      {
        title: "Grondtoestand",
        content: "De grondtoestand $\\psi_0(x) = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4} e^{-m\\omega x^2/2\\hbar}$ is een Gaussische functie. Alle hogere toestanden worden verkregen door herhaalde toepassing van $\\hat{a}_+$."
      },
    ],
    quiz: [
      {
        question: "Het energiespectrum van de harmonische oscillator is:",
        options: [
          "Continu",
          "Evenredig met $n^2$",
          "Equidistant met tussenafstand $\\hbar\\omega$",
          "Evenredig met $1/n^2$"
        ],
        correct: 2,
        explanation: "$E_n = (n + 1/2)\\hbar\\omega$. De afstand tussen opeenvolgende niveaus is altijd $\\hbar\\omega$."
      },
      {
        question: "Wat is het effect van de ophefoperator $\\hat{a}_+$ op toestand $|n\\rangle$?",
        options: [
          "$\\hat{a}_+|n\\rangle = 0$",
          "$\\hat{a}_+|n\\rangle \\propto |n+1\\rangle$",
          "$\\hat{a}_+|n\\rangle \\propto |n-1\\rangle$",
          "$\\hat{a}_+|n\\rangle = E_n|n\\rangle$"
        ],
        correct: 1,
        explanation: "$\\hat{a}_+$ verhoogt het kwantumgetal: $\\hat{a}_+|n\\rangle = \\sqrt{n+1}|n+1\\rangle$."
      },
      {
        question: "Wat is de nulpuntsenergie van de harmonische oscillator?",
        options: ["$0$", "$\\hbar\\omega$", "$\\frac{1}{2}\\hbar\\omega$", "$\\frac{3}{2}\\hbar\\omega$"],
        correct: 2,
        explanation: "$E_0 = \\frac{1}{2}\\hbar\\omega$. Dit is de minimale energie; het deeltje is nooit volledig in rust."
      },
      {
        question: "De grondtoestand golffunctie $\\psi_0(x)$ van de harmonische oscillator is:",
        options: [
          "Een sinusfunctie",
          "Een Gaussische functie",
          "Een exponentieel afnemende functie",
          "Een constante"
        ],
        correct: 1,
        explanation: "$\\psi_0 \\propto e^{-m\\omega x^2/(2\\hbar)}$, een Gaussische (klokvormige) functie."
      },
    ],
};

export default chapter8;
