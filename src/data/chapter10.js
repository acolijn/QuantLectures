const chapter10 = {
    id: 10,
    title: "Eindige Potentialen",
    subtitle: "De delta-potentiaal, eindige put, tunneling (Griffiths §2.5–2.6)",
    formulas: [
      { name: "Delta-potentiaal", latex: "V(x) = -\\alpha\\,\\delta(x)" },
      { name: "Gebonden toestand delta-potentiaal", latex: "E = -\\frac{m\\alpha^2}{2\\hbar^2}, \\quad \\psi(x) = \\frac{\\sqrt{m\\alpha}}{\\hbar}\\,e^{-m\\alpha|x|/\\hbar^2}" },
      { name: "Golfgetal (klassiek toegankelijk)", latex: "k = \\frac{\\sqrt{2m(E-V)}}{\\hbar}" },
      { name: "Vervalconstante (klassiek verboden)", latex: "\\kappa = \\frac{\\sqrt{2m(V_0-E)}}{\\hbar}" },
      { name: "Reflectiecoëfficiënt", latex: "R = \\frac{|B|^2}{|A|^2}" },
      { name: "Transmissiecoëfficiënt", latex: "T = \\frac{|F|^2}{|A|^2}, \\qquad R + T = 1" },
      { name: "Tunneling door barrière", latex: "T \\approx e^{-2\\kappa a} \\quad \\text{(brede barrière, } E < V_0\\text{)}" },
      { name: "Transcendente vergelijking (eindige put)", latex: "k\\tan(ka) = \\kappa \\quad \\text{(even)}, \\qquad -k\\cot(ka) = \\kappa \\quad \\text{(oneven)}" },
    ],
    concepts: [
      {
        title: "Eindige potentialen: overzicht (Griffiths §2.5–2.6)",
        content: "In de vorige hoofdstukken behandelden we de oneindige put en de harmonische oscillator — beide met oneindig hoge 'muren'. Nu bekijken we eindige potentialen, die realistischer zijn. De nieuwe fenomenen:\n\n- **Doordringing**: de golffunctie is niet nul in het klassiek verboden gebied ($E < V$)\n- **Tunneling**: een deeltje kan door een potentiaalbarrière heen, ook al is $E < V_0$\n- **Eindig aantal gebonden toestanden**: een eindige put heeft maar een beperkt aantal gebonden niveaus\n\nGriffiths behandelt achtereenvolgens: de delta-potentiaal (§2.5, een wiskundig ideaal maar instructief model), en de eindige vierkante put en barrière (§2.6)."
      },
      {
        title: "De delta-potentiaal: $V(x) = -\\alpha\\,\\delta(x)$",
        content: "De delta-potentiaal is een oneindig smalle, oneindig diepe put met eindige 'sterkte' $\\alpha > 0$:\n\n$$V(x) = -\\alpha\\,\\delta(x)$$\n\nDit is een wiskundig ideaal — fysisch benadert het een zeer smalle, diepe put. De delta-functie $\\delta(x)$ is nul overal behalve bij $x = 0$, met $\\int\\delta(x)\\,dx = 1$. De Schrödingervergelijking is:\n\n$$-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} - \\alpha\\,\\delta(x)\\psi = E\\psi$$\n\nDe randvoorwaarden bij $x = 0$ zijn: $\\psi$ is continu, maar $d\\psi/dx$ heeft een sprong: $\\Delta(d\\psi/dx) = -2m\\alpha\\psi(0)/\\hbar^2$."
      },
      {
        title: "Gebonden toestand van de delta-potentiaal",
        content: "Voor $E < 0$ (gebonden toestand) is de oplossing links en rechts van $x = 0$:\n\n$$\\psi(x) = \\begin{cases} Be^{\\kappa x} & x < 0 \\\\ Be^{-\\kappa x} & x > 0 \\end{cases}, \\qquad \\kappa = \\frac{\\sqrt{-2mE}}{\\hbar}$$\n\nDe continuïteit van $\\psi$ bij $x = 0$ geeft hetzelfde $B$ links en rechts. De sprong in de afgeleide geeft:\n\n$$-2B\\kappa = -\\frac{2m\\alpha}{\\hbar^2}B \\implies \\kappa = \\frac{m\\alpha}{\\hbar^2}$$\n\nDus er is precies één gebonden toestand met energie $E = -\\hbar^2\\kappa^2/(2m) = -m\\alpha^2/(2\\hbar^2)$. De genormeerde golffunctie is:\n\n$$\\psi(x) = \\frac{\\sqrt{m\\alpha}}{\\hbar}\\,e^{-m\\alpha|x|/\\hbar^2}$$\n\nOngeacht hoe zwak de delta-potentiaal is ($\\alpha$ klein), er is altijd precies één gebonden toestand."
      },
      {
        title: "Verstrooiing aan de delta-potentiaal",
        content: "Voor $E > 0$ (verstrooiingstoestanden) komt een golf van links in en wordt deels gereflecteerd, deels getransmitteerd:\n\n$$\\psi(x) = \\begin{cases} Ae^{ikx} + Be^{-ikx} & x < 0 \\\\ Fe^{ikx} & x > 0 \\end{cases}$$\n\nmet $k = \\sqrt{2mE}/\\hbar$. De randvoorwaarden bij $x = 0$ geven:\n\n$$R = \\frac{|B|^2}{|A|^2} = \\frac{1}{1 + 2\\hbar^2E/(m\\alpha^2)}, \\qquad T = 1 - R = \\frac{1}{1 + m\\alpha^2/(2\\hbar^2E)}$$\n\nOpmerkelijk: zelfs voor $E > 0$ is er reflectie ($R \\neq 0$) — klassiek zou het deeltje gewoon doorlopen. Bij hoge energie ($E \\gg m\\alpha^2/\\hbar^2$) nadert $T \\to 1$."
      },
      {
        title: "De eindige vierkante put",
        content: "De eindige vierkante put heeft de potentiaal:\n\n$$V(x) = \\begin{cases} -V_0 & -a < x < a \\\\ 0 & |x| > a \\end{cases}$$\n\nVoor gebonden toestanden ($-V_0 < E < 0$) is de golffunctie oscillerend binnen de put ($\\psi \\sim \\sin(lx)$ of $\\cos(lx)$ met $l = \\sqrt{2m(E+V_0)}/\\hbar$) en exponentieel afnemend daarbuiten ($\\psi \\sim e^{-\\kappa|x|}$ met $\\kappa = \\sqrt{-2mE}/\\hbar$). De golffunctie dringt door in het klassiek verboden gebied — dit heet 'evanescente golf'."
      },
      {
        title: "Transcendente vergelijkingen en grafische oplossing",
        content: "De randvoorwaarden (continuïteit van $\\psi$ en $d\\psi/dx$ bij $x = \\pm a$) leiden tot transcendente vergelijkingen die niet analytisch oplosbaar zijn. Door de symmetrie van de potentiaal zijn de oplossingen even of oneven:\n\n- **Even oplossingen**: $\\kappa = l\\tan(la)$\n- **Oneven oplossingen**: $\\kappa = -l\\cot(la)$\n\nmet de extra relatie $l^2 + \\kappa^2 = 2mV_0/\\hbar^2$. Grafisch: teken de cirkelboog $\\kappa^2 + l^2 = 2mV_0/\\hbar^2$ samen met de curven $\\kappa = l\\tan(la)$ en $\\kappa = -l\\cot(la)$. De snijpunten geven de gebonden toestanden.\n\nBelangrijke conclusies:\n- Er is altijd minstens één gebonden toestand (de even grondtoestand)\n- Het aantal gebonden toestanden is eindig en groeit met $V_0a^2$\n- De energieën liggen hoger dan bij de oneindige put (minder confinement)"
      },
      {
        title: "De potentiaalbarrière en tunneling",
        content: "Een potentiaalbarrière is het omgekeerde van een put:\n\n$$V(x) = \\begin{cases} V_0 & 0 < x < a \\\\ 0 & \\text{elders} \\end{cases}$$\n\nKlassiek: als $E < V_0$ kan het deeltje de barrière niet passeren. Quantummechanisch: de golffunctie neemt exponentieel af in de barrière ($\\psi \\sim e^{-\\kappa x}$ met $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$), maar is niet nul aan de andere kant. Er is een transmissiekans:\n\n$$T \\approx e^{-2\\kappa a} = e^{-2a\\sqrt{2m(V_0-E)}/\\hbar}$$\n\nDeze benadering geldt voor een brede/hoge barrière ($\\kappa a \\gg 1$). De tunnelkans:\n- Neemt exponentieel af met de barrièrebreedte $a$\n- Neemt exponentieel af met $\\sqrt{V_0 - E}$ (hoe hoger de barrière boven $E$, hoe kleiner $T$)\n- Neemt af met $\\sqrt{m}$ (zware deeltjes tunnelen minder)"
      },
      {
        title: "Toepassingen van tunneling",
        content: "Tunneling is niet slechts een theoretisch curiosum — het verklaart veel fysische verschijnselen:\n\n- **Alfa-verval**: een alfa-deeltje ($^4$He-kern) 'tunnelt' door de Coulomb-barrière van de kern. De enorme gevoeligheid $T \\sim e^{-2\\kappa a}$ verklaart het enorme bereik van halveringstijden ($10^{-7}$ s tot $10^{17}$ jaar)\n- **Scanning Tunneling Microscope (STM)**: een naaldpunt nadert een oppervlak tot ~1 nm. De tunnelstroom ($I \\propto e^{-2\\kappa d}$) is extreem gevoelig voor de afstand $d$, waardoor atoomresolutie mogelijk is\n- **Tunneldiode**: elektronen tunnelen door een dunne barrière in halfgeleiders\n- **Kernfusie in sterren**: protonen in de zon hebben onvoldoende thermische energie om de Coulomb-barrière te overwinnen, maar tunneling maakt fusie mogelijk"
      },
      {
        title: "Vergelijking: oneindige put, eindige put, vrij deeltje",
        content: "De drie modellen laten een geleidelijke overgang zien:\n\n| Eigenschap | Oneindige put | Eindige put | Vrij deeltje |\n|---|---|---|---|\n| Gebonden toestanden | Oneindig veel | Eindig veel | Geen |\n| Spectrum | Discreet | Discreet (gebonden) + continu | Continu |\n| $\\psi$ buiten put | $= 0$ | Doordringend ($e^{-\\kappa x}$) | Overal |\n| Energieniveaus | $E_n \\propto n^2$ | Lager dan oneindige put | $E = \\hbar^2k^2/(2m)$ |\n\nDe eindige put interpoleert tussen de extreme gevallen. Het doordringen van de golffunctie in het verboden gebied verlaagt de energie (het deeltje 'voelt' een effectief bredere put) en beperkt het aantal gebonden toestanden."
      },
    ],
    exercises: [
      {
        label: "Opgave 1",
        title: "De gebonden toestand van de delta-potentiaal",
        intro: "We leiden de enige gebonden toestand af van $V(x) = -\\alpha\\,\\delta(x)$.",
        steps: [
          {
            question: "Voor $E < 0$, schrijf de TISV op voor $x \\neq 0$ (waar $V = 0$). Wat is de algemene oplossing?",
            hints: [
              "Voor $x \\neq 0$: $-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} = E\\psi$ met $E < 0$.",
              "Definieer $\\kappa = \\sqrt{-2mE}/\\hbar > 0$, dan: $d^2\\psi/dx^2 = \\kappa^2\\psi$."
            ],
            solution: [
              "$\\frac{d^2\\psi}{dx^2} = \\kappa^2\\psi$ met $\\kappa = \\sqrt{-2mE}/\\hbar$.",
              "Algemene oplossing: $\\psi = Ce^{\\kappa x} + De^{-\\kappa x}$.",
              "Voor $x > 0$: eis $\\psi \\to 0$ als $x \\to \\infty$, dus $C = 0$: $\\psi = Be^{-\\kappa x}$.",
              "Voor $x < 0$: eis $\\psi \\to 0$ als $x \\to -\\infty$, dus $D = 0$: $\\psi = Be^{\\kappa x}$.",
              "Continuïteit bij $x = 0$ geeft dezelfde constante $B$ in beide gebieden."
            ],
          },
          {
            question: "Integreer de TISV van $-\\epsilon$ tot $+\\epsilon$ en neem de limiet $\\epsilon \\to 0$. Leid de sprong in $d\\psi/dx$ af bij $x = 0$.",
            hints: [
              "$\\int_{-\\epsilon}^{\\epsilon}\\left[-\\frac{\\hbar^2}{2m}\\psi'' - \\alpha\\delta(x)\\psi\\right]dx = E\\int_{-\\epsilon}^{\\epsilon}\\psi\\,dx$.",
              "De rechterterm gaat naar 0 als $\\epsilon \\to 0$ (want $\\psi$ is continu en eindig).",
              "$\\int_{-\\epsilon}^{\\epsilon}\\delta(x)\\psi\\,dx = \\psi(0)$."
            ],
            solution: [
              "$-\\frac{\\hbar^2}{2m}\\left[\\psi'(\\epsilon) - \\psi'(-\\epsilon)\\right] - \\alpha\\psi(0) = 0$",
              "$\\Delta\\psi' = \\psi'(0^+) - \\psi'(0^-) = -\\frac{2m\\alpha}{\\hbar^2}\\psi(0)$",
              "De afgeleide maakt een sprong bij $x = 0$, proportioneel met $\\psi(0)$."
            ],
          },
          {
            question: "Pas de sprong-voorwaarde toe om $\\kappa$ te bepalen en vind de energie $E$.",
            hints: [
              "$\\psi'(0^+) = -B\\kappa$ en $\\psi'(0^-) = B\\kappa$.",
              "Dus $\\Delta\\psi' = -2B\\kappa$."
            ],
            answer: ["-m*alpha^2/(2*hbar^2)"],
            solution: [
              "$-2B\\kappa = -\\frac{2m\\alpha}{\\hbar^2}B \\implies \\kappa = \\frac{m\\alpha}{\\hbar^2}$",
              "$E = -\\frac{\\hbar^2\\kappa^2}{2m} = -\\frac{m\\alpha^2}{2\\hbar^2}$",
              "Er is precies één gebonden toestand, ongeacht de waarde van $\\alpha$."
            ],
          },
        ],
      },
      {
        label: "Opgave 2",
        title: "Verstrooiing aan de delta-potentiaal",
        intro: "We berekenen de reflectie- en transmissiecoëfficiënten voor een deeltje met $E > 0$ dat een delta-barrière $V(x) = \\alpha\\,\\delta(x)$ tegenkomt.",
        steps: [
          {
            question: "Stel de golffunctie op: $\\psi = Ae^{ikx} + Be^{-ikx}$ voor $x < 0$ en $\\psi = Fe^{ikx}$ voor $x > 0$ (geen inkomende golf van rechts). Pas de continuïteitsvoorwaarde toe bij $x = 0$.",
            hints: [
              "$\\psi(0^-) = A + B$ en $\\psi(0^+) = F$.",
              "Continuïteit: $A + B = F$."
            ],
            solution: [
              "$\\psi$ continu bij $x = 0$: $A + B = F$."
            ],
          },
          {
            question: "Pas de sprong-voorwaarde toe: $\\Delta\\psi' = \\frac{2m\\alpha}{\\hbar^2}\\psi(0)$ (let op: positieve $\\alpha$ voor een barrière). Los op voor $B$ en $F$ in termen van $A$.",
            hints: [
              "$\\psi'(0^+) = ikF$ en $\\psi'(0^-) = ik(A - B)$.",
              "$ikF - ik(A - B) = \\frac{2m\\alpha}{\\hbar^2}F$.",
              "Combineer met $A + B = F$."
            ],
            solution: [
              "$ikF - ikA + ikB = \\frac{2m\\alpha}{\\hbar^2}F$",
              "Met $F = A + B$: $ik(A+B) - ikA + ikB = \\frac{2m\\alpha}{\\hbar^2}(A+B)$",
              "$2ikB = \\frac{2m\\alpha}{\\hbar^2}(A+B)$",
              "Definieer $\\beta \\equiv m\\alpha/(\\hbar^2 k)$, dan: $B = \\frac{\\beta}{1 - i\\beta}A$ en $F = \\frac{1}{1-i\\beta}A$."
            ],
          },
          {
            question: "Bereken $R = |B/A|^2$ en $T = |F/A|^2$. Verifieer dat $R + T = 1$.",
            hints: [
              "$|1-i\\beta|^2 = 1 + \\beta^2$."
            ],
            solution: [
              "$R = \\frac{\\beta^2}{1 + \\beta^2} = \\frac{1}{1 + 2\\hbar^2E/(m\\alpha^2)}$",
              "$T = \\frac{1}{1 + \\beta^2} = \\frac{1}{1 + m\\alpha^2/(2\\hbar^2E)}$",
              "$R + T = \\frac{\\beta^2 + 1}{1 + \\beta^2} = 1$ ✓",
              "Voor hoge energie ($E \\gg m\\alpha^2/\\hbar^2$): $T \\to 1$ — het deeltje gaat er vrijwel ongehinderd doorheen."
            ],
          },
        ],
      },
      {
        label: "Opgave 3",
        title: "De eindige vierkante put",
        intro: "We analyseren de gebonden toestanden van de eindige vierkante put met diepte $V_0$ en halve breedte $a$.",
        steps: [
          {
            question: "Schrijf de TISV op in de drie gebieden ($x < -a$, $-a < x < a$, $x > a$) en geef de algemene oplossing in elk gebied. Definieer $l = \\sqrt{2m(E+V_0)}/\\hbar$ en $\\kappa = \\sqrt{-2mE}/\\hbar$.",
            hints: [
              "Binnen de put ($|x| < a$): $V = -V_0$, dus $d^2\\psi/dx^2 = -l^2\\psi$ → oscillerend.",
              "Buiten de put ($|x| > a$): $V = 0$, $E < 0$, dus $d^2\\psi/dx^2 = \\kappa^2\\psi$ → exponentieel."
            ],
            solution: [
              "Binnen ($|x| < a$): $\\psi = C\\sin(lx) + D\\cos(lx)$",
              "Buiten ($x > a$): $\\psi = Fe^{-\\kappa x}$ (normeerbaar)",
              "Buiten ($x < -a$): $\\psi = Ge^{\\kappa x}$ (normeerbaar)",
              "Door de symmetrie van $V(x)$: even oplossingen ($D\\cos(lx)$, $C = 0$) en oneven ($C\\sin(lx)$, $D = 0$)."
            ],
          },
          {
            question: "Pas de randvoorwaarden toe bij $x = a$ voor de even oplossingen ($\\psi = D\\cos(lx)$ binnen). Leid de transcendente vergelijking af.",
            hints: [
              "Continuïteit: $D\\cos(la) = Fe^{-\\kappa a}$.",
              "Continuïteit van de afgeleide: $-Dl\\sin(la) = -F\\kappa e^{-\\kappa a}$.",
              "Deel de tweede vergelijking door de eerste."
            ],
            solution: [
              "$\\frac{-Dl\\sin(la)}{D\\cos(la)} = \\frac{-F\\kappa e^{-\\kappa a}}{Fe^{-\\kappa a}}$",
              "$l\\tan(la) = \\kappa$",
              "Met $l^2 + \\kappa^2 = 2mV_0/\\hbar^2$ (volgt uit de definities van $l$ en $\\kappa$).",
              "Dit stelsel moet numeriek of grafisch worden opgelost."
            ],
          },
          {
            question: "Definieer dimensieloze variabelen $z = la$ en $z_0 = a\\sqrt{2mV_0}/\\hbar$. Herschrijf de vergelijking en argumenteer dat er altijd minstens één gebonden toestand is.",
            hints: [
              "$\\kappa a = \\sqrt{z_0^2 - z^2}$ (uit $l^2 + \\kappa^2 = 2mV_0/\\hbar^2$).",
              "De vergelijking wordt: $\\sqrt{z_0^2 - z^2} = z\\tan z$ met $0 < z < z_0$.",
              "Bekijk het gedrag bij $z \\to 0$."
            ],
            solution: [
              "De transcendente vergelijking: $\\sqrt{z_0^2 - z^2} = z\\tan z$",
              "Bij $z \\to 0$: linkerlid $\\to z_0 > 0$, rechterlid $\\to 0$.",
              "Bij $z \\to \\pi/2$ (eerste tak): linkerlid daalt, rechterlid $\\to \\infty$.",
              "Er is altijd een snijpunt — dus altijd minstens één even gebonden toestand.",
              "Meer snijpunten verschijnen als $z_0$ groeit (diepere/bredere put)."
            ],
          },
        ],
      },
      {
        label: "Opgave 4",
        title: "Tunneling door een rechthoekige barrière",
        intro: "We leiden de tunnelformule af voor een rechthoekige barrière met hoogte $V_0$ en breedte $a$, voor een deeltje met $E < V_0$.",
        steps: [
          {
            question: "Schrijf de golffunctie op in de drie gebieden: links ($x < 0$), in de barrière ($0 < x < a$), en rechts ($x > a$).",
            hints: [
              "Links: inkomende + gereflecteerde golf $\\psi = Ae^{ikx} + Be^{-ikx}$.",
              "In barrière: $\\psi = Ce^{\\kappa x} + De^{-\\kappa x}$ (exponentieel, niet oscillerend).",
              "Rechts: alleen getransmitteerde golf $\\psi = Fe^{ikx}$."
            ],
            solution: [
              "Links ($x < 0$): $\\psi = Ae^{ikx} + Be^{-ikx}$ met $k = \\sqrt{2mE}/\\hbar$",
              "Barrière ($0 < x < a$): $\\psi = Ce^{\\kappa x} + De^{-\\kappa x}$ met $\\kappa = \\sqrt{2m(V_0-E)}/\\hbar$",
              "Rechts ($x > a$): $\\psi = Fe^{ikx}$"
            ],
          },
          {
            question: "Er zijn vier randvoorwaarden (continuïteit van $\\psi$ en $\\psi'$ bij $x = 0$ en $x = a$) en vijf onbekenden ($A, B, C, D, F$). Hoeveel vergelijkingen zijn er en wat kun je bepalen?",
            hints: [
              "4 vergelijkingen, 5 onbekenden. Je kunt $B, C, D, F$ uitdrukken in $A$.",
              "De transmissiecoëfficiënt is $T = |F/A|^2$."
            ],
            solution: [
              "4 vergelijkingen voor 5 onbekenden → lossen op voor $B/A, C/A, D/A, F/A$.",
              "We hoeven alleen $F/A$ (transmissie) en $B/A$ (reflectie) te berekenen.",
              "De algebra is bewerkelijk maar recht-toe-recht-aan."
            ],
          },
          {
            question: "Het exacte resultaat is $T^{-1} = 1 + \\frac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0-E)}$. Laat zien dat voor $\\kappa a \\gg 1$ dit vereenvoudigt tot $T \\approx \\frac{16E(V_0-E)}{V_0^2}e^{-2\\kappa a}$.",
            hints: [
              "Voor grote $x$: $\\sinh(x) \\approx e^x/2$.",
              "$\\sinh^2(\\kappa a) \\approx e^{2\\kappa a}/4$."
            ],
            solution: [
              "$T^{-1} \\approx 1 + \\frac{V_0^2}{4E(V_0-E)} \\cdot \\frac{e^{2\\kappa a}}{4} \\approx \\frac{V_0^2}{16E(V_0-E)}e^{2\\kappa a}$",
              "$T \\approx \\frac{16E(V_0-E)}{V_0^2}\\,e^{-2\\kappa a}$",
              "Het dominante gedrag is exponentieel: $T \\sim e^{-2\\kappa a}$.",
              "De prefactor hangt zwak af van $E/V_0$ maar de exponentiële term domineert."
            ],
          },
        ],
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
        explanation: "Het deeltje wint geen energie — de golffunctie neemt exponentieel af in de barrière maar is niet nul aan de andere kant."
      },
      {
        question: "Hoeveel gebonden toestanden heeft de delta-potentiaal $V = -\\alpha\\,\\delta(x)$?",
        options: [
          "Geen",
          "Precies één",
          "Twee",
          "Oneindig veel"
        ],
        correct: 1,
        explanation: "De delta-potentiaal heeft altijd precies één gebonden toestand met $E = -m\\alpha^2/(2\\hbar^2)$, ongeacht de sterkte $\\alpha$."
      },
      {
        question: "Als de breedte van een potentiaalbarrière verdubbelt, neemt de tunnelkans:",
        options: [
          "Lineair af",
          "Kwadratisch af",
          "Exponentieel af",
          "Niet af"
        ],
        correct: 2,
        explanation: "$T \\propto e^{-2\\kappa a}$: verdubbeling van $a$ geeft $T \\to T^2$, een drastische (exponentiële) afname."
      },
      {
        question: "De golffunctie in het klassiek verboden gebied ($E < V$) is:",
        options: [
          "Oscillerend (sinus/cosinus)",
          "Exponentieel afnemend",
          "Constant",
          "Exact nul"
        ],
        correct: 1,
        explanation: "De golffunctie is $\\propto e^{-\\kappa x}$ — ze neemt exponentieel af maar is niet nul. Het deeltje 'dringt door' in het verboden gebied."
      },
      {
        question: "Welke bewering over de eindige vierkante put is correct?",
        options: [
          "Er zijn altijd oneindig veel gebonden toestanden",
          "Er is altijd minstens één gebonden toestand",
          "Er zijn geen gebonden toestanden als de put ondiep is",
          "De energieniveaus zijn hoger dan bij de oneindige put"
        ],
        correct: 1,
        explanation: "Een eindige put in 1D heeft altijd minstens één gebonden toestand. De energieniveaus liggen lager (minder negatief) dan bij de oneindige put — maar er zijn er eindig veel."
      },
      {
        question: "De sprong in $d\\psi/dx$ bij de delta-potentiaal $V = -\\alpha\\delta(x)$ is:",
        options: [
          "$\\Delta\\psi' = 0$",
          "$\\Delta\\psi' = -\\frac{2m\\alpha}{\\hbar^2}\\psi(0)$",
          "$\\Delta\\psi' = \\alpha\\psi(0)$",
          "$\\psi$ zelf is discontinu"
        ],
        correct: 1,
        explanation: "Bij de delta-potentiaal is $\\psi$ continu maar $d\\psi/dx$ maakt een sprong van $-2m\\alpha\\psi(0)/\\hbar^2$."
      },
      {
        question: "De transmissiecoëfficiënt door een delta-barrière bij hoge energie ($E \\gg m\\alpha^2/\\hbar^2$) nadert:",
        options: [
          "$T \\to 0$",
          "$T \\to 1/2$",
          "$T \\to 1$",
          "$T$ oscilleert"
        ],
        correct: 2,
        explanation: "$T = 1/(1 + m\\alpha^2/(2\\hbar^2E))$. Voor $E \\to \\infty$ wordt de noemer $\\to 1$, dus $T \\to 1$: het deeltje merkt de barrière nauwelijks."
      },
      {
        question: "Welke toepassing berust op quantumtunneling?",
        options: [
          "De laser",
          "De scanning tunneling microscope (STM)",
          "De Stern-Gerlach-opstelling",
          "De dubbelspleetexperiment"
        ],
        correct: 1,
        explanation: "De STM meet de tunnelstroom ($I \\propto e^{-2\\kappa d}$) tussen een naaldpunt en een oppervlak. De exponentiële afstandsafhankelijkheid geeft atoomresolutie."
      },
    ],
};

export default chapter10;
