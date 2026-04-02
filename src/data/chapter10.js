const chapter10 = {
    id: 10,
    title: "Eindige Potentiaalbarrières",
    subtitle: "Tunneling, reflectie- en transmissiecoëfficiënten",
    formulas: [
      { name: "Transmissiecoëfficiënt", latex: "T = \\frac{|F|^2}{|A|^2}" },
      { name: "Reflectiecoëfficiënt", latex: "R = \\frac{|B|^2}{|A|^2}" },
      { name: "Behoud", latex: "R + T = 1" },
      { name: "Golfgetal (klassiek toegankelijk)", latex: "k = \\frac{\\sqrt{2m(E-V)}}{\\hbar}" },
      { name: "Vervalconstante (klassiek verboden)", latex: "\\kappa = \\frac{\\sqrt{2m(V-E)}}{\\hbar}" },
    ],
    concepts: [
      {
        title: "Quantumtunneling",
        content: "In de klassieke mechanica kan een deeltje met $E < V_0$ een barrière niet passeren. In de quantummechanica is er een niet-nul kans dat het deeltje 'tunnelt' door de barrière. De golffunctie dringt exponentieel door in het klassiek verboden gebied."
      },
      {
        title: "Randvoorwaarden",
        content: "Bij een potentiaalstap of -barrière moeten de golffunctie $\\psi$ en haar afgeleide $d\\psi/dx$ continu zijn op de grenzen. Dit leidt tot vergelijkingen voor de reflectie- en transmissiecoëfficiënten."
      },
      {
        title: "Exponentieel verval",
        content: "In het klassiek verboden gebied ($E < V$) is de golffunctie $\\psi \\propto e^{-\\kappa x}$. De tunnelkans neemt exponentieel af met de breedte en hoogte van de barrière."
      },
    ],
    quiz: [
      {
        question: "Bij quantumtunneling geldt:",
        options: [
          "Het deeltje wint energie om over de barrière te komen",
          "Het deeltje heeft een niet-nul kans om door de barrière te gaan, zelfs als $E < V_0$",
          "Het deeltje verliest altijd energie",
          "Tunneling is alleen mogelijk als $E > V_0$"
        ],
        correct: 1,
        explanation: "Tunneling is het quantummechanische verschijnsel dat een deeltje een klassiek verboden barrière kan passeren."
      },
      {
        question: "Als de breedte van een potentiaalbarrière verdubbelt, dan neemt de tunnelkans:",
        options: [
          "Lineair af",
          "Kwadratisch af",
          "Exponentieel af",
          "Niet af"
        ],
        correct: 2,
        explanation: "$T \\propto e^{-2\\kappa a}$, dus verdubbeling van $a$ leidt tot een exponentiële afname."
      },
      {
        question: "Welke voorwaarde geldt altijd bij een potentiaalstap?",
        options: [
          "$R = T$",
          "$R + T = 1$",
          "$R = 1$",
          "$T = 1$"
        ],
        correct: 1,
        explanation: "Behoud van waarschijnlijkheid eist $R + T = 1$: het deeltje wordt gereflecteerd of getransmitteerd."
      },
      {
        question: "In het klassiek verboden gebied ($E < V$) is de golffunctie:",
        options: [
          "Oscillerend (sinus/cosinus)",
          "Exponentieel afnemend",
          "Constant",
          "Nul"
        ],
        correct: 1,
        explanation: "De golffunctie is $\\propto e^{-\\kappa x}$ (exponentieel afnemend) in het klassiek verboden gebied."
      },
    ],
};

export default chapter10;
