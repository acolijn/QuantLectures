const chapter3 = {
    id: 3,
    title: "Waarschijnlijkheid",
    subtitle: "Discrete en continue kansverdelingen, verwachtingswaarden, variantie (Griffiths §1.3)",
    formulas: [
      { name: "Normering (discreet)", latex: "\\sum_{j} P(j) = 1" },
      { name: "Verwachtingswaarde (discreet)", latex: "\\langle j \\rangle = \\sum_{j} j\\, P(j)" },
      { name: "Verwachtingswaarde van $f(j)$", latex: "\\langle f(j) \\rangle = \\sum_{j} f(j)\\, P(j)" },
      { name: "Variantie (discreet)", latex: "\\sigma^2 = \\langle j^2 \\rangle - \\langle j \\rangle^2" },
      { name: "Standaardafwijking", latex: "\\sigma = \\sqrt{\\langle j^2 \\rangle - \\langle j \\rangle^2}" },
      { name: "Normering (continu)", latex: "\\int_{-\\infty}^{\\infty} \\rho(x)\\, dx = 1" },
      { name: "Verwachtingswaarde (continu)", latex: "\\langle x \\rangle = \\int_{-\\infty}^{\\infty} x\\, \\rho(x)\\, dx" },
      { name: "Verwachtingswaarde van $f(x)$", latex: "\\langle f(x) \\rangle = \\int_{-\\infty}^{\\infty} f(x)\\, \\rho(x)\\, dx" },
      { name: "Variantie (continu)", latex: "\\sigma^2 = \\langle x^2 \\rangle - \\langle x \\rangle^2" },
    ],
    concepts: [
      {
        title: "Discrete kansverdelingen (Griffiths §1.3)",
        content: "Griffiths introduceert waarschijnlijkheid met een concreet voorbeeld: stel je meet de leeftijd van een groep van $N$ personen. Als $N(j)$ het aantal personen met leeftijd $j$ is, dan is de waarschijnlijkheid om een willekeurig persoon met leeftijd $j$ te kiezen:\n\n$$P(j) = \\frac{N(j)}{N}$$\n\nDit is een discrete kansverdeling. De waarden van $j$ zijn apart (bijv. gehele getallen), en de kansen moeten optellen tot 1:\n\n$$\\sum_{j=0}^{\\infty} P(j) = 1$$\n\nDit is de normeringsvoorwaarde voor discrete verdelingen."
      },
      {
        title: "Verwachtingswaarde (discreet)",
        content: "De verwachtingswaarde (of het gemiddelde) van $j$ is:\n\n$$\\langle j \\rangle = \\sum_{j} j\\, P(j)$$\n\nDit is het gewogen gemiddelde: elke waarde $j$ wordt gewogen met zijn waarschijnlijkheid. Belangrijk: $\\langle j \\rangle$ hoeft zelf geen mogelijke uitkomst te zijn! Als de leeftijdsverdeling pieken heeft bij 20 en 40, kan $\\langle j \\rangle = 30$ zijn — maar niemand is 30.\n\nAlgemener geldt voor een willekeurige functie $f(j)$:\n\n$$\\langle f(j) \\rangle = \\sum_{j} f(j)\\, P(j)$$"
      },
      {
        title: "Variantie en standaardafwijking (discreet)",
        content: "De variantie $\\sigma^2$ kwantificeert de spreiding van de verdeling rond het gemiddelde. De afwijking van een individuele meting is $\\Delta j = j - \\langle j \\rangle$. Het gemiddelde van $\\Delta j$ is altijd nul (positieve en negatieve afwijkingen heffen op), dus gebruiken we het kwadraat:\n\n$$\\sigma^2 = \\langle (\\Delta j)^2 \\rangle = \\langle (j - \\langle j \\rangle)^2 \\rangle$$\n\nDit is equivalent aan de handige rekenregel:\n\n$$\\sigma^2 = \\langle j^2 \\rangle - \\langle j \\rangle^2$$\n\nDe standaardafwijking is $\\sigma = \\sqrt{\\sigma^2}$. Een kleine $\\sigma$ betekent dat de verdeling smal is (waarden liggen dicht bij het gemiddelde); een grote $\\sigma$ betekent een brede verdeling.\n\nBelangrijk: $\\sigma^2 \\geq 0$ altijd, en $\\sigma = 0$ alleen als elke meting exact dezelfde waarde geeft."
      },
      {
        title: "Continue kansverdelingen (Griffiths §1.3)",
        content: "Voor continue variabelen (zoals positie $x$) vervangen we de som door een integraal en de kansverdeling $P(j)$ door een kansdichtheid $\\rho(x)$:\n\n$$\\rho(x)\\,dx = \\text{kans om de variabele tussen } x \\text{ en } x+dx \\text{ te vinden}$$\n\nDe normeringsvoorwaarde wordt:\n\n$$\\int_{-\\infty}^{\\infty} \\rho(x)\\,dx = 1$$\n\nEn verwachtingswaarden worden:\n\n$$\\langle x \\rangle = \\int_{-\\infty}^{\\infty} x\\,\\rho(x)\\,dx, \\qquad \\langle f(x) \\rangle = \\int_{-\\infty}^{\\infty} f(x)\\,\\rho(x)\\,dx$$\n\nDe variantie is analoog: $\\sigma^2 = \\langle x^2 \\rangle - \\langle x \\rangle^2$."
      },
      {
        title: "Verband met de quantummechanica",
        content: "In de QM speelt $|\\Psi(x,t)|^2$ de rol van kansdichtheid $\\rho(x)$. Alle formules uit de kansrekening vertalen direct:\n\n- Normering: $\\int |\\Psi|^2\\,dx = 1$\n- Verwachtingswaarde positie: $\\langle x \\rangle = \\int x\\,|\\Psi|^2\\,dx$\n- Verwachtingswaarde van $f(x)$: $\\langle f(x) \\rangle = \\int f(x)\\,|\\Psi|^2\\,dx$\n- Spreiding: $\\sigma_x^2 = \\langle x^2 \\rangle - \\langle x \\rangle^2$\n\nDe verwachtingswaarde $\\langle x \\rangle$ is het gemiddelde van vele metingen aan identiek geprepareerde systemen (een ensemble). Het is NIET het gemiddelde van herhaalde metingen aan hetzelfde deeltje — na elke meting verandert de golffunctie door collapse!"
      },
    ],
    exercises: [
      {
        title: "Discrete kansverdeling: leeftijdsvoorbeeld",
        description: "We oefenen met de basisformules voor discrete kansverdelingen aan de hand van een concreet voorbeeld, vergelijkbaar met Griffiths §1.3.",
        steps: [
          {
            question: "In een groep van $N = 10$ personen zijn de leeftijden als volgt:\n\n$$\\begin{array}{c|ccccc} j & 14 & 15 & 22 & 24 & 25 \\\\ \\hline N(j) & 1 & 1 & 3 & 2 & 3 \\end{array}$$\n\nBereken $P(j)$ voor elke leeftijd en verifieer dat de normering klopt.",
            hints: [
              "$P(j) = N(j)/N$ met $N = 10$.",
              "Tel alle $P(j)$ op om te controleren dat $\\sum P(j) = 1$."
            ],
            answer: ["$P(14) = 0.1$", "$P(15) = 0.1$", "$P(22) = 0.3$", "$P(24) = 0.2$", "$P(25) = 0.3$"],
            solution: "$$P(14) = \\frac{1}{10}, \\quad P(15) = \\frac{1}{10}, \\quad P(22) = \\frac{3}{10}, \\quad P(24) = \\frac{2}{10}, \\quad P(25) = \\frac{3}{10}$$\nControle: $\\frac{1+1+3+2+3}{10} = \\frac{10}{10} = 1$ ✓"
          },
          {
            question: "Bereken de verwachtingswaarde $\\langle j \\rangle$ van de leeftijd.",
            hints: [
              "$\\langle j \\rangle = \\sum_j j\\, P(j)$.",
              "Bereken elk product $j \\cdot P(j)$ en tel op."
            ],
            answer: "$\\langle j \\rangle = 21.4$",
            solution: "$$\\langle j \\rangle = 14 \\cdot \\frac{1}{10} + 15 \\cdot \\frac{1}{10} + 22 \\cdot \\frac{3}{10} + 24 \\cdot \\frac{2}{10} + 25 \\cdot \\frac{3}{10}$$\n$$= 1{,}4 + 1{,}5 + 6{,}6 + 4{,}8 + 7{,}5 = 21{,}4$$\nMerk op: niemand in de groep is precies 21,4 jaar — de verwachtingswaarde is geen mogelijke uitkomst!"
          },
          {
            question: "Bereken $\\langle j^2 \\rangle$ en gebruik dit om de variantie $\\sigma^2 = \\langle j^2 \\rangle - \\langle j \\rangle^2$ en de standaardafwijking $\\sigma$ te vinden.",
            hints: [
              "$\\langle j^2 \\rangle = \\sum_j j^2\\, P(j)$.",
              "Je hebt $\\langle j \\rangle = 21{,}4$ al berekend, dus $\\langle j \\rangle^2 = 457{,}96$.",
              "$\\sigma = \\sqrt{\\sigma^2}$."
            ],
            answer: ["$\\langle j^2 \\rangle = 472.2$", "$\\sigma^2 = 14.24$", "$\\sigma \\approx 3.77$"],
            solution: "$$\\langle j^2 \\rangle = 14^2 \\cdot \\frac{1}{10} + 15^2 \\cdot \\frac{1}{10} + 22^2 \\cdot \\frac{3}{10} + 24^2 \\cdot \\frac{2}{10} + 25^2 \\cdot \\frac{3}{10}$$\n$$= 19{,}6 + 22{,}5 + 145{,}2 + 115{,}2 + 187{,}5 = 472{,}2 - 17{,}8 + 17{,}8 = 472{,}2$$\n\nVariantie:\n$$\\sigma^2 = 472{,}2 - (21{,}4)^2 = 472{,}2 - 457{,}96 = 14{,}24$$\n\nStandaardafwijking:\n$$\\sigma = \\sqrt{14{,}24} \\approx 3{,}77$$\n\nDus de leeftijden liggen gemiddeld ongeveer 3,8 jaar van het gemiddelde af."
          },
        ],
      },
      {
        title: "Van discreet naar continu: de uniforme verdeling",
        description: "We passen de formules voor continue kansverdelingen toe op een eenvoudige uniforme verdeling en vergelijken met het discrete geval.",
        steps: [
          {
            question: "Beschouw een continue kansdichtheid $\\rho(x) = A$ voor $0 \\leq x \\leq L$ en $\\rho(x) = 0$ elders. Bepaal de constante $A$ uit de normeringsvoorwaarde.",
            hints: [
              "De normeringsvoorwaarde is $\\int_{-\\infty}^{\\infty} \\rho(x)\\,dx = 1$.",
              "Omdat $\\rho = 0$ buiten $[0, L]$ wordt dit $\\int_0^L A\\,dx = 1$."
            ],
            answer: "$A = 1/L$",
            solution: "$$\\int_0^L A\\,dx = A \\cdot L = 1 \\implies A = \\frac{1}{L}$$\nDit is de uniforme verdeling op $[0, L]$: elke positie is even waarschijnlijk."
          },
          {
            question: "Bereken $\\langle x \\rangle$ en $\\langle x^2 \\rangle$ voor deze uniforme verdeling.",
            hints: [
              "$\\langle x \\rangle = \\int_0^L x \\cdot \\frac{1}{L}\\,dx$.",
              "$\\langle x^2 \\rangle = \\int_0^L x^2 \\cdot \\frac{1}{L}\\,dx$.",
              "Gebruik $\\int_0^L x\\,dx = L^2/2$ en $\\int_0^L x^2\\,dx = L^3/3$."
            ],
            answer: "$\\langle x \\rangle = L/2$, $\\langle x^2 \\rangle = L^2/3$",
            solution: "$$\\langle x \\rangle = \\frac{1}{L}\\int_0^L x\\,dx = \\frac{1}{L} \\cdot \\frac{L^2}{2} = \\frac{L}{2}$$\n$$\\langle x^2 \\rangle = \\frac{1}{L}\\int_0^L x^2\\,dx = \\frac{1}{L} \\cdot \\frac{L^3}{3} = \\frac{L^2}{3}$$\nHet gemiddelde $L/2$ is precies het midden — logisch voor een uniforme verdeling."
          },
          {
            question: "Bereken de standaardafwijking $\\sigma$ en druk deze uit als een fractie van $L$.",
            hints: [
              "$\\sigma^2 = \\langle x^2 \\rangle - \\langle x \\rangle^2$.",
              "Vul de bekende waarden in.",
              "$\\sigma = \\sqrt{\\sigma^2}$."
            ],
            answer: "$\\sigma = \\frac{L}{2\\sqrt{3}} \\approx 0{,}289\\,L$",
            solution: "$$\\sigma^2 = \\frac{L^2}{3} - \\left(\\frac{L}{2}\\right)^2 = \\frac{L^2}{3} - \\frac{L^2}{4} = \\frac{L^2}{12}$$\n$$\\sigma = \\frac{L}{\\sqrt{12}} = \\frac{L}{2\\sqrt{3}} \\approx 0{,}289\\,L$$\nDe spreiding is ongeveer 29% van de intervalbreedte — een kenmerkend resultaat voor de uniforme verdeling."
          },
        ],
      },
      {
        title: "De variantie-identiteit bewijzen",
        description: "We bewijzen de handige rekenregel $\\sigma^2 = \\langle j^2 \\rangle - \\langle j \\rangle^2$ die Griffiths afleidt in §1.3.",
        steps: [
          {
            question: "Begin met de definitie $\\sigma^2 = \\langle (j - \\langle j \\rangle)^2 \\rangle$. Werk het kwadraat uit.",
            hints: [
              "$(j - \\langle j \\rangle)^2 = j^2 - 2j\\langle j \\rangle + \\langle j \\rangle^2$.",
              "Neem van elk van de drie termen de verwachtingswaarde."
            ],
            answer: "$\\sigma^2 = \\langle j^2 \\rangle - 2\\langle j \\rangle\\langle j \\rangle + \\langle j \\rangle^2$",
            solution: "$$\\sigma^2 = \\langle (j - \\langle j \\rangle)^2 \\rangle = \\langle j^2 - 2j\\langle j \\rangle + \\langle j \\rangle^2 \\rangle$$\nDe verwachtingswaarde is lineair, dus:\n$$= \\langle j^2 \\rangle - 2\\langle j \\rangle \\langle j \\rangle + \\langle j \\rangle^2$$\nHierbij is $\\langle j \\rangle$ een constante, dus $\\langle 2j\\langle j \\rangle \\rangle = 2\\langle j \\rangle \\langle j \\rangle$ en $\\langle \\langle j \\rangle^2 \\rangle = \\langle j \\rangle^2$."
          },
          {
            question: "Vereenvoudig het resultaat tot de bekende identiteit.",
            hints: [
              "Combineer de laatste twee termen: $-2\\langle j \\rangle^2 + \\langle j \\rangle^2 = -\\langle j \\rangle^2$."
            ],
            answer: "$\\sigma^2 = \\langle j^2 \\rangle - \\langle j \\rangle^2$",
            solution: "$$\\sigma^2 = \\langle j^2 \\rangle - 2\\langle j \\rangle^2 + \\langle j \\rangle^2 = \\langle j^2 \\rangle - \\langle j \\rangle^2$$\nDit is de variantie-identiteit. Deze is in de praktijk veel handiger dan de definitie, omdat je $\\langle j^2 \\rangle$ en $\\langle j \\rangle$ apart kunt berekenen.\n\nMerk op: omdat $\\sigma^2 \\geq 0$ volgt hieruit dat $\\langle j^2 \\rangle \\geq \\langle j \\rangle^2$ — altijd!"
          },
        ],
      },
    ],
    quiz: [
      {
        question: "Voor een discrete kansverdeling geldt $\\sum_j P(j) = 1$. Wat is het continue analogon?",
        options: [
          "$\\int \\rho(x)\\,dx = 0$",
          "$\\int \\rho(x)\\,dx = 1$",
          "$\\rho(x) = 1$ overal",
          "$\\rho(x) \\leq 1$ overal"
        ],
        correct: 1,
        explanation: "De normeringsvoorwaarde voor continue verdelingen is $\\int_{-\\infty}^{\\infty} \\rho(x)\\,dx = 1$, het directe analogon van $\\sum P(j) = 1$."
      },
      {
        question: "De verwachtingswaarde $\\langle j \\rangle$ van een discrete verdeling is:",
        options: [
          "De meest voorkomende waarde (modus)",
          "Het gewogen gemiddelde $\\sum j\\,P(j)$",
          "De middelste waarde (mediaan)",
          "De grootste waarde van $j$"
        ],
        correct: 1,
        explanation: "De verwachtingswaarde is het gewogen gemiddelde, waarbij elke uitkomst $j$ gewogen wordt met zijn waarschijnlijkheid $P(j)$."
      },
      {
        question: "De verwachtingswaarde $\\langle j \\rangle$:",
        options: [
          "Moet altijd een mogelijke uitkomst zijn",
          "Hoeft geen mogelijke uitkomst te zijn",
          "Is altijd een geheel getal",
          "Is altijd positief"
        ],
        correct: 1,
        explanation: "De verwachtingswaarde is een gewogen gemiddelde en hoeft zelf geen mogelijke uitkomst te zijn. Bijvoorbeeld bij een eerlijke dobbelsteen: $\\langle j \\rangle = 3{,}5$."
      },
      {
        question: "Welke uitdrukking is equivalent aan de variantie $\\sigma^2$?",
        options: [
          "$\\langle j \\rangle^2 - \\langle j^2 \\rangle$",
          "$\\langle j^2 \\rangle - \\langle j \\rangle^2$",
          "$\\langle j \\rangle - \\langle j^2 \\rangle$",
          "$\\sqrt{\\langle j^2 \\rangle - \\langle j \\rangle^2}$"
        ],
        correct: 1,
        explanation: "De variantie-identiteit is $\\sigma^2 = \\langle j^2 \\rangle - \\langle j \\rangle^2$. Let op de volgorde! De laatste optie is de standaardafwijking $\\sigma$, niet de variantie $\\sigma^2$."
      },
      {
        question: "Als alle metingen exact dezelfde waarde opleveren, dan is $\\sigma$:",
        options: [
          "Oneindig",
          "Gelijk aan $\\langle j \\rangle$",
          "Nul",
          "Ongedefinieerd"
        ],
        correct: 2,
        explanation: "Als alle uitkomsten gelijk zijn, is er geen spreiding: $\\langle j^2 \\rangle = \\langle j \\rangle^2$, dus $\\sigma^2 = 0$ en $\\sigma = 0$."
      },
      {
        question: "In de quantummechanica speelt de rol van kansdichtheid $\\rho(x)$:",
        options: [
          "$\\Psi(x,t)$",
          "$|\\Psi(x,t)|^2$",
          "$\\Psi^*(x,t)$",
          "$\\text{Re}(\\Psi(x,t))$"
        ],
        correct: 1,
        explanation: "Volgens Born's statistische interpretatie is $|\\Psi(x,t)|^2$ de kansdichtheid. Alle kansrekenformules passen we toe met $\\rho(x) = |\\Psi|^2$."
      },
      {
        question: "De standaardafwijking $\\sigma_x$ in de QM kwantificeert:",
        options: [
          "De onzekerheid in de energie",
          "De spreiding in positiemetingen aan een ensemble van identieke systemen",
          "De snelheid van het deeltje",
          "De breedte van de potentiaalput"
        ],
        correct: 1,
        explanation: "$\\sigma_x = \\sqrt{\\langle x^2 \\rangle - \\langle x \\rangle^2}$ is de spreiding in positiemetingen. Een kleine $\\sigma_x$ betekent een goed gelokaliseerd deeltje."
      },
    ],
};

export default chapter3;
