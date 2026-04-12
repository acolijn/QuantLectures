const chapter5 = {
    id: 5,
    title: "Operatoren en Verwachtingswaarden",
    subtitle: "Impulsoperator, commutatoren, onzekerheidsprincipe (Griffiths §1.5–1.6)",
    formulas: [
      { name: "Verwachtingswaarde positie", latex: "\\langle x \\rangle = \\int_{-\\infty}^{\\infty} x\\,|\\Psi(x,t)|^2\\,dx" },
      { name: "Verwachtingswaarde van een functie van x", latex: "\\langle f(x) \\rangle = \\int_{-\\infty}^{\\infty} f(x)\\,|\\Psi(x,t)|^2\\,dx" },
      { name: "Impulsoperator", latex: "\\hat{p} = -i\\hbar \\frac{\\partial}{\\partial x}" },
      { name: "Verwachtingswaarde impuls", latex: "\\langle p \\rangle = -i\\hbar \\int \\Psi^* \\frac{\\partial \\Psi}{\\partial x}\\,dx = \\int \\Psi^*\\,\\hat{p}\\,\\Psi\\,dx" },
      { name: "Verwachtingswaarde van een operator", latex: "\\langle Q \\rangle = \\int \\Psi^*\\,\\hat{Q}\\,\\Psi\\,dx" },
      { name: "Hamiltoniaan", latex: "\\hat{H} = \\frac{\\hat{p}^2}{2m} + V(x) = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2}{\\partial x^2} + V(x)" },
      { name: "Commutator", latex: "[\\hat{A}, \\hat{B}] = \\hat{A}\\hat{B} - \\hat{B}\\hat{A}" },
      { name: "Canonieke commutatierelatie", latex: "[\\hat{x}, \\hat{p}] = i\\hbar" },
      { name: "Variantie", latex: "\\sigma_Q^2 = \\langle Q^2 \\rangle - \\langle Q \\rangle^2" },
      { name: "Onzekerheidsprincipe", latex: "\\sigma_x \\sigma_p \\geq \\frac{\\hbar}{2}" },
    ],
    concepts: [
      {
        title: "Verwachtingswaarde van positie (Griffiths §1.5)",
        content: "In de quantummechanica is de uitkomst van een meting niet deterministic — we kunnen alleen de verwachtingswaarde berekenen, het gemiddelde van vele metingen aan identiek geprepareerde systemen. Voor de positie geldt:\n\n$$\\langle x \\rangle = \\int_{-\\infty}^{\\infty} x\\,|\\Psi(x,t)|^2\\,dx$$\n\nDit is niet de gemiddelde positie van één deeltje dat heen en weer beweegt. In de Kopenhagen-interpretatie had het deeltje geen bepaalde positie vóór de meting. $\\langle x \\rangle$ is het statistisch gemiddelde van positiemetingen aan een ensemble van identieke systemen — dit heet een ensemble-gemiddelde. In een experiment: prepareer duizenden identieke kopieën van het systeem, meet de positie van elk, en neem het gemiddelde."
      },
      {
        title: "Tijdsverandering van $\\langle x \\rangle$ en de impulsoperator (Griffiths §1.5)",
        content: "Hoe verandert $\\langle x \\rangle$ in de tijd? Door de tijdsafgeleide te nemen en de Schrödingervergelijking te gebruiken:\n\n$$\\frac{d\\langle x \\rangle}{dt} = \\int x\\,\\frac{\\partial|\\Psi|^2}{\\partial t}\\,dx$$\n\nNa partiële integratie (tweemaal) en gebruik van de SV vindt men:\n\n$$\\frac{d\\langle x \\rangle}{dt} = \\frac{-i\\hbar}{m}\\int \\Psi^*\\frac{\\partial\\Psi}{\\partial x}\\,dx$$\n\nVergelijking met de klassieke relatie $v = p/m$ leidt tot de identificatie van de verwachtingswaarde van de impuls:\n\n$$\\langle p \\rangle = m\\frac{d\\langle x \\rangle}{dt} = -i\\hbar\\int \\Psi^*\\frac{\\partial\\Psi}{\\partial x}\\,dx$$\n\nHieruit lezen we de impulsoperator af: $\\hat{p} = -i\\hbar\\frac{\\partial}{\\partial x}$. Let op het minteken en de factor $i$ — deze zijn essentieel."
      },
      {
        title: "Operatoren in de quantummechanica (Griffiths §1.5)",
        content: "In de quantummechanica correspondeert elke meetbare grootheid (observabele) met een operator die op de golffunctie werkt. De verwachtingswaarde van een observabele $Q(x,p)$ wordt berekend door de operatorvervanging:\n\n$$\\langle Q \\rangle = \\int \\Psi^*\\,\\hat{Q}\\left(x, -i\\hbar\\frac{\\partial}{\\partial x}\\right)\\Psi\\,dx$$\n\nDe basisoperatoren zijn:\n- **Positie**: $\\hat{x} = x$ (simpelweg vermenigvuldigen met $x$)\n- **Impuls**: $\\hat{p} = -i\\hbar\\frac{\\partial}{\\partial x}$ (de afgeleide nemen, maal $-i\\hbar$)\n\nAlle andere operatoren worden hieruit opgebouwd. Bijvoorbeeld de kinetische energie: $\\hat{T} = \\hat{p}^2/(2m) = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2}{\\partial x^2}$. De Hamiltoniaan is $\\hat{H} = \\hat{T} + V(\\hat{x}) = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2}{\\partial x^2} + V(x)$. Merk op dat de volgorde waarin operatoren werken ertoe doet: $\\hat{x}\\hat{p} \\neq \\hat{p}\\hat{x}$ in het algemeen."
      },
      {
        title: "De commutator en commutatierelaties (Griffiths §1.5)",
        content: "De commutator van twee operatoren $\\hat{A}$ en $\\hat{B}$ is gedefinieerd als:\n\n$$[\\hat{A}, \\hat{B}] = \\hat{A}\\hat{B} - \\hat{B}\\hat{A}$$\n\nAls $[\\hat{A}, \\hat{B}] = 0$ zeggen we dat de operatoren commuteren: de volgorde maakt niet uit. Als ze niet commuteren, is de volgorde wél belangrijk. De meest fundamentele commutator in de QM is de canonieke commutatierelatie:\n\n$$[\\hat{x}, \\hat{p}] = i\\hbar$$\n\nBewijs: laat $[\\hat{x}, \\hat{p}]$ werken op een willekeurige functie $f(x)$:\n$$[\\hat{x}, \\hat{p}]f = \\hat{x}(\\hat{p}f) - \\hat{p}(\\hat{x}f) = x\\left(-i\\hbar\\frac{df}{dx}\\right) - \\left(-i\\hbar\\frac{d}{dx}(xf)\\right)$$\n$$= -i\\hbar x\\frac{df}{dx} + i\\hbar\\left(f + x\\frac{df}{dx}\\right) = i\\hbar f$$\n\nDus $[\\hat{x}, \\hat{p}] = i\\hbar$. In woorden: positie en impuls commuteren niet. Dit heeft verstrekkende gevolgen — het leidt rechtstreeks tot het onzekerheidsprincipe."
      },
      {
        title: "Variantie en standaarddeviatie (Griffiths §1.5)",
        content: "De verwachtingswaarde alleen vertelt niet het hele verhaal — we willen ook weten hoe breed de verdeling is. De variantie (of spreiding) van een observabele $Q$ is:\n\n$$\\sigma_Q^2 = \\langle (Q - \\langle Q \\rangle)^2 \\rangle = \\langle Q^2 \\rangle - \\langle Q \\rangle^2$$\n\nDe standaarddeviatie $\\sigma_Q = \\sqrt{\\sigma_Q^2}$ is de 'onzekerheid' in de observabele. Voorbeeld: voor positie geldt $\\sigma_x^2 = \\langle x^2 \\rangle - \\langle x \\rangle^2$. De standaarddeviatie $\\sigma_x$ is een maat voor hoe breed de kansverdeling $|\\Psi|^2$ is. Een smalle piek in $|\\Psi|^2$ geeft kleine $\\sigma_x$ (de positie is vrij goed bepaald); een brede verdeling geeft grote $\\sigma_x$."
      },
      {
        title: "Heisenbergs onzekerheidsprincipe (Griffiths §1.6)",
        content: "Het onzekerheidsprincipe van Heisenberg stelt een fundamentele ondergrens aan het product van de onzekerheden in positie en impuls:\n\n$$\\sigma_x\\sigma_p \\geq \\frac{\\hbar}{2}$$\n\nDit is geen technische meetbeperking — het is een fundamentele eigenschap van de natuur, die mathematisch volgt uit de niet-commutativiteit van $\\hat{x}$ en $\\hat{p}$: omdat $[\\hat{x}, \\hat{p}] = i\\hbar \\neq 0$, kunnen positie en impuls niet tegelijkertijd scherp bepaald zijn. Hoe nauwkeuriger je de positie kent (kleine $\\sigma_x$), hoe onzekerder de impuls (grote $\\sigma_p$), en omgekeerd. De gelijkheid $\\sigma_x\\sigma_p = \\hbar/2$ geldt alleen voor het Gaussische golfpakket — dit is de toestand met minimale onzekerheid."
      },
      {
        title: "Ehrenfests theorema",
        content: "Ehrenfests theorema verbindt de quantummechanische verwachtingswaarden met de klassieke bewegingsvergelijkingen:\n\n$$\\frac{d\\langle p \\rangle}{dt} = \\left\\langle -\\frac{\\partial V}{\\partial x} \\right\\rangle$$\n\nDit is het quantummechanische analogon van Newtons tweede wet $F = dp/dt$. Let op: het is de verwachtingswaarde van de kracht, niet de kracht bij de verwachtingswaarde van $x$. In het algemeen geldt $\\langle -dV/dx \\rangle \\neq -dV(\\langle x \\rangle)/dx$. Alleen als $V$ hoogstens kwadratisch is in $x$ (vrij deeltje, harmonische oscillator, uniforme kracht) zijn ze gelijk. In combinatie met $m\\frac{d\\langle x \\rangle}{dt} = \\langle p \\rangle$ vormt dit een paar vergelijkingen dat zegt: verwachtingswaarden gedragen zich 'bijna' klassiek."
      },
    ],
    exercises: [
      {
        label: "Opgave 1",
        title: "Verwachtingswaarden berekenen voor een Gaussisch golfpakket",
        intro: "We berekenen de verwachtingswaarden $\\langle x \\rangle$, $\\langle x^2 \\rangle$, $\\langle p \\rangle$ en $\\langle p^2 \\rangle$ voor het genormeerde Gaussische golfpakket $\\Psi(x,0) = \\left(\\frac{2a}{\\pi}\\right)^{1/4} e^{-ax^2}$, en verifiëren het onzekerheidsprincipe.",
        steps: [
          {
            question: "Bereken $\\langle x \\rangle = \\int_{-\\infty}^{\\infty} x\\,|\\Psi|^2\\,dx$ voor $\\Psi(x,0) = \\left(\\frac{2a}{\\pi}\\right)^{1/4}e^{-ax^2}$.",
            hints: [
              "$|\\Psi|^2 = \\sqrt{2a/\\pi}\\,e^{-2ax^2}$. De integrand is $x \\cdot e^{-2ax^2}$.",
              "Dit is een oneven functie van $x$ geïntegreerd over een symmetrisch interval $(-\\infty, \\infty)$."
            ],
            solution: [
              "$\\langle x \\rangle = \\sqrt{\\frac{2a}{\\pi}}\\int_{-\\infty}^{\\infty} x\\,e^{-2ax^2}\\,dx = 0$",
              "De integrand $x\\,e^{-2ax^2}$ is een oneven functie van $x$, dus de integraal is nul.",
              "Dit is logisch: de kansverdeling is symmetrisch rond $x = 0$."
            ],
          },
          {
            question: "Bereken $\\langle x^2 \\rangle = \\int_{-\\infty}^{\\infty} x^2\\,|\\Psi|^2\\,dx$. Gebruik de standaardintegraal $\\int_{-\\infty}^{\\infty} x^2 e^{-\\alpha x^2}dx = \\frac{1}{2}\\sqrt{\\pi/\\alpha^3}$.",
            hints: [
              "$\\langle x^2 \\rangle = \\sqrt{2a/\\pi}\\int_{-\\infty}^{\\infty} x^2 e^{-2ax^2}\\,dx$.",
              "Pas de standaardintegraal toe met $\\alpha = 2a$."
            ],
            answer: ["1/(4a)"],
            solution: [
              "$\\langle x^2 \\rangle = \\sqrt{\\frac{2a}{\\pi}}\\int_{-\\infty}^{\\infty} x^2 e^{-2ax^2}\\,dx = \\sqrt{\\frac{2a}{\\pi}} \\cdot \\frac{1}{2}\\sqrt{\\frac{\\pi}{(2a)^3}}$",
              "$= \\sqrt{\\frac{2a}{\\pi}} \\cdot \\frac{1}{2} \\cdot \\frac{\\sqrt{\\pi}}{2a\\sqrt{2a}} = \\frac{1}{4a}$"
            ],
          },
          {
            question: "Bereken $\\langle p \\rangle = -i\\hbar\\int_{-\\infty}^{\\infty} \\Psi^*\\frac{\\partial\\Psi}{\\partial x}\\,dx$.",
            hints: [
              "Bereken eerst $\\frac{\\partial\\Psi}{\\partial x} = -2ax\\,\\Psi$.",
              "Dus $\\Psi^*\\frac{\\partial\\Psi}{\\partial x} = -2ax\\,|\\Psi|^2$.",
              "De integrand is weer een oneven functie van $x$."
            ],
            solution: [
              "$\\frac{\\partial\\Psi}{\\partial x} = -2ax\\left(\\frac{2a}{\\pi}\\right)^{1/4}e^{-ax^2} = -2ax\\,\\Psi$",
              "$\\langle p \\rangle = -i\\hbar\\int_{-\\infty}^{\\infty}(-2ax)|\\Psi|^2\\,dx = 2ia\\hbar\\int_{-\\infty}^{\\infty}x\\,|\\Psi|^2\\,dx = 0$",
              "De integrand is oneven, dus $\\langle p \\rangle = 0$. Het golfpakket beweegt niet (in dit geval)."
            ],
          },
          {
            question: "Bereken $\\langle p^2 \\rangle = -\\hbar^2\\int_{-\\infty}^{\\infty} \\Psi^*\\frac{\\partial^2\\Psi}{\\partial x^2}\\,dx$. Gebruik $\\frac{\\partial^2\\Psi}{\\partial x^2} = (4a^2x^2 - 2a)\\Psi$.",
            hints: [
              "$\\langle p^2 \\rangle = -\\hbar^2\\int \\Psi^*(4a^2x^2 - 2a)\\Psi\\,dx = -\\hbar^2(4a^2\\langle x^2\\rangle - 2a)$.",
              "Substitueer $\\langle x^2 \\rangle = 1/(4a)$."
            ],
            answer: ["a*hbar^2", "ahbar^2"],
            solution: [
              "$\\langle p^2 \\rangle = -\\hbar^2\\int(4a^2x^2 - 2a)|\\Psi|^2\\,dx = -\\hbar^2(4a^2\\langle x^2\\rangle - 2a)$",
              "$= -\\hbar^2\\left(4a^2 \\cdot \\frac{1}{4a} - 2a\\right) = -\\hbar^2(a - 2a) = a\\hbar^2$"
            ],
          },
          {
            question: "Bereken nu $\\sigma_x$ en $\\sigma_p$, en verifieer het onzekerheidsprincipe $\\sigma_x\\sigma_p \\geq \\hbar/2$.",
            hints: [
              "$\\sigma_x^2 = \\langle x^2\\rangle - \\langle x\\rangle^2 = 1/(4a)$ en $\\sigma_p^2 = \\langle p^2\\rangle - \\langle p\\rangle^2 = a\\hbar^2$.",
              "Bereken $\\sigma_x \\sigma_p$."
            ],
            solution: [
              "$\\sigma_x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2} = \\sqrt{1/(4a)} = \\frac{1}{2\\sqrt{a}}$",
              "$\\sigma_p = \\sqrt{\\langle p^2\\rangle - \\langle p\\rangle^2} = \\sqrt{a\\hbar^2} = \\hbar\\sqrt{a}$",
              "$\\sigma_x\\sigma_p = \\frac{1}{2\\sqrt{a}} \\cdot \\hbar\\sqrt{a} = \\frac{\\hbar}{2}$",
              "We vinden precies $\\sigma_x\\sigma_p = \\hbar/2$ — de minimale onzekerheid! Het Gaussische golfpakket is de toestand die het onzekerheidsprincipe verzadigt."
            ],
          },
        ],
      },
      {
        label: "Opgave 2",
        title: "De canonieke commutatierelatie bewijzen",
        intro: "We bewijzen de fundamentele commutatierelatie $[\\hat{x}, \\hat{p}] = i\\hbar$ en verkennen de gevolgen voor verwante commutatoren.",
        steps: [
          {
            question: "Laat de operator $[\\hat{x}, \\hat{p}]$ werken op een willekeurige testfunctie $f(x)$. Bereken $\\hat{x}\\hat{p}f(x)$ en $\\hat{p}\\hat{x}f(x)$ apart.",
            hints: [
              "$\\hat{x}\\hat{p}f = x \\cdot (-i\\hbar)\\frac{df}{dx} = -i\\hbar x\\frac{df}{dx}$.",
              "$\\hat{p}\\hat{x}f = -i\\hbar\\frac{d}{dx}(xf) = -i\\hbar\\left(f + x\\frac{df}{dx}\\right)$ (productregel!)."
            ],
            solution: [
              "$\\hat{x}\\hat{p}f = x\\left(-i\\hbar\\frac{df}{dx}\\right) = -i\\hbar x\\frac{df}{dx}$",
              "$\\hat{p}\\hat{x}f = -i\\hbar\\frac{d}{dx}(xf) = -i\\hbar\\left(f + x\\frac{df}{dx}\\right)$",
              "Het verschil geeft het extra term $f$ uit de productregel."
            ],
          },
          {
            question: "Trek de twee resultaten van elkaar af om $[\\hat{x}, \\hat{p}]f(x)$ te berekenen. Wat is $[\\hat{x}, \\hat{p}]$?",
            hints: [
              "$[\\hat{x}, \\hat{p}]f = \\hat{x}\\hat{p}f - \\hat{p}\\hat{x}f$.",
              "De termen met $x\\frac{df}{dx}$ vallen weg."
            ],
            solution: [
              "$[\\hat{x}, \\hat{p}]f = -i\\hbar x\\frac{df}{dx} - \\left(-i\\hbar f - i\\hbar x\\frac{df}{dx}\\right)$",
              "$= -i\\hbar x\\frac{df}{dx} + i\\hbar f + i\\hbar x\\frac{df}{dx} = i\\hbar f$",
              "Omdat dit geldt voor elke $f(x)$, concluderen we: $[\\hat{x}, \\hat{p}] = i\\hbar$."
            ],
          },
          {
            question: "Bereken $[\\hat{x}^2, \\hat{p}]$ door gebruik te maken van de identiteit $[\\hat{A}\\hat{B}, \\hat{C}] = \\hat{A}[\\hat{B}, \\hat{C}] + [\\hat{A}, \\hat{C}]\\hat{B}$.",
            hints: [
              "Neem $\\hat{A} = \\hat{B} = \\hat{x}$ en $\\hat{C} = \\hat{p}$.",
              "$[\\hat{x}^2, \\hat{p}] = \\hat{x}[\\hat{x}, \\hat{p}] + [\\hat{x}, \\hat{p}]\\hat{x}$.",
              "Substitueer $[\\hat{x}, \\hat{p}] = i\\hbar$."
            ],
            solution: [
              "$[\\hat{x}^2, \\hat{p}] = \\hat{x}[\\hat{x}, \\hat{p}] + [\\hat{x}, \\hat{p}]\\hat{x} = \\hat{x}(i\\hbar) + (i\\hbar)\\hat{x} = 2i\\hbar\\hat{x}$",
              "Merk op dat $i\\hbar$ een constante is, die met alles commuteert."
            ],
          },
          {
            question: "Bereken ook $[\\hat{x}, \\hat{p}^2]$ op analoge wijze.",
            hints: [
              "Gebruik $[\\hat{A}, \\hat{B}\\hat{C}] = \\hat{B}[\\hat{A}, \\hat{C}] + [\\hat{A}, \\hat{B}]\\hat{C}$ met $\\hat{A} = \\hat{x}$, $\\hat{B} = \\hat{C} = \\hat{p}$."
            ],
            solution: [
              "$[\\hat{x}, \\hat{p}^2] = \\hat{p}[\\hat{x}, \\hat{p}] + [\\hat{x}, \\hat{p}]\\hat{p} = \\hat{p}(i\\hbar) + (i\\hbar)\\hat{p} = 2i\\hbar\\hat{p}$"
            ],
          },
        ],
      },
      {
        label: "Opgave 3",
        title: "Ehrenfests theorema afleiden",
        intro: "We leiden Ehrenfests theorema af: $\\frac{d\\langle p \\rangle}{dt} = \\langle -\\frac{\\partial V}{\\partial x} \\rangle$. Dit toont aan dat verwachtingswaarden de klassieke bewegingsvergelijkingen benaderen.",
        steps: [
          {
            question: "Begin met $\\langle p \\rangle = -i\\hbar\\int \\Psi^*\\frac{\\partial\\Psi}{\\partial x}\\,dx$. Bereken $\\frac{d\\langle p \\rangle}{dt}$ door de tijdsafgeleide onder het integraal te nemen. Schrijf de uitdrukking op met $\\frac{\\partial\\Psi^*}{\\partial t}$ en $\\frac{\\partial\\Psi}{\\partial t}$.",
            hints: [
              "Gebruik de productregel: $\\frac{\\partial}{\\partial t}\\left(\\Psi^*\\frac{\\partial\\Psi}{\\partial x}\\right) = \\frac{\\partial\\Psi^*}{\\partial t}\\frac{\\partial\\Psi}{\\partial x} + \\Psi^*\\frac{\\partial}{\\partial x}\\frac{\\partial\\Psi}{\\partial t}$.",
              "In de tweede term verwissel je de volgorde van $\\partial/\\partial x$ en $\\partial/\\partial t$."
            ],
            solution: [
              "$\\frac{d\\langle p \\rangle}{dt} = -i\\hbar\\int\\left(\\frac{\\partial\\Psi^*}{\\partial t}\\frac{\\partial\\Psi}{\\partial x} + \\Psi^*\\frac{\\partial^2\\Psi}{\\partial x\\partial t}\\right)dx$"
            ],
          },
          {
            question: "Substitueer de SV ($\\frac{\\partial\\Psi}{\\partial t} = \\frac{i\\hbar}{2m}\\frac{\\partial^2\\Psi}{\\partial x^2} - \\frac{i}{\\hbar}V\\Psi$) en zijn complex geconjugeerde. Laat zien dat de termen met $\\frac{\\partial^2}{\\partial x^2}$ (de kinetische-energietermen) verdwijnen na partiële integratie, en dat er overblijft:\n\n$$\\frac{d\\langle p\\rangle}{dt} = -\\int |\\Psi|^2\\frac{\\partial V}{\\partial x}\\,dx$$",
            hints: [
              "Na substitutie van de SV en haar complex geconjugeerde krijg je termen met $V$ en termen met $\\partial^2/\\partial x^2$.",
              "De $\\partial^2/\\partial x^2$-termen kun je vereenvoudigen door tweemaal partieel te integreren; de randtermen verdwijnen.",
              "De $V$-termen leveren: $-i\\hbar \\cdot (-i/\\hbar)\\int\\left(-V\\Psi^*\\frac{\\partial\\Psi}{\\partial x} + \\Psi^*\\frac{\\partial}{\\partial x}(V\\Psi)\\right)dx$."
            ],
            solution: [
              "Na substitutie en partiële integratie verdwijnen alle kinetische-energietermen.",
              "De potentiaaltermen geven:",
              "$\\frac{d\\langle p\\rangle}{dt} = -\\int\\Psi^*\\frac{\\partial V}{\\partial x}\\Psi\\,dx = \\left\\langle -\\frac{\\partial V}{\\partial x}\\right\\rangle$",
              "Dit is Ehrenfests theorema: $\\frac{d\\langle p\\rangle}{dt} = \\langle F \\rangle$, het quantumanalogoon van Newtons tweede wet."
            ],
          },
          {
            question: "Verifieer dat voor een harmonische oscillator ($V = \\frac{1}{2}m\\omega^2 x^2$) de verwachtingswaarden exact de klassieke bewegingsvergelijkingen volgen.",
            hints: [
              "Bereken $-\\frac{\\partial V}{\\partial x}$ voor $V = \\frac{1}{2}m\\omega^2 x^2$.",
              "Schrijf het stelsel van vergelijkingen voor $\\frac{d\\langle x\\rangle}{dt}$ en $\\frac{d\\langle p\\rangle}{dt}$."
            ],
            solution: [
              "$-\\frac{\\partial V}{\\partial x} = -m\\omega^2 x$, dus $\\frac{d\\langle p\\rangle}{dt} = -m\\omega^2\\langle x\\rangle$.",
              "Samen met $\\frac{d\\langle x\\rangle}{dt} = \\frac{\\langle p\\rangle}{m}$ geeft dit:",
              "$\\frac{d^2\\langle x\\rangle}{dt^2} = -\\omega^2\\langle x\\rangle$",
              "Dit is precies de klassieke bewegingsvergelijking voor een harmonische oscillator!",
              "De verwachtingswaarde oscilleert: $\\langle x\\rangle(t) = A\\cos(\\omega t + \\phi)$.",
              "Voor de HO geldt $\\langle F(x)\\rangle = F(\\langle x\\rangle)$ exact, omdat $V$ kwadratisch is."
            ],
          },
        ],
      },
      {
        label: "Opgave 4",
        title: "Het onzekerheidsprincipe en minimale onzekerheid",
        intro: "We onderzoeken het onzekerheidsprincipe kwantitatief voor specifieke golffuncties en laten zien dat het Gaussische golfpakket de minimale onzekerheid geeft.",
        steps: [
          {
            question: "Beschouw een deeltje in de toestand $\\Psi(x) = \\sqrt{\\frac{1}{2a}}$ voor $-a < x < a$ en $\\Psi = 0$ daarbuiten (uniforme verdeling). Bereken $\\langle x \\rangle$ en $\\langle x^2 \\rangle$.",
            hints: [
              "$\\langle x \\rangle = \\frac{1}{2a}\\int_{-a}^{a} x\\,dx$. Symmetrie-argument!",
              "$\\langle x^2 \\rangle = \\frac{1}{2a}\\int_{-a}^{a} x^2\\,dx$. Gebruik $\\int x^2 dx = x^3/3$."
            ],
            answer: ["a^2/3"],
            solution: [
              "$\\langle x \\rangle = \\frac{1}{2a}\\int_{-a}^{a} x\\,dx = 0$ (oneven integrand).",
              "$\\langle x^2 \\rangle = \\frac{1}{2a}\\int_{-a}^{a} x^2\\,dx = \\frac{1}{2a}\\cdot\\frac{2a^3}{3} = \\frac{a^2}{3}$",
              "Dus $\\sigma_x^2 = a^2/3$ en $\\sigma_x = a/\\sqrt{3}$."
            ],
          },
          {
            question: "Bereken $\\langle p \\rangle$ en $\\langle p^2 \\rangle$ voor dezelfde golffunctie. Let op: $\\Psi$ is constant binnen het interval, maar de afgeleide is niet overal gedefinieerd.",
            hints: [
              "Binnen het interval: $\\frac{d\\Psi}{dx} = 0$, dus $\\langle p \\rangle = 0$.",
              "Voor $\\langle p^2 \\rangle$: gebruik $\\langle p^2 \\rangle = -\\hbar^2\\int\\Psi^*\\frac{d^2\\Psi}{dx^2}\\,dx$. Binnen het interval is $\\frac{d^2\\Psi}{dx^2} = 0$, maar er zijn deltafunctie-bijdragen op de randen.",
              "Alternatief: gebruik $\\langle p^2 \\rangle = \\int|\\tilde{\\Psi}(k)|^2 \\hbar^2 k^2 dk$ via Fourier-analyse, of partiële integratie."
            ],
            solution: [
              "$\\langle p \\rangle = 0$ (de afgeleide van een constante is nul).",
              "Via partiële integratie: $\\langle p^2 \\rangle = -\\hbar^2\\left[\\Psi^*\\frac{d\\Psi}{dx}\\right]_{-a}^{a} + \\hbar^2\\int\\left|\\frac{d\\Psi}{dx}\\right|^2 dx$.",
              "De golffunctie springt op de randen, wat een oneindige $\\langle p^2 \\rangle$ geeft.",
              "Dit illustreert een belangrijk punt: een scherp begrensde golffunctie heeft een zeer brede impulsverdeling.",
              "In de praktijk gebruiken we gladde golffuncties om dit probleem te vermijden."
            ],
          },
          {
            question: "Vergelijk het onzekerheidsproduct $\\sigma_x\\sigma_p$ voor de volgende drie golffuncties op $t = 0$:\n(a) Gaussisch pakket: $\\sigma_x\\sigma_p = \\hbar/2$\n(b) Eerste aangeslagen toestand van de harmonische oscillator: $\\sigma_x\\sigma_p = 3\\hbar/2$\n(c) Grondtoestand oneindige put (breedte $a$): $\\sigma_x\\sigma_p = \\frac{\\hbar}{2}\\sqrt{\\frac{\\pi^2}{3} - 2} \\approx 0.57\\hbar$\n\nWelke golffunctie geeft de minimale onzekerheid? Waarom?",
            hints: [
              "Vergelijk de drie waarden met de ondergrens $\\hbar/2$.",
              "Welke golffunctie heeft een Gaussische vorm?"
            ],
            solution: [
              "(a) Gaussisch: $\\sigma_x\\sigma_p = \\hbar/2$ — precies de ondergrens!",
              "(b) Eerste aangeslagen toestand HO: $\\sigma_x\\sigma_p = 3\\hbar/2 > \\hbar/2$ ✓",
              "(c) Grondtoestand oneindige put: $\\sigma_x\\sigma_p \\approx 0.57\\hbar > \\hbar/2$ ✓",
              "Het Gaussische golfpakket geeft de minimale onzekerheid.",
              "Dit is een algemeen resultaat: alleen Gaussische golffuncties verzadigen het onzekerheidsprincipe.",
              "De wiskundige reden: de ongelijkheid van Cauchy-Schwarz (waaruit het onzekerheidsprincipe volgt) wordt een gelijkheid als de twee functies evenredig zijn — en dit leidt tot de Gauss-functie."
            ],
          },
        ],
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
        question: "De verwachtingswaarde van een observabele $Q$ wordt berekend als:",
        options: [
          "$\\langle Q \\rangle = \\int |\\Psi|^2\\,Q\\,dx$",
          "$\\langle Q \\rangle = \\int \\Psi\\,\\hat{Q}\\,\\Psi\\,dx$",
          "$\\langle Q \\rangle = \\int \\Psi^*\\,\\hat{Q}\\,\\Psi\\,dx$",
          "$\\langle Q \\rangle = \\int \\hat{Q}\\,|\\Psi|^2\\,dx$"
        ],
        correct: 2,
        explanation: "De verwachtingswaarde is het 'sandwichproduct': $\\langle Q \\rangle = \\int \\Psi^*\\hat{Q}\\Psi\\,dx$. Let op de volgorde: $\\Psi^*$ links, $\\hat{Q}$ in het midden, $\\Psi$ rechts."
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
        explanation: "$\\sigma_x \\sigma_p \\geq \\hbar/2$ is een fundamenteel principe, geen meetbeperking. Het volgt wiskundig uit $[\\hat{x}, \\hat{p}] = i\\hbar$."
      },
      {
        question: "Twee observabelen $A$ en $B$ kunnen simultaan scherp bepaald zijn als:",
        options: [
          "Ze dezelfde eenheden hebben",
          "Hun commutator nul is: $[\\hat{A}, \\hat{B}] = 0$",
          "Ze allebei Hermitisch zijn",
          "De golffunctie reëelwaardig is"
        ],
        correct: 1,
        explanation: "Commuterende observabelen delen eigentoestanden en kunnen tegelijk scherp bepaald zijn."
      },
      {
        question: "Welke golffunctie verzadigt het onzekerheidsprincipe ($\\sigma_x\\sigma_p = \\hbar/2$)?",
        options: [
          "De vlakke golf $e^{ikx}$",
          "De grondtoestand van de oneindige put",
          "Het Gaussische golfpakket",
          "Elke genormeerde golffunctie"
        ],
        correct: 2,
        explanation: "Alleen het Gaussische golfpakket bereikt de minimale onzekerheid $\\sigma_x\\sigma_p = \\hbar/2$."
      },
      {
        question: "Ehrenfests theorema stelt dat:",
        options: [
          "$\\frac{d\\langle x\\rangle}{dt} = \\langle x\\rangle / t$",
          "$\\frac{d\\langle p\\rangle}{dt} = \\langle -\\frac{\\partial V}{\\partial x}\\rangle$",
          "$\\langle p\\rangle = 0$ altijd",
          "De golffunctie altijd klassiek evolueert"
        ],
        correct: 1,
        explanation: "Ehrenfests theorema $\\frac{d\\langle p\\rangle}{dt} = \\langle -\\partial V/\\partial x\\rangle$ is het quantumanalogoon van Newtons tweede wet $F = dp/dt$."
      },
    ],
};

export default chapter5;
