const chapter11 = {
  "id": 11,
  "title": "Quantum Entanglement",
  "subtitle": "Basisconcepten van quantumverstrengeling, superpositie, metingen en niet-lokale correlaties op eerstejaars natuurkunde niveau.",
  "formulas": [
    {
      "latex": "|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle",
      "name": "Toestand van een qubit"
    },
    {
      "latex": "|\\alpha|^{2} + |\\beta|^{2} = 1",
      "name": "Normalisatievoorwaarde"
    },
    {
      "latex": "|\\Phi^{+}\\rangle = \\frac{1}{\\sqrt{2}}\\left(|00\\rangle + |11\\rangle\\right)",
      "name": "Bell-toestand"
    },
    {
      "latex": "|\\Psi^{-}\\rangle = \\frac{1}{\\sqrt{2}}\\left(|01\\rangle - |10\\rangle\\right)",
      "name": "Singlet-toestand"
    },
    {
      "latex": "|\\psi\\rangle = |a\\rangle \\otimes |b\\rangle",
      "name": "Tensorproduct"
    },
    {
      "latex": "P(i) = |\\langle i|\\psi\\rangle|^{2}",
      "name": "Meetkans"
    },
    {
      "latex": "\\langle \\psi|\\hat{A}|\\psi\\rangle",
      "name": "Verwachtingswaarde"
    },
    {
      "latex": "i\\hbar \\frac{\\partial}{\\partial t}|\\psi\\rangle = \\hat{H}|\\psi\\rangle",
      "name": "Schrödingervergelijking"
    }
  ],
  "concepts": [
    {
      "content": "Quantum entanglement, of quantumverstrengeling, is een fenomeen waarbij twee of meer quantumdeeltjes een gezamenlijke toestand delen die niet opgesplitst kan worden in afzonderlijke toestanden. Een bekend voorbeeld is de Bell-toestand $$|\\Phi^{+}\\rangle = \\frac{1}{\\sqrt{2}}\\left(|00\\rangle + |11\\rangle\\right).$$ Wanneer een meting wordt uitgevoerd aan één van de deeltjes, ligt de toestand van het andere deeltje onmiddellijk vast, ongeacht de afstand tussen beide deeltjes.",
      "title": "Wat is quantum entanglement?"
    },
    {
      "content": "In de quantummechanica kan een systeem zich in meerdere toestanden tegelijk bevinden. Een qubit wordt beschreven door $$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle.$$ De complexe coëfficiënten $\\alpha$ en $\\beta$ bepalen de kans om respectievelijk $|0\\rangle$ of $|1\\rangle$ te meten. De totale kans moet gelijk zijn aan $1$, dus geldt $$|\\alpha|^{2} + |\\beta|^{2} = 1.$$ Superpositie vormt de basis voor quantumverstrengeling.",
      "title": "Superpositie van toestanden"
    },
    {
      "content": "Wanneer twee quantumsystemen gecombineerd worden, gebruiken we een tensorproduct om de gezamenlijke toestand te beschrijven: $$|\\psi\\rangle = |a\\rangle \\otimes |b\\rangle.$$ Sommige samengestelde toestanden kunnen niet geschreven worden als een product van afzonderlijke toestanden. Zulke toestanden noemen we verstrengeld. In dat geval is de informatie verdeeld over het volledige systeem.",
      "title": "Tensorproducten en samengestelde systemen"
    },
    {
      "content": "Een quantumtoestand bevat kansen voor verschillende meetuitkomsten. De kans om toestand $|i\\rangle$ te meten wordt gegeven door $$P(i) = |\\langle i|\\psi\\rangle|^{2}.$$ Wanneer een meting wordt uitgevoerd, stort de golffunctie in naar één specifieke toestand. Bij verstrengelde systemen zijn meetresultaten sterk gecorreleerd.",
      "title": "Metingen in de quantummechanica"
    },
    {
      "content": "Einstein, Podolsky en Rosen stelden in 1935 de EPR-paradox voor om te laten zien dat quantummechanica volgens hen onvolledig was. Einstein vond het vreemd dat verstrengelde systemen directe correlaties vertonen over grote afstanden. Later bewees John Bell dat lokale verborgen variabelen niet alle voorspellingen van quantummechanica kunnen verklaren. Experimenten bevestigen de voorspellingen van quantummechanica.",
      "title": "EPR-paradox en Bell"
    },
    {
      "content": "Bell-toestanden zijn maximaal verstrengelde toestanden van twee qubits. Een voorbeeld is $$|\\Psi^{-}\\rangle = \\frac{1}{\\sqrt{2}}\\left(|01\\rangle - |10\\rangle\\right).$$ Deze toestanden spelen een belangrijke rol in quantumcommunicatie, quantumcryptografie en quantumcomputers.",
      "title": "Bell-toestanden"
    },
    {
      "content": "Quantumverstrengeling wordt gebruikt in moderne technologieën zoals quantumcomputers en quantumcryptografie. In quantumcomputers kunnen verstrengelde qubits parallel informatie verwerken. In quantumcryptografie maakt entanglement veilige communicatie mogelijk, omdat afluisteren de quantumtoestand verandert.",
      "title": "Toepassingen van entanglement"
    }
  ],
  "exercises": [],
  "quiz": [
    {
      "answer": 1,
      "options": [
        "Twee deeltjes met volledig onafhankelijke toestanden",
        "Een gezamenlijke quantumtoestand van meerdere deeltjes",
        "Een klassiek mechanisch systeem",
        "Een deeltje zonder energie"
      ],
      "question": "Wat beschrijft quantum entanglement het beste?"
    },
    {
      "answer": 1,
      "options": [
        "E = mc^{2}",
        "|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle",
        "F = ma",
        "pV = nRT"
      ],
      "question": "Welke vergelijking beschrijft een qubit in superpositie?"
    },
    {
      "answer": 0,
      "options": [
        "De golffunctie stort in naar één toestand",
        "De massa van het deeltje verdubbelt",
        "Het deeltje verdwijnt",
        "De energie wordt altijd nul"
      ],
      "question": "Wat gebeurt er bij een quantummeting?"
    },
    {
      "answer": 2,
      "options": [
        "|0\\rangle",
        "|1\\rangle",
        "|\\Phi^{+}\\rangle = \\frac{1}{\\sqrt{2}}\\left(|00\\rangle + |11\\rangle\\right)",
        "|a\\rangle \\otimes |b\\rangle"
      ],
      "question": "Welke toestand is een Bell-toestand?"
    },
    {
      "answer": 1,
      "options": [
        "Omdat het zwaartekracht uitschakelt",
        "Omdat verstrengelde qubits gezamenlijk informatie verwerken",
        "Omdat klassieke bits sneller worden",
        "Omdat het temperatuur verlaagt"
      ],
      "question": "Waarom is quantum entanglement belangrijk voor quantumcomputers?"
    }
  ]
};

export default chapter11;
