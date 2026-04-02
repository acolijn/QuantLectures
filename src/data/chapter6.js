const chapter6 = {
    id: 6,
    title: "Stationaire Toestanden",
    subtitle: "Scheiding van variabelen, superpositie, tijdsevolutie",
    formulas: [
      { name: "Stationaire oplossing", latex: "\\Psi_n(x,t) = \\psi_n(x) \\, e^{-iE_n t/\\hbar}" },
      { name: "Algemene oplossing", latex: "\\Psi(x,t) = \\sum_n c_n \\psi_n(x) \\, e^{-iE_n t/\\hbar}" },
      { name: "Coëfficiënten", latex: "c_n = \\int \\psi_n(x)^* \\, \\Psi(x,0) \\, dx" },
      { name: "Kanssommen", latex: "\\sum_n |c_n|^2 = 1" },
    ],
    concepts: [
      {
        title: "Scheiding van variabelen",
        content: "Door $\\Psi(x,t) = \\psi(x)\\phi(t)$ te substitueren in de Schrödingervergelijking, krijgen we twee afzonderlijke vergelijkingen. De tijdsafhankelijkheid is altijd $\\phi(t) = e^{-iEt/\\hbar}$."
      },
      {
        title: "Superpositie",
        content: "De algemene oplossing is een lineaire combinatie van stationaire toestanden: $\\Psi = \\sum c_n \\psi_n e^{-iE_n t/\\hbar}$. Het kwadraat $|c_n|^2$ geeft de kans om energie $E_n$ te meten."
      },
      {
        title: "Tijdsevolutie",
        content: "Elke energiecomponent oscilleert met zijn eigen frequentie $\\omega_n = E_n/\\hbar$. De kansdichtheid $|\\Psi|^2$ kan daardoor tijdsafhankelijk zijn, terwijl de energie-eigenwaarden constant blijven."
      },
    ],
    quiz: [
      {
        question: "In een stationaire toestand, is de kansdichtheid $|\\Psi(x,t)|^2$ tijdsafhankelijk?",
        options: [
          "Ja, het oscilleert met frequentie $E/\\hbar$",
          "Nee, de tijdsafhankelijkheid valt weg in $|\\Psi|^2$",
          "Alleen voor gebonden toestanden",
          "Alleen als $V(x) = 0$"
        ],
        correct: 1,
        explanation: "$|\\Psi_n|^2 = |\\psi_n|^2 |e^{-iE_n t/\\hbar}|^2 = |\\psi_n|^2$, dus de kansdichtheid is tijdsonafhankelijk."
      },
      {
        question: "Als een deeltje zich in de toestand $\\Psi = c_1\\psi_1 e^{-iE_1t/\\hbar} + c_2\\psi_2 e^{-iE_2t/\\hbar}$ bevindt, wat is de kans om $E_1$ te meten?",
        options: ["$c_1$", "$|c_1|^2$", "$c_1^2$", "$|c_1|$"],
        correct: 1,
        explanation: "De kans om energie $E_n$ te meten is $|c_n|^2$ (Born's regel)."
      },
      {
        question: "Na een energiemeting die $E_n$ oplevert, bevindt het systeem zich in:",
        options: [
          "Dezelfde superpositie als ervoor",
          "De toestand $\\psi_n$ (collapse van de golffunctie)",
          "De grondtoestand",
          "Een willekeurige eigentoestand"
        ],
        correct: 1,
        explanation: "Na een meting 'collapst' de golffunctie naar de gemeten eigentoestand $\\psi_n$."
      },
    ],
};

export default chapter6;
