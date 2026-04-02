const chapter4 = {
    id: 4,
    title: "Normering en Behoud",
    subtitle: "Normeringsvoorwaarde, behoud van normering, waarschijnlijkheidsstroom (Griffiths §1.4)",
    formulas: [
      { name: "Normeringsvoorwaarde", latex: "\\int_{-\\infty}^{\\infty} |\\Psi(x,t)|^2 \\, dx = 1" },
      { name: "Behoud van normering", latex: "\\frac{d}{dt}\\int_{-\\infty}^{\\infty} |\\Psi(x,t)|^2\\,dx = 0" },
      { name: "Waarschijnlijkheidsstroom", latex: "J(x,t) = \\frac{\\hbar}{2mi}\\left(\\Psi^* \\frac{\\partial \\Psi}{\\partial x} - \\Psi \\frac{\\partial \\Psi^*}{\\partial x}\\right)" },
      { name: "Continuïteitsvergelijking", latex: "\\frac{\\partial \\rho}{\\partial t} + \\frac{\\partial J}{\\partial x} = 0" },
    ],
    concepts: [
      {
        title: "Normering van de golffunctie",
        content: "Aangezien het deeltje zich ergens moet bevinden, moet de totale waarschijnlijkheid gelijk zijn aan 1:\n\n$$\\int_{-\\infty}^{\\infty} |\\Psi(x,t)|^2\\,dx = 1$$\n\nDit heet de normeringsvoorwaarde. Niet elke oplossing van de SV is normeerbaar — de golffunctie moet voldoende snel naar nul gaan voor $x \\to \\pm\\infty$. Functies die aan deze eis voldoen noemen we vierkant-integreerbaar. Als $\\Psi$ een oplossing is van de SV, dan is $A\\Psi$ dat ook (lineariteit), dus we kunnen $A$ zo kiezen dat de normering klopt. De enige golffunctie die niet te normeren is, is $\\Psi = 0$ — maar die beschrijft geen deeltje."
      },
      {
        title: "Behoud van normering in de tijd (Griffiths §1.4)",
        content: "Een cruciale eigenschap van de Schrödingervergelijking: als $\\Psi$ genormeerd is op $t = 0$, dan blíjft het genormeerd voor alle $t > 0$. Het bewijs volgt uit de SV zelf. We berekenen:\n\n$$\\frac{d}{dt}\\int_{-\\infty}^{\\infty}|\\Psi|^2\\,dx = \\int_{-\\infty}^{\\infty}\\frac{\\partial}{\\partial t}|\\Psi|^2\\,dx$$\n\nMet de SV en zijn complex geconjugeerde vinden we $\\frac{\\partial|\\Psi|^2}{\\partial t} = -\\frac{\\partial J}{\\partial x}$ (de continuïteitsvergelijking), waar $J$ de waarschijnlijkheidsstroom is. Omdat $\\Psi \\to 0$ voor $x \\to \\pm\\infty$, verdwijnen de randtermen en is de afgeleide nul. Je hoeft dus maar één keer te normeren!"
      },
      {
        title: "De waarschijnlijkheidsstroom",
        content: "De waarschijnlijkheidsstroom $J(x,t)$ beschrijft de 'stroom' van waarschijnlijkheid door een punt $x$:\n\n$$J(x,t) = \\frac{\\hbar}{2mi}\\left(\\Psi^*\\frac{\\partial\\Psi}{\\partial x} - \\Psi\\frac{\\partial\\Psi^*}{\\partial x}\\right)$$\n\nSamen met de kansdichtheid $\\rho = |\\Psi|^2$ voldoet $J$ aan de continuïteitsvergelijking $\\frac{\\partial \\rho}{\\partial t} + \\frac{\\partial J}{\\partial x} = 0$. Dit is het quantummechanische analogon van behoud van lading in de elektrodynamica: waarschijnlijkheid wordt niet gecreëerd of vernietigd, maar stroomt van de ene plek naar de andere."
      },
    ],
    exercises: [
      {
        title: "Bewijs van behoud van normering",
        description: "We bewijzen dat als $\\Psi(x,t)$ genormeerd is op $t=0$, het genormeerd blíjft voor alle $t$ — een essentieel resultaat uit Griffiths §1.4.",
        steps: [
          {
            question: "We willen bewijzen dat $\\frac{d}{dt}\\int_{-\\infty}^{\\infty}|\\Psi|^2\\,dx = 0$. Schrijf als eerste stap $\\frac{\\partial}{\\partial t}|\\Psi|^2$ uit met de productregel, gegeven dat $|\\Psi|^2 = \\Psi^*\\Psi$.",
            hints: [
              "Gebruik de productregel: $\\frac{\\partial}{\\partial t}(\\Psi^*\\Psi) = \\frac{\\partial\\Psi^*}{\\partial t}\\Psi + \\Psi^*\\frac{\\partial\\Psi}{\\partial t}$.",
              "Je hebt uitdrukkingen nodig voor $\\frac{\\partial\\Psi}{\\partial t}$ en $\\frac{\\partial\\Psi^*}{\\partial t}$."
            ],
            answer: "$\\frac{\\partial}{\\partial t}|\\Psi|^2 = \\frac{\\partial\\Psi^*}{\\partial t}\\Psi + \\Psi^*\\frac{\\partial\\Psi}{\\partial t}$",
            solution: "$$\\frac{\\partial}{\\partial t}|\\Psi|^2 = \\frac{\\partial}{\\partial t}(\\Psi^*\\Psi) = \\frac{\\partial\\Psi^*}{\\partial t}\\Psi + \\Psi^*\\frac{\\partial\\Psi}{\\partial t}$$"
          },
          {
            question: "Gebruik de Schrödingervergelijking om $\\frac{\\partial\\Psi}{\\partial t}$ te substitueren. Schrijf ook de complex geconjugeerde van de SV op om $\\frac{\\partial\\Psi^*}{\\partial t}$ te vinden. (Neem aan dat $V$ reëel is.)",
            hints: [
              "De SV geeft: $\\frac{\\partial\\Psi}{\\partial t} = \\frac{1}{i\\hbar}\\left(-\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\Psi}{\\partial x^2} + V\\Psi\\right)$.",
              "Complex conjugeren: vervang $i \\to -i$ en $\\Psi \\to \\Psi^*$.",
              "Let op: $\\frac{1}{i} = -i$ en $\\frac{1}{-i} = i$."
            ],
            answer: "$\\frac{\\partial\\Psi}{\\partial t} = \\frac{i\\hbar}{2m}\\frac{\\partial^2\\Psi}{\\partial x^2} - \\frac{i}{\\hbar}V\\Psi$ en $\\frac{\\partial\\Psi^*}{\\partial t} = -\\frac{i\\hbar}{2m}\\frac{\\partial^2\\Psi^*}{\\partial x^2} + \\frac{i}{\\hbar}V\\Psi^*$",
            solution: "Uit de SV:\n$$\\frac{\\partial\\Psi}{\\partial t} = \\frac{i\\hbar}{2m}\\frac{\\partial^2\\Psi}{\\partial x^2} - \\frac{i}{\\hbar}V\\Psi$$\nComplex geconjugeerde (met $V$ reëel):\n$$\\frac{\\partial\\Psi^*}{\\partial t} = -\\frac{i\\hbar}{2m}\\frac{\\partial^2\\Psi^*}{\\partial x^2} + \\frac{i}{\\hbar}V\\Psi^*$$"
          },
          {
            question: "Substitueer beide uitdrukkingen in $\\frac{\\partial}{\\partial t}|\\Psi|^2$. Laat zien dat de $V$-termen wegvallen en dat het resultaat een totale afgeleide naar $x$ is, zodat je de continuïteitsvergelijking vindt.",
            hints: [
              "Na substitutie: de termen met $V$ zijn $-\\frac{i}{\\hbar}V|\\Psi|^2 + \\frac{i}{\\hbar}V|\\Psi|^2 = 0$.",
              "Er blijft over: $\\frac{i\\hbar}{2m}\\left(\\Psi^*\\frac{\\partial^2\\Psi}{\\partial x^2} - \\frac{\\partial^2\\Psi^*}{\\partial x^2}\\Psi\\right)$.",
              "Dit is gelijk aan $\\frac{\\partial}{\\partial x}\\left[\\frac{i\\hbar}{2m}\\left(\\Psi^*\\frac{\\partial\\Psi}{\\partial x} - \\frac{\\partial\\Psi^*}{\\partial x}\\Psi\\right)\\right]$. Verifieer dit!"
            ],
            answer: "$\\frac{\\partial|\\Psi|^2}{\\partial t} = \\frac{\\partial}{\\partial x}\\left[\\frac{i\\hbar}{2m}\\left(\\Psi^*\\frac{\\partial\\Psi}{\\partial x} - \\frac{\\partial\\Psi^*}{\\partial x}\\Psi\\right)\\right]$",
            solution: "Na substitutie en het wegvallen van de $V$-termen:\n$$\\frac{\\partial|\\Psi|^2}{\\partial t} = \\frac{i\\hbar}{2m}\\left(\\Psi^*\\frac{\\partial^2\\Psi}{\\partial x^2} - \\frac{\\partial^2\\Psi^*}{\\partial x^2}\\Psi\\right)$$\nDit herkennen we als een totale afgeleide:\n$$= \\frac{\\partial}{\\partial x}\\left[\\frac{i\\hbar}{2m}\\left(\\Psi^*\\frac{\\partial\\Psi}{\\partial x} - \\frac{\\partial\\Psi^*}{\\partial x}\\Psi\\right)\\right] = -\\frac{\\partial J}{\\partial x}$$\nDus: $\\frac{\\partial\\rho}{\\partial t} + \\frac{\\partial J}{\\partial x} = 0$ — de continuïteitsvergelijking."
          },
          {
            question: "Integreer de continuïteitsvergelijking over $x$ van $-\\infty$ tot $+\\infty$ en gebruik de randvoorwaarde $\\Psi \\to 0$ voor $x \\to \\pm\\infty$ om te concluderen dat de normering behouden is.",
            hints: [
              "De integraal van $\\frac{\\partial J}{\\partial x}$ over heel $\\mathbb{R}$ geeft $J(\\infty) - J(-\\infty)$.",
              "Omdat $\\Psi \\to 0$ voor $x \\to \\pm\\infty$, geldt ook $J \\to 0$ aan beide uiteinden.",
              "Dus $\\frac{d}{dt}\\int|\\Psi|^2 dx = 0$."
            ],
            answer: "$\\frac{d}{dt}\\int_{-\\infty}^{\\infty}|\\Psi|^2\\,dx = J(-\\infty) - J(\\infty) = 0$",
            solution: "Integreer de continuïteitsvergelijking:\n$$\\frac{d}{dt}\\int_{-\\infty}^{\\infty}|\\Psi|^2\\,dx = -\\int_{-\\infty}^{\\infty}\\frac{\\partial J}{\\partial x}\\,dx = -\\left[J(x)\\right]_{-\\infty}^{\\infty} = J(-\\infty) - J(\\infty)$$\nOmdat $\\Psi(x,t) \\to 0$ voor $x \\to \\pm\\infty$ (nodig voor normeerbaarheid), geldt $J \\to 0$ aan beide uiteinden. Dus:\n$$\\frac{d}{dt}\\int_{-\\infty}^{\\infty}|\\Psi|^2\\,dx = 0 \\quad \\checkmark$$\nDe normering is behouden voor alle tijden."
          },
        ],
      },
      {
        title: "Normering van een Gauss-golfpakket",
        description: "We normeren een Gauss-vormige golffunctie en berekenen de kansdichtheid. Dit is een schoolvoorbeeld van de normeringsprocedure.",
        steps: [
          {
            question: "Beschouw de golffunctie op $t = 0$:\n\n$$\\Psi(x,0) = A\\,e^{-\\lambda x^2}$$\n\nmet $\\lambda > 0$. Bereken $|\\Psi(x,0)|^2$.",
            hints: [
              "$A$ is een reële normeringsconstante en $e^{-\\lambda x^2}$ is reëel.",
              "Dus $|\\Psi|^2 = A^2\\,e^{-2\\lambda x^2}$."
            ],
            answer: "$|\\Psi(x,0)|^2 = A^2\\,e^{-2\\lambda x^2}$",
            solution: "Omdat $A$ en $e^{-\\lambda x^2}$ beide reëel zijn:\n$$|\\Psi(x,0)|^2 = \\Psi^*\\Psi = A^2\\,e^{-2\\lambda x^2}$$\nDit is een Gaussische functie met breedte $\\sim 1/\\sqrt{2\\lambda}$."
          },
          {
            question: "Pas de normeringsvoorwaarde toe: $\\int_{-\\infty}^{\\infty}|\\Psi|^2\\,dx = 1$. Gebruik de standaardintegraal $\\int_{-\\infty}^{\\infty}e^{-ax^2}dx = \\sqrt{\\pi/a}$ om $A$ te vinden.",
            hints: [
              "Je moet oplossen: $A^2\\int_{-\\infty}^{\\infty}e^{-2\\lambda x^2}\\,dx = 1$.",
              "Gebruik de Gauss-integraal met $a = 2\\lambda$.",
              "Los op naar $A$. Kies de positieve wortel."
            ],
            answer: "$A = \\left(\\frac{2\\lambda}{\\pi}\\right)^{1/4}$",
            solution: "$$A^2\\int_{-\\infty}^{\\infty}e^{-2\\lambda x^2}\\,dx = A^2\\sqrt{\\frac{\\pi}{2\\lambda}} = 1$$\n$$A^2 = \\sqrt{\\frac{2\\lambda}{\\pi}} \\implies A = \\left(\\frac{2\\lambda}{\\pi}\\right)^{1/4}$$"
          },
          {
            question: "Bereken de kans om het deeltje te vinden in het interval $[-a, a]$. Laat het antwoord staan in termen van de errorfunctie $\\text{erf}(z) = \\frac{2}{\\sqrt{\\pi}}\\int_0^z e^{-u^2}du$.",
            hints: [
              "$P(-a,a) = A^2\\int_{-a}^{a}e^{-2\\lambda x^2}\\,dx$.",
              "Substitueer $u = \\sqrt{2\\lambda}\\,x$, dus $dx = du/\\sqrt{2\\lambda}$.",
              "Gebruik de symmetrie van de integraal en de definitie van erf."
            ],
            answer: "$P(-a,a) = \\text{erf}(a\\sqrt{2\\lambda})$",
            solution: "$$P(-a,a) = A^2\\int_{-a}^{a}e^{-2\\lambda x^2}\\,dx$$\nSubstitutie $u = \\sqrt{2\\lambda}\\,x$:\n$$= A^2 \\cdot \\frac{1}{\\sqrt{2\\lambda}}\\int_{-a\\sqrt{2\\lambda}}^{a\\sqrt{2\\lambda}}e^{-u^2}\\,du = A^2 \\cdot \\frac{1}{\\sqrt{2\\lambda}} \\cdot 2\\int_0^{a\\sqrt{2\\lambda}}e^{-u^2}\\,du$$\n$$= \\sqrt{\\frac{2\\lambda}{\\pi}} \\cdot \\frac{1}{\\sqrt{2\\lambda}} \\cdot \\sqrt{\\pi} \\cdot \\text{erf}(a\\sqrt{2\\lambda}) = \\text{erf}(a\\sqrt{2\\lambda})$$"
          },
        ],
      },
    ],
    quiz: [
      {
        question: "Waarom is de normeringsvoorwaarde $\\int|\\Psi|^2\\,dx = 1$ fysisch noodzakelijk?",
        options: [
          "Om de energie te begrenzen",
          "Omdat de totale kans om het deeltje ergens te vinden 1 moet zijn",
          "Om de golffunctie reëel te maken",
          "Om de Schrödingervergelijking op te lossen"
        ],
        correct: 1,
        explanation: "Als $|\\Psi|^2$ een kansdichtheid is (Born), dan moet de totale waarschijnlijkheid om het deeltje ergens in de ruimte te vinden precies 1 zijn."
      },
      {
        question: "Welk cruciaal feit bewijst Griffiths over de normering?",
        options: [
          "De normering is alleen geldig op $t = 0$",
          "Je moet de golffunctie op elk tijdstip opnieuw normeren",
          "Als $\\Psi$ genormeerd is op $t = 0$, blijft het genormeerd voor alle $t$",
          "De normering hangt af van de potentiaal $V$"
        ],
        correct: 2,
        explanation: "De Schrödingervergelijking garandeert behoud van normering: $\\frac{d}{dt}\\int|\\Psi|^2\\,dx = 0$. Je hoeft maar éénmaal te normeren."
      },
      {
        question: "Wat is de waarschijnlijkheidsstroom $J(x,t)$?",
        options: [
          "De snelheid waarmee het deeltje beweegt",
          "De stroom van lading door een oppervlak",
          "De stroom van waarschijnlijkheid door een punt, die met $\\rho = |\\Psi|^2$ de continuïteitsvergelijking vervult",
          "De afgeleide van de kansdichtheid naar de tijd"
        ],
        correct: 2,
        explanation: "$J$ en $\\rho = |\\Psi|^2$ voldoen aan $\\frac{\\partial\\rho}{\\partial t} + \\frac{\\partial J}{\\partial x} = 0$, de continuïteitsvergelijking. Waarschijnlijkheid wordt niet gecreëerd of vernietigd, maar stroomt."
      },
      {
        question: "Een Gaussisch golfpakket $\\Psi(x,0) = Ae^{-\\lambda x^2}$ wordt genormeerd. Wat is $A$?",
        options: [
          "$\\left(\\frac{\\lambda}{\\pi}\\right)^{1/4}$",
          "$\\left(\\frac{2\\lambda}{\\pi}\\right)^{1/4}$",
          "$\\sqrt{\\frac{\\lambda}{\\pi}}$",
          "$\\frac{1}{\\sqrt{2\\pi\\lambda}}$"
        ],
        correct: 1,
        explanation: "Uit $A^2\\int e^{-2\\lambda x^2}dx = A^2\\sqrt{\\pi/(2\\lambda)} = 1$ volgt $A^2 = \\sqrt{2\\lambda/\\pi}$, dus $A = (2\\lambda/\\pi)^{1/4}$."
      },
    ],
};

export default chapter4;
