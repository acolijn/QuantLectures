const chapter2 = {
    id: 2,
    title: "De Golffunctie",
    subtitle: "De Schrödingervergelijking, waarschijnlijkheidsinterpretatie, meting (Griffiths §1.1–1.2)",
    formulas: [
      { name: "Schrödingervergelijking (tijdsafhankelijk)", latex: "i\\hbar \\frac{\\partial}{\\partial t} \\Psi(x,t) = -\\frac{\\hbar^2}{2m} \\frac{\\partial^2}{\\partial x^2} \\Psi(x,t) + V(x)\\Psi(x,t)" },
      { name: "Hamiltoniaan-operator", latex: "\\hat{H} = -\\frac{\\hbar^2}{2m} \\frac{\\partial^2}{\\partial x^2} + V(x)" },
      { name: "Compacte notatie SV", latex: "i\\hbar \\frac{\\partial \\Psi}{\\partial t} = \\hat{H}\\Psi" },
      { name: "Kansdichtheid", latex: "\\rho(x,t) = |\\Psi(x,t)|^2 = \\Psi^*(x,t)\\,\\Psi(x,t)" },
      { name: "Waarschijnlijkheid in interval", latex: "P_{a \\to b}(t) = \\int_a^b |\\Psi(x,t)|^2 \\, dx" },
      { name: "Complexe vlakke golf", latex: "\\Psi(x,t) = A\\,e^{i(kx - \\omega t)}" },
    ],
    concepts: [
      {
        title: "Van klassieke mechanica naar quantummechanica (Griffiths §1.1)",
        content: "In de klassieke mechanica bepaalt de tweede wet van Newton, $F = ma$, de baan $x(t)$ van een deeltje gegeven de beginvoorwaarden $x(0)$ en $v(0)$. In de quantummechanica is er geen scherp gedefinieerde baan. In plaats daarvan zoeken we de golffunctie $\\Psi(x,t)$, die wordt bepaald door de Schrödingervergelijking gegeven de beginvoorwaarde $\\Psi(x,0)$. De Schrödingervergelijking speelt in de QM dezelfde fundamentele rol als $F = ma$ in de klassieke mechanica: gegeven de krachten (de potentiaal $V$) en de begintoestand, bepaalt zij de volledige tijdsevolutie."
      },
      {
        title: "De Schrödingervergelijking (Griffiths §1.1)",
        content: "De tijdsafhankelijke Schrödingervergelijking luidt:\n\n$$i\\hbar \\frac{\\partial \\Psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2 \\Psi}{\\partial x^2} + V\\Psi$$\n\nDit is een partiële differentiaalvergelijking, eerste orde in de tijd en tweede orde in de positie. De structuur is fundamenteel anders dan de klassieke golfvergelijking (die tweede orde in de tijd is). De factor $i$ aan de linkerkant maakt dat de oplossingen inherent complex zijn. Gegeven de potentiaal $V(x,t)$ en de beginconditie $\\Psi(x,0)$ produceert de SV de golffunctie $\\Psi(x,t)$ voor alle toekomstige tijden."
      },
      {
        title: "De golffunctie $\\Psi(x,t)$",
        content: "De golffunctie $\\Psi(x,t)$ is een complexwaardige functie van positie en tijd die de volledige toestand van een quantummechanisch systeem beschrijft. In tegenstelling tot klassieke golven (zoals geluid of licht) is $\\Psi$ zelf niet direct meetbaar. De golffunctie bevat alle informatie die over het systeem te verkrijgen is, maar de fysische betekenis zit in $|\\Psi|^2$, niet in $\\Psi$ zelf. Een cruciale eigenschap: $\\Psi$ is complex — het heeft zowel een reëel als een imaginair deel. Je kunt $\\Psi$ schrijven als $\\Psi = a + bi$ of in polaire vorm als $\\Psi = R\\,e^{i\\phi}$."
      },
      {
        title: "Born's statistische interpretatie (Griffiths §1.2)",
        content: "Max Born stelde in 1926 de statistische interpretatie voor:\n\n$$|\\Psi(x,t)|^2\\,dx$$\n\nis de waarschijnlijkheid om het deeltje aan te treffen tussen $x$ en $x + dx$ op tijdstip $t$. Deze interpretatie is radicaal: de golffunctie vertelt je niet waar het deeltje IS, maar waar je het zou kunnen VINDEN als je een meting uitvoert. De kansdichtheid $|\\Psi|^2$ is altijd reëel en niet-negatief, zoals het hoort voor een waarschijnlijkheid. De integraal $\\int_a^b |\\Psi|^2\\,dx$ geeft de kans om het deeltje in het interval $[a,b]$ te vinden."
      },
      {
        title: "Meting en het instorten van de golffunctie (Griffiths §1.2)",
        content: "Wat gebeurt er als we een meting uitvoeren? Vóór de meting is het deeltje niet op een bepaalde positie — de golffunctie is uitgespreid over de ruimte. Op het moment van meting vinden we het deeltje op een bepaalde positie $C$. Direct na de meting is $\\Psi$ ge'collapsed' tot een scherpe piek rond $C$. Dit is het instorten (collapse) van de golffunctie. Als we onmiddellijk opnieuw meten, vinden we het deeltje weer bij $C$. Maar als we wachten, spreidt de golffunctie zich weer uit volgens de SV. De meting verstoort het systeem fundamenteel."
      },
      {
        title: "Onbepaaldheid: drie filosofische posities (Griffiths §1.2)",
        content: "De statistische aard van de QM roept een fundamentele vraag op: had het deeltje vóór de meting een bepaalde positie? Griffiths onderscheidt drie posities:\n\n1. **Realistisch**: Het deeltje was de hele tijd bij $C$; we wisten het alleen niet (verborgen variabelen).\n2. **Orthodox (Kopenhagen)**: Het deeltje had geen bepaalde positie vóór de meting; de meting zelf dwingt het deeltje een positie aan te nemen.\n3. **Agnostisch**: Weiger de vraag te beantwoorden — we kunnen het toch niet weten.\n\nIn 1964 bewees John Bell dat het wél uitmaakt: de agnostische positie is niet houdbaar. Experimenten (Aspect, 1982) bevestigen de orthodoxe interpretatie en sluiten lokale verborgen-variabelen-theorieën uit."
      },
      {
        title: "De complexe vlakke golf en de Schrödingervergelijking",
        content: "Een vrij deeltje met energie $E$ en impuls $p$ wordt beschreven door de vlakke golf:\n\n$$\\Psi(x,t) = A\\,e^{i(kx - \\omega t)}$$\n\nmet de de Broglie-relatie $p = \\hbar k$ en de Einstein-relatie $E = \\hbar\\omega$. Door de vrije-deeltjes-SV ($V = 0$) toe te passen op deze golf vinden we $E = \\frac{p^2}{2m}$, precies de klassieke kinetische energierelatie. Dit laat zien dat de SV consistent is met de bekende relaties uit de oude quantumtheorie. Cruciaal: de $i$ in de exponent maakt de golf complex — een reële sinus of cosinus zou de SV niet oplossen."
      },
    ],
    exercises: [
      {
        title: "De Schrödingervergelijking afleiden uit een vlakke golf",
        description: "We leiden de Schrödingervergelijking af door te eisen dat zij de complexe vlakke golf $\\Psi = Ae^{i(kx-\\omega t)}$ als oplossing heeft, gecombineerd met de de Broglie- en Einstein-relaties.",
        steps: [
          {
            question: "Beschouw de complexe vlakke golf $\\Psi(x,t) = Ae^{i(kx - \\omega t)}$. Bereken de partiële afgeleide naar de tijd: $\\frac{\\partial \\Psi}{\\partial t}$.",
            hints: [
              "De exponent is $i(kx - \\omega t)$. Bij differentiëren naar $t$ blijft $kx$ constant.",
              "De afgeleide van $e^{\\alpha t}$ naar $t$ is $\\alpha\\,e^{\\alpha t}$."
            ],
            answer: "$\\frac{\\partial \\Psi}{\\partial t} = -i\\omega\\,\\Psi$",
            solution: "$$\\frac{\\partial}{\\partial t}Ae^{i(kx-\\omega t)} = A \\cdot i \\cdot (-\\omega) \\cdot e^{i(kx-\\omega t)} = -i\\omega\\,\\Psi$$"
          },
          {
            question: "Bereken nu de tweede partiële afgeleide naar $x$: $\\frac{\\partial^2 \\Psi}{\\partial x^2}$.",
            hints: [
              "Differentieer eerst eenmaal naar $x$: de factor $ik$ komt naar voren.",
              "Differentieer nogmaals naar $x$: er komt nog een factor $ik$ bij."
            ],
            answer: "$\\frac{\\partial^2 \\Psi}{\\partial x^2} = -k^2\\,\\Psi$",
            solution: "$$\\frac{\\partial \\Psi}{\\partial x} = ik\\,\\Psi$$\n$$\\frac{\\partial^2 \\Psi}{\\partial x^2} = (ik)^2\\,\\Psi = -k^2\\,\\Psi$$"
          },
          {
            question: "Gebruik de Einstein-relatie $E = \\hbar\\omega$ en de de Broglie-relatie $p = \\hbar k$ om $\\omega$ en $k^2$ uit te drukken in $E$ en $p$. Schrijf vervolgens de energie-impulsrelatie voor een vrij deeltje op.",
            hints: [
              "Uit $E = \\hbar\\omega$ volgt $\\omega = E/\\hbar$.",
              "Uit $p = \\hbar k$ volgt $k = p/\\hbar$, dus $k^2 = p^2/\\hbar^2$.",
              "De klassieke kinetische energie is $E = p^2/(2m)$ voor een vrij deeltje."
            ],
            answer: ["$\\omega = E/\\hbar$", "$k^2 = p^2/\\hbar^2$", "$E = p^2/(2m)$"],
            solution: "Uit de relaties:\n$$\\omega = \\frac{E}{\\hbar}, \\quad k^2 = \\frac{p^2}{\\hbar^2}$$\nDe energie-impulsrelatie voor een vrij deeltje:\n$$E = \\frac{p^2}{2m}$$"
          },
          {
            question: "Combineer nu de resultaten: uit stap 1 haal je $E\\Psi$ (via $i\\hbar \\frac{\\partial\\Psi}{\\partial t}$), uit stap 2 haal je $p^2\\Psi$ (via $-\\hbar^2\\frac{\\partial^2\\Psi}{\\partial x^2}$). Stel de energierelatie $E = p^2/2m$ op als een operatorvergelijking op $\\Psi$ en vind de Schrödingervergelijking voor een vrij deeltje.",
            hints: [
              "Uit stap 1: $i\\hbar\\frac{\\partial\\Psi}{\\partial t} = i\\hbar(-i\\omega)\\Psi = \\hbar\\omega\\,\\Psi = E\\,\\Psi$.",
              "Uit stap 2: $-\\hbar^2\\frac{\\partial^2\\Psi}{\\partial x^2} = -\\hbar^2(-k^2)\\Psi = \\hbar^2 k^2\\,\\Psi = p^2\\,\\Psi$.",
              "Deel door $2m$ en gebruik $E\\Psi = \\frac{p^2}{2m}\\Psi$."
            ],
            answer: "$i\\hbar\\frac{\\partial\\Psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\Psi}{\\partial x^2}$",
            solution: "We hebben vastgesteld dat:\n$$i\\hbar\\frac{\\partial\\Psi}{\\partial t} = E\\,\\Psi \\quad \\text{en} \\quad -\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\Psi}{\\partial x^2} = \\frac{p^2}{2m}\\Psi$$\nDe energierelatie $E = \\frac{p^2}{2m}$ wordt dus:\n$$i\\hbar\\frac{\\partial\\Psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\Psi}{\\partial x^2}$$\nDit is de Schrödingervergelijking voor een vrij deeltje ($V = 0$). Met een potentiaal $V(x)$ voegen we $+V\\Psi$ toe aan de rechterkant."
          },
        ],
      },
      {
        title: "Waarschijnlijkheidsinterpretatie bij de dubbele spleet",
        description: "We onderzoeken hoe de kansdichtheid $|\\Psi|^2$ het interferentiepatroon bij de dubbele spleet verklaart, en wat er verandert als we 'welke spleet'-informatie verkrijgen.",
        steps: [
          {
            question: "Bij een dubbele-spleetexperiment bereikt een deeltje het scherm via spleet 1 of spleet 2. De bijbehorende golffuncties zijn $\\Psi_1$ en $\\Psi_2$. Als beide spleten open zijn, is de totale golffunctie $\\Psi = \\Psi_1 + \\Psi_2$. Bereken de kansdichtheid $|\\Psi|^2$ en laat zien dat er een interferentieterm verschijnt.",
            hints: [
              "$|\\Psi|^2 = (\\Psi_1 + \\Psi_2)^*(\\Psi_1 + \\Psi_2)$.",
              "Werk het product uit: je krijgt vier termen.",
              "De kruistermen vormen de interferentie."
            ],
            answer: "$|\\Psi|^2 = |\\Psi_1|^2 + |\\Psi_2|^2 + \\Psi_1^*\\Psi_2 + \\Psi_2^*\\Psi_1$",
            solution: "$$|\\Psi|^2 = |\\Psi_1 + \\Psi_2|^2 = (\\Psi_1^* + \\Psi_2^*)(\\Psi_1 + \\Psi_2)$$\n$$= |\\Psi_1|^2 + |\\Psi_2|^2 + \\Psi_1^*\\Psi_2 + \\Psi_2^*\\Psi_1$$\n$$= |\\Psi_1|^2 + |\\Psi_2|^2 + 2\\,\\text{Re}(\\Psi_1^*\\Psi_2)$$\nDe laatste term is de interferentieterm. Deze kan positief of negatief zijn, wat leidt tot het bekende interferentiepatroon met maxima en minima."
          },
          {
            question: "Schrijf $\\Psi_1 = |\\Psi_1|\\,e^{i\\phi_1}$ en $\\Psi_2 = |\\Psi_2|\\,e^{i\\phi_2}$. Toon aan dat de interferentieterm $2|\\Psi_1||\\Psi_2|\\cos(\\phi_1 - \\phi_2)$ is. Wanneer is er constructieve en wanneer destructieve interferentie?",
            hints: [
              "$\\Psi_1^*\\Psi_2 = |\\Psi_1||\\Psi_2|\\,e^{i(\\phi_2 - \\phi_1)}$.",
              "$\\Psi_1^*\\Psi_2 + \\Psi_2^*\\Psi_1 = 2\\,\\text{Re}(\\Psi_1^*\\Psi_2) = 2|\\Psi_1||\\Psi_2|\\cos(\\phi_2 - \\phi_1)$.",
              "Constructief: $\\cos = +1$ (faseverschil $0, 2\\pi, \\ldots$). Destructief: $\\cos = -1$ (faseverschil $\\pi, 3\\pi, \\ldots$)."
            ],
            answer: "Interferentieterm $= 2|\\Psi_1||\\Psi_2|\\cos(\\Delta\\phi)$. Constructief als $\\Delta\\phi = 2n\\pi$, destructief als $\\Delta\\phi = (2n+1)\\pi$.",
            solution: "$$2\\,\\text{Re}(\\Psi_1^*\\Psi_2) = 2|\\Psi_1||\\Psi_2|\\cos(\\phi_2 - \\phi_1)$$\n\n- **Constructieve interferentie**: $\\phi_2 - \\phi_1 = 2n\\pi$ → $\\cos = +1$ → maximale intensiteit\n- **Destructieve interferentie**: $\\phi_2 - \\phi_1 = (2n+1)\\pi$ → $\\cos = -1$ → minimale intensiteit (kan nul zijn als $|\\Psi_1| = |\\Psi_2|$)\n\nHet faseverschil hangt af van het verschil in padlengte: $\\Delta\\phi = k\\,\\Delta L$."
          },
          {
            question: "Wat gebeurt er als we een detector bij één van de spleten plaatsen om te bepalen door welke spleet het deeltje gaat? Verklaar dit vanuit het instorten van de golffunctie.",
            hints: [
              "Als we weten dat het deeltje door spleet 1 ging, dan is $\\Psi = \\Psi_1$ (de bijdrage van spleet 2 verdwijnt).",
              "De kansdichtheid wordt dan $|\\Psi_1|^2$ — geen interferentie.",
              "Dit is een voorbeeld van het instorten van de golffunctie door meting."
            ],
            answer: "De interferentie verdwijnt: $|\\Psi|^2 = |\\Psi_1|^2$ of $|\\Psi_2|^2$.",
            solution: "Als we bepalen door welke spleet het deeltje gaat, 'instort' de golffunctie:\n\n- **Met detector**: $\\Psi$ collapst naar $\\Psi_1$ of $\\Psi_2$. Kansdichtheid: $|\\Psi_1|^2$ of $|\\Psi_2|^2$. Totaal gemiddeld: $|\\Psi_1|^2 + |\\Psi_2|^2$. **Geen interferentie**.\n- **Zonder detector**: $\\Psi = \\Psi_1 + \\Psi_2$. Kansdichtheid: $|\\Psi_1|^2 + |\\Psi_2|^2 + 2\\text{Re}(\\Psi_1^*\\Psi_2)$. **Wél interferentie**.\n\nDit illustreert het meetprobleem: de daad van observatie verandert het resultaat fundamenteel. Complementariteit: welke-weg-informatie en interferentie sluiten elkaar uit."
          },
        ],
      },
    ],
    quiz: [
      {
        question: "Wat beschrijft $|\\Psi(x,t)|^2$ volgens Born?",
        options: [
          "De energie van het deeltje op positie $x$",
          "De snelheid van het deeltje op tijdstip $t$",
          "De kansdichtheid om het deeltje bij positie $x$ te vinden",
          "De impuls van het deeltje"
        ],
        correct: 2,
        explanation: "Volgens Born's statistische interpretatie is $|\\Psi(x,t)|^2$ de kansdichtheid: $|\\Psi|^2\\,dx$ is de kans om het deeltje in het interval $[x, x+dx]$ te vinden."
      },
      {
        question: "De Schrödingervergelijking is:",
        options: [
          "Tweede orde in tijd, eerste orde in positie",
          "Eerste orde in tijd, tweede orde in positie",
          "Tweede orde in zowel tijd als positie",
          "Eerste orde in zowel tijd als positie"
        ],
        correct: 1,
        explanation: "De SV bevat $\\frac{\\partial}{\\partial t}$ (eerste orde in tijd) en $\\frac{\\partial^2}{\\partial x^2}$ (tweede orde in positie). Dit verschilt van de klassieke golfvergelijking die tweede orde in de tijd is."
      },
      {
        question: "De golffunctie $\\Psi(x,t)$ is in het algemeen:",
        options: [
          "Reëelwaardig",
          "Complexwaardig",
          "Altijd positief",
          "Altijd reëel en positief"
        ],
        correct: 1,
        explanation: "De golffunctie is complexwaardig. De factor $i$ in de Schrödingervergelijking maakt dat de oplossingen inherent complex zijn. Alleen $|\\Psi|^2$ heeft een directe fysische betekenis en is altijd reëel en niet-negatief."
      },
      {
        question: "Wat is de rol van de Schrödingervergelijking in de quantummechanica?",
        options: [
          "Het bepaalt de baan van een deeltje",
          "Het bepaalt de tijdsevolutie van de golffunctie gegeven de begintoestand",
          "Het bepaalt de meting die wordt uitgevoerd",
          "Het berekent de energie-eigenwaarden direct"
        ],
        correct: 1,
        explanation: "De SV bepaalt hoe $\\Psi(x,t)$ evolueert in de tijd, gegeven $\\Psi(x,0)$ en de potentiaal $V(x)$. Het is het QM-analogon van Newtons $F = ma$."
      },
      {
        question: "Bij een dubbele-spleetexperiment, als we detecteren door welke spleet het deeltje gaat, dan:",
        options: [
          "Wordt het interferentiepatroon scherper",
          "Verdwijnt het interferentiepatroon",
          "Verandert er niets aan het patroon",
          "Wordt de golffunctie automatisch genormeerd"
        ],
        correct: 1,
        explanation: "Door te meten (welke spleet?) instort de golffunctie tot $\\Psi_1$ of $\\Psi_2$. De interferentieterm $2\\text{Re}(\\Psi_1^*\\Psi_2)$ verdwijnt. Dit is complementariteit."
      },
      {
        question: "Volgens Griffiths, welke drie filosofische posities zijn er over de onbepaaldheid in de QM?",
        options: [
          "Newtoniaans, Einsteiniaans, Bohriaans",
          "Realistisch, orthodox (Kopenhagen), agnostisch",
          "Deterministisch, probabilistisch, chaotisch",
          "Lokaal, niet-lokaal, superluminaal"
        ],
        correct: 1,
        explanation: "Griffiths beschrijft: (1) Realistisch — het deeltje heeft o.a. een positie, we weten het niet (verborgen variabelen), (2) Orthodox/Kopenhagen — het deeltje hééft geen positie tot de meting, (3) Agnostisch — weiger de vraag te beantwoorden."
      },
      {
        question: "Bell's theorem (1964) toonde aan dat:",
        options: [
          "De quantummechanica deterministisch is",
          "Verborgen variabelen de QM volledig verklaren",
          "Het verschil tussen de filosofische posities experimenteel toetsbaar is, en lokale verborgen variabelen uitgesloten zijn",
          "De golffunctie altijd reëel is"
        ],
        correct: 2,
        explanation: "Bell bewees dat de drie posities tot meetbaar verschillende voorspellingen leiden. Experimenten (Aspect, 1982) sluiten lokale verborgen-variabelen-theorieën uit en bevestigen de orthodoxe interpretatie."
      },
      {
        question: "Waarom kan een reële golf (bijv. $\\cos(kx - \\omega t)$) de Schrödingervergelijking niet oplossen?",
        options: [
          "Omdat reële functies niet genormeerd kunnen worden",
          "Omdat de SV door de factor $i$ inherent complexe oplossingen vereist",
          "Omdat cosinus niet differentieerbaar is",
          "Omdat de energie dan negatief zou worden"
        ],
        correct: 1,
        explanation: "De SV heeft een factor $i$ aan de linkerkant. Bij substitutie van een reële golf krijg je een complexe linkerkant maar een reële rechterkant — dat klopt niet. De $i$ vereist inherent complexe oplossingen, zoals $e^{i(kx-\\omega t)}$."
      },
    ],
};

export default chapter2;
