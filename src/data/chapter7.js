const chapter7 = {
    id: 7,
    title: "De Oneindig Diepe Potentiaalput",
    subtitle: "Deeltje in een doos, energiekwantisatie, golffuncties (Griffiths §2.2)",
    formulas: [
      { name: "Potentiaal", latex: "V(x) = \\begin{cases} 0 & 0 < x < a \\\\ \\infty & \\text{anders} \\end{cases}" },
      { name: "TISV binnen de put", latex: "-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} = E\\psi \\quad \\Rightarrow \\quad \\frac{d^2\\psi}{dx^2} = -k^2\\psi, \\quad k = \\frac{\\sqrt{2mE}}{\\hbar}" },
      { name: "Algemene oplossing", latex: "\\psi(x) = A\\sin(kx) + B\\cos(kx)" },
      { name: "Golffuncties", latex: "\\psi_n(x) = \\sqrt{\\frac{2}{a}} \\sin\\left(\\frac{n\\pi x}{a}\\right), \\quad n = 1, 2, 3, \\ldots" },
      { name: "Energieniveaus", latex: "E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2ma^2} = n^2 E_1" },
      { name: "Nulpuntsenergie", latex: "E_1 = \\frac{\\pi^2 \\hbar^2}{2ma^2} > 0" },
      { name: "Orthonormaliteit", latex: "\\int_0^a \\psi_m(x)\\,\\psi_n(x)\\,dx = \\delta_{mn}" },
      { name: "Volledigheid (Fourier-sinusreeks)", latex: "f(x) = \\sum_{n=1}^{\\infty} c_n\\,\\psi_n(x), \\quad c_n = \\int_0^a \\psi_n(x)\\,f(x)\\,dx" },
    ],
    concepts: [
      {
        title: "Het probleem: deeltje in een doos (Griffiths §2.2)",
        content: "De oneindig diepe potentiaalput is het eenvoudigste niet-triviale quantummechanische probleem. De potentiaal is:\n\n$$V(x) = \\begin{cases} 0 & 0 < x < a \\\\ \\infty & \\text{elders} \\end{cases}$$\n\nBuiten de put is de potentiaal oneindig, dus het deeltje kan daar niet zijn: $\\psi(x) = 0$ voor $x \\leq 0$ en $x \\geq a$. Binnen de put is $V = 0$, en de TISV wordt:\n\n$$-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} = E\\psi$$\n\nDit is een vrij-deeltjesvergelijking, maar met randvoorwaarden die de oplossingen drastisch beperken. Het is analoog aan een trillende snaar die aan beide uiteinden is vastgemaakt."
      },
      {
        title: "De differentiaalvergelijking oplossen",
        content: "Herschrijf de TISV als:\n\n$$\\frac{d^2\\psi}{dx^2} = -k^2\\psi, \\qquad k \\equiv \\frac{\\sqrt{2mE}}{\\hbar}$$\n\nDit is de bekende harmonische-oscillatorvergelijking met algemene oplossing:\n\n$$\\psi(x) = A\\sin(kx) + B\\cos(kx)$$\n\nDe constanten $A$, $B$ en $k$ worden bepaald door de randvoorwaarden en de normering. Merk op dat $E$ moet positief zijn — een negatieve energie zou leiden tot exponentieel groeiende oplossingen die niet normeerbaar zijn."
      },
      {
        title: "Randvoorwaarden en kwantisatie",
        content: "De golffunctie moet continu zijn op de randen van de put. Omdat $\\psi = 0$ buiten de put, eisen we:\n\n1. $\\psi(0) = 0$: dit geeft $B = 0$ (want $\\cos(0) = 1$, $\\sin(0) = 0$)\n2. $\\psi(a) = 0$: dit geeft $A\\sin(ka) = 0$\n\nAangezien $A = 0$ de triviale (niet-fysische) oplossing geeft, moet $\\sin(ka) = 0$, oftewel:\n\n$$ka = n\\pi, \\qquad n = 1, 2, 3, \\ldots$$\n\nHieruit volgen de discrete energieniveaus: $E_n = \\frac{n^2\\pi^2\\hbar^2}{2ma^2}$. De randvoorwaarden forceren kwantisatie — niet alle energieën zijn toegestaan, alleen bepaalde discrete waarden. Dit is fundamenteel anders dan klassiek, waar elk energie in de put mogelijk is. We nemen $n \\geq 1$ omdat $n = 0$ de triviale oplossing $\\psi = 0$ geeft, en negatieve $n$ geen nieuwe oplossingen opleveren (ze geven dezelfde $\\psi$ op een teken na)."
      },
      {
        title: "De genormeerde golffuncties",
        content: "Na normering ($\\int_0^a|\\psi_n|^2\\,dx = 1$) vinden we:\n\n$$\\psi_n(x) = \\sqrt{\\frac{2}{a}}\\sin\\left(\\frac{n\\pi x}{a}\\right)$$\n\nDeze golffuncties zijn staande golven met een geheel aantal halve golflengten in de put: $a = n \\cdot \\lambda/2$, oftewel $\\lambda_n = 2a/n$. De golffunctie $\\psi_n$ heeft precies $n - 1$ knopen (nulpunten) in het inwendige van de put. De grondtoestand ($n = 1$) heeft geen knopen, de eerste aangeslagen toestand ($n = 2$) heeft één knoop (in het midden), enzovoort. Dit is een algemeen patroon: hogere energieën corresponderen met meer knopen. De golffuncties zijn reëel en alterneren in pariteit rond het midden van de put: $\\psi_1$ is symmetrisch, $\\psi_2$ antisymmetrisch, enz."
      },
      {
        title: "Energieniveaus en nulpuntsenergie",
        content: "De energieniveaus zijn:\n\n$$E_n = n^2\\frac{\\pi^2\\hbar^2}{2ma^2} = n^2 E_1$$\n\nBelangrijke eigenschappen:\n- **Kwadratische groei**: $E_n \\propto n^2$. De afstand tussen opeenvolgende niveaus groeit: $E_{n+1} - E_n = (2n+1)E_1$.\n- **Nulpuntsenergie**: $E_1 = \\pi^2\\hbar^2/(2ma^2) > 0$. Het deeltje kan nooit in rust zijn — dit is een direct gevolg van het onzekerheidsprincipe. Als het deeltje in de put zit, is $\\sigma_x \\lesssim a$, dus $\\sigma_p \\gtrsim \\hbar/(2a)$, en daarmee $\\langle p^2 \\rangle > 0$, dus $E > 0$.\n- **Schaling**: $E_n \\propto 1/a^2$ (smallere put = hogere energie) en $E_n \\propto 1/m$ (lichter deeltje = hogere energie)."
      },
      {
        title: "Orthonormaliteit en volledigheid",
        content: "De golffuncties zijn orthonormaal:\n\n$$\\int_0^a \\psi_m(x)\\,\\psi_n(x)\\,dx = \\delta_{mn}$$\n\nDit is te bewijzen met de standaardintegraal $\\int_0^a \\sin(m\\pi x/a)\\sin(n\\pi x/a)\\,dx$, die nul is voor $m \\neq n$ en $a/2$ voor $m = n$. De factor $\\sqrt{2/a}$ in de normering is precies zo gekozen dat de integraal 1 geeft.\n\nBovendien vormen de $\\psi_n$ een volledige set: elke (stuksgewijs gladde) functie $f(x)$ op $[0, a]$ kan worden geschreven als:\n\n$$f(x) = \\sum_{n=1}^{\\infty} c_n\\,\\psi_n(x) = \\sqrt{\\frac{2}{a}}\\sum_{n=1}^{\\infty} c_n\\sin\\left(\\frac{n\\pi x}{a}\\right)$$\n\nDit is precies de Fourier-sinusreeks. De coëfficiënten worden bepaald door de Fourier-truc: $c_n = \\int_0^a \\psi_n(x)\\,f(x)\\,dx$."
      },
      {
        title: "De volledige tijdsafhankelijke oplossing",
        content: "Met de resultaten van hoofdstuk 6 (scheiding van variabelen) is de volledige tijdsafhankelijke oplossing:\n\n$$\\Psi(x,t) = \\sum_{n=1}^{\\infty} c_n\\sqrt{\\frac{2}{a}}\\sin\\left(\\frac{n\\pi x}{a}\\right)e^{-iE_nt/\\hbar}$$\n\nmet $E_n = n^2\\pi^2\\hbar^2/(2ma^2)$. Gegeven de begintoestand $\\Psi(x,0)$ bepalen we de coëfficiënten:\n\n$$c_n = \\sqrt{\\frac{2}{a}}\\int_0^a \\sin\\left(\\frac{n\\pi x}{a}\\right)\\Psi(x,0)\\,dx$$\n\nElke term oscilleert met zijn eigen frequentie $\\omega_n = E_n/\\hbar = n^2\\pi^2\\hbar/(2ma^2)$. Een superposietoestand heeft een kansdichtheid die in de tijd oscilleert — het deeltje 'klotst' heen en weer in de put."
      },
      {
        title: "Klassieke limiet",
        content: "Klassiek kan een deeltje in een doos elke energie hebben en stuitert het met constante snelheid heen en weer. De kansverdeling is dan uniform: $\\rho_{\\text{klass}} = 1/a$. De quantummechanische kansdichtheid $|\\psi_n|^2 = (2/a)\\sin^2(n\\pi x/a)$ heeft $n-1$ knopen en is niet uniform. Maar voor grote $n$ oscilleert $\\sin^2$ zo snel dat het gemiddelde naar $1/2$ gaat, en $\\langle |\\psi_n|^2 \\rangle \\to 2/(2a) = 1/a$ — precies het klassieke resultaat. Dit is weer het correspondentieprincipe: voor grote kwantumgetallen benadert de QM de klassieke fysica."
      },
    ],
    exercises: [
      {
        label: "Opgave 1",
        title: "De oneindig diepe put oplossen",
        intro: "We lossen de TISV stap voor stap op voor de oneindig diepe potentiaalput en leiden de energieniveaus en golffuncties af.",
        steps: [
          {
            question: "Buiten de put ($x < 0$ en $x > a$) is $V = \\infty$. Beargumenteer dat $\\psi(x) = 0$ buiten de put.",
            hints: [
              "Als $V \\to \\infty$ en $E$ eindig is, wat moet er dan met $\\psi$ gebeuren?",
              "Een niet-nul $\\psi$ bij oneindige $V$ zou een oneindige energie impliceren."
            ],
            solution: [
              "Als $V = \\infty$ en $E$ eindig, dan eist de TISV $(-\\hbar^2/2m)\\psi'' + \\infty \\cdot \\psi = E\\psi$.",
              "De enige manier om dit consistent te maken is $\\psi = 0$ waar $V = \\infty$.",
              "Fysisch: het deeltje heeft nul kans om in een gebied met oneindige potentiaal te zijn."
            ],
          },
          {
            question: "Binnen de put ($0 < x < a$) is $V = 0$. Schrijf de TISV op en toon aan dat de algemene oplossing $\\psi(x) = A\\sin(kx) + B\\cos(kx)$ is met $k = \\sqrt{2mE}/\\hbar$.",
            hints: [
              "De TISV wordt $-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} = E\\psi$.",
              "Herschrijf als $\\psi'' = -k^2\\psi$. Dit is de vergelijking van een harmonische oscillator."
            ],
            solution: [
              "$-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} = E\\psi \\implies \\frac{d^2\\psi}{dx^2} = -\\frac{2mE}{\\hbar^2}\\psi = -k^2\\psi$",
              "met $k = \\sqrt{2mE}/\\hbar$.",
              "De algemene oplossing van $\\psi'' = -k^2\\psi$ is: $\\psi(x) = A\\sin(kx) + B\\cos(kx)$."
            ],
          },
          {
            question: "Pas de randvoorwaarde $\\psi(0) = 0$ toe. Wat volgt er voor $B$?",
            hints: [
              "$\\psi(0) = A\\sin(0) + B\\cos(0) = B$."
            ],
            solution: [
              "$\\psi(0) = A \\cdot 0 + B \\cdot 1 = B = 0$",
              "Dus $B = 0$ en $\\psi(x) = A\\sin(kx)$."
            ],
          },
          {
            question: "Pas de randvoorwaarde $\\psi(a) = 0$ toe. Leid af dat $k = n\\pi/a$ met $n = 1, 2, 3, \\ldots$ en bepaal de toegestane energieniveaus.",
            hints: [
              "$\\psi(a) = A\\sin(ka) = 0$. Aangezien $A \\neq 0$ (anders geen deeltje), moet $\\sin(ka) = 0$.",
              "$\\sin(\\theta) = 0$ als $\\theta = n\\pi$ ($n$ geheel). Waarom nemen we alleen $n \\geq 1$?"
            ],
            solution: [
              "$A\\sin(ka) = 0$ met $A \\neq 0 \\implies \\sin(ka) = 0 \\implies ka = n\\pi$",
              "$k_n = \\frac{n\\pi}{a}, \\qquad n = 1, 2, 3, \\ldots$",
              "$E_n = \\frac{\\hbar^2 k_n^2}{2m} = \\frac{n^2\\pi^2\\hbar^2}{2ma^2}$",
              "$n = 0$ geeft $\\psi = 0$ (geen deeltje). Negatieve $n$ geven dezelfde $|\\psi|^2$ (alleen een minteken).",
              "Dus $n = 1, 2, 3, \\ldots$ geeft alle fysisch verschillende oplossingen."
            ],
          },
          {
            question: "Normeer de golffunctie: bereken $A$ uit $\\int_0^a|\\psi_n|^2\\,dx = 1$. Gebruik $\\int_0^a\\sin^2(n\\pi x/a)\\,dx = a/2$.",
            hints: [
              "$\\int_0^a A^2\\sin^2(n\\pi x/a)\\,dx = A^2 \\cdot a/2 = 1$.",
              "Los op naar $A$."
            ],
            answer: ["sqrt(2/a)"],
            solution: [
              "$A^2\\int_0^a\\sin^2\\left(\\frac{n\\pi x}{a}\\right)dx = A^2 \\cdot \\frac{a}{2} = 1$",
              "$A = \\sqrt{\\frac{2}{a}}$",
              "De genormeerde golffuncties zijn: $\\psi_n(x) = \\sqrt{\\frac{2}{a}}\\sin\\left(\\frac{n\\pi x}{a}\\right)$"
            ],
          },
        ],
      },
      {
        label: "Opgave 2",
        title: "Verwachtingswaarden in de oneindige put",
        intro: "We berekenen $\\langle x \\rangle$, $\\langle x^2 \\rangle$, $\\langle p \\rangle$ en $\\langle p^2 \\rangle$ voor de $n$-de eigentoestand en verifiëren het onzekerheidsprincipe.",
        steps: [
          {
            question: "Bereken $\\langle x \\rangle$ voor de $n$-de eigentoestand. Gebruik $\\int_0^a x\\sin^2(n\\pi x/a)\\,dx = a^2/4$.",
            hints: [
              "$\\langle x \\rangle = \\frac{2}{a}\\int_0^a x\\sin^2(n\\pi x/a)\\,dx$.",
              "Substitueer het gegeven resultaat."
            ],
            answer: ["a/2"],
            solution: [
              "$\\langle x \\rangle = \\frac{2}{a}\\int_0^a x\\sin^2\\left(\\frac{n\\pi x}{a}\\right)dx = \\frac{2}{a}\\cdot\\frac{a^2}{4} = \\frac{a}{2}$",
              "Het deeltje bevindt zich gemiddeld in het midden van de put — voor alle $n$.",
              "Dit volgt ook uit de symmetrie: $|\\psi_n|^2$ is symmetrisch rond $x = a/2$."
            ],
          },
          {
            question: "Bereken $\\langle x^2 \\rangle$ voor de $n$-de eigentoestand. Gebruik $\\int_0^a x^2\\sin^2(n\\pi x/a)\\,dx = \\frac{a^3}{6} - \\frac{a^3}{4n^2\\pi^2}$.",
            hints: [
              "$\\langle x^2 \\rangle = \\frac{2}{a}\\int_0^a x^2\\sin^2(n\\pi x/a)\\,dx$."
            ],
            solution: [
              "$\\langle x^2 \\rangle = \\frac{2}{a}\\left(\\frac{a^3}{6} - \\frac{a^3}{4n^2\\pi^2}\\right) = a^2\\left(\\frac{1}{3} - \\frac{1}{2n^2\\pi^2}\\right)$"
            ],
          },
          {
            question: "Bereken $\\sigma_x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$.",
            hints: [
              "$\\langle x\\rangle^2 = a^2/4$.",
              "$\\langle x^2\\rangle - \\langle x\\rangle^2 = a^2(1/3 - 1/(2n^2\\pi^2)) - a^2/4$."
            ],
            solution: [
              "$\\sigma_x^2 = a^2\\left(\\frac{1}{3} - \\frac{1}{2n^2\\pi^2} - \\frac{1}{4}\\right) = a^2\\left(\\frac{1}{12} - \\frac{1}{2n^2\\pi^2}\\right)$",
              "$\\sigma_x = a\\sqrt{\\frac{1}{12} - \\frac{1}{2n^2\\pi^2}}$",
              "Voor grote $n$: $\\sigma_x \\to a/\\sqrt{12} = a/(2\\sqrt{3})$, het klassieke resultaat voor een uniforme verdeling op $[0,a]$."
            ],
          },
          {
            question: "Bereken $\\langle p \\rangle$ en $\\langle p^2 \\rangle$. Gebruik $\\hat{p}\\psi_n = -i\\hbar\\psi_n'$ en het feit dat $\\psi_n'' = -k_n^2\\psi_n$.",
            hints: [
              "We weten al dat $\\langle p\\rangle = 0$ voor reële eigentoestanden (bewezen in hoofdstuk 6).",
              "$\\langle p^2\\rangle = -\\hbar^2\\int_0^a \\psi_n\\psi_n''\\,dx = \\hbar^2 k_n^2 = (n\\pi\\hbar/a)^2$.",
              "Of direct: $\\langle p^2\\rangle = 2mE_n$."
            ],
            solution: [
              "$\\langle p \\rangle = 0$ (reële golffunctie, bewezen in H6).",
              "$\\langle p^2 \\rangle = -\\hbar^2\\int_0^a\\psi_n\\frac{d^2\\psi_n}{dx^2}\\,dx = \\hbar^2 k_n^2\\int_0^a|\\psi_n|^2\\,dx = \\hbar^2 k_n^2 = \\frac{n^2\\pi^2\\hbar^2}{a^2}$",
              "Controle: $\\langle p^2\\rangle/(2m) = n^2\\pi^2\\hbar^2/(2ma^2) = E_n$ ✓",
              "$\\sigma_p = n\\pi\\hbar/a$."
            ],
          },
          {
            question: "Verifieer het onzekerheidsprincipe: bereken $\\sigma_x\\sigma_p$ voor de grondtoestand ($n = 1$) en toon aan dat $\\sigma_x\\sigma_p > \\hbar/2$.",
            hints: [
              "Substitueer $n = 1$ in de uitdrukkingen voor $\\sigma_x$ en $\\sigma_p$.",
              "Bereken het product en vergelijk met $\\hbar/2$."
            ],
            solution: [
              "$\\sigma_x = a\\sqrt{\\frac{1}{12} - \\frac{1}{2\\pi^2}}$, $\\quad \\sigma_p = \\frac{\\pi\\hbar}{a}$",
              "$\\sigma_x\\sigma_p = \\pi\\hbar\\sqrt{\\frac{1}{12} - \\frac{1}{2\\pi^2}} = \\frac{\\hbar}{2}\\sqrt{\\frac{\\pi^2}{3} - 2} \\approx 0.57\\hbar$",
              "$0.57\\hbar > \\hbar/2 = 0.50\\hbar$ ✓",
              "Het onzekerheidsprincipe is vervuld. De grondtoestand van de oneindige put zit dicht bij de minimale onzekerheid, maar bereikt die niet (alleen de Gauss-functie doet dat)."
            ],
          },
        ],
      },
      {
        label: "Opgave 3",
        title: "Orthogonaliteit bewijzen",
        intro: "We bewijzen dat de golffuncties $\\psi_n$ een orthonormale set vormen.",
        steps: [
          {
            question: "Bereken $\\int_0^a \\sin(m\\pi x/a)\\sin(n\\pi x/a)\\,dx$ voor $m \\neq n$. Gebruik de goniometrische identiteit $\\sin\\alpha\\sin\\beta = \\frac{1}{2}[\\cos(\\alpha - \\beta) - \\cos(\\alpha + \\beta)]$.",
            hints: [
              "Neem $\\alpha = m\\pi x/a$ en $\\beta = n\\pi x/a$.",
              "De integraal wordt een som van twee cosinus-integralen.",
              "$\\int_0^a \\cos(k\\pi x/a)\\,dx = \\frac{a}{k\\pi}\\sin(k\\pi) = 0$ voor geheel $k \\neq 0$."
            ],
            solution: [
              "$\\int_0^a\\sin\\frac{m\\pi x}{a}\\sin\\frac{n\\pi x}{a}\\,dx = \\frac{1}{2}\\int_0^a\\left[\\cos\\frac{(m-n)\\pi x}{a} - \\cos\\frac{(m+n)\\pi x}{a}\\right]dx$",
              "Beide integralen geven nul (het zijn gehele perioden van een cosinus):",
              "$= \\frac{1}{2}\\left[\\frac{a}{(m-n)\\pi}\\sin\\frac{(m-n)\\pi x}{a}\\right]_0^a - \\frac{1}{2}\\left[\\frac{a}{(m+n)\\pi}\\sin\\frac{(m+n)\\pi x}{a}\\right]_0^a$",
              "$= 0 - 0 = 0$ voor $m \\neq n$.",
              "Met normering: $\\int_0^a\\psi_m\\psi_n\\,dx = \\frac{2}{a}\\cdot 0 = 0$. De golffuncties zijn orthogonaal."
            ],
          },
          {
            question: "Bereken dezelfde integraal voor $m = n$ en verifieer de normering.",
            hints: [
              "Gebruik $\\sin^2\\theta = (1 - \\cos 2\\theta)/2$."
            ],
            solution: [
              "$\\int_0^a\\sin^2\\frac{n\\pi x}{a}\\,dx = \\int_0^a\\frac{1}{2}\\left(1 - \\cos\\frac{2n\\pi x}{a}\\right)dx$",
              "$= \\frac{1}{2}\\left[x - \\frac{a}{2n\\pi}\\sin\\frac{2n\\pi x}{a}\\right]_0^a = \\frac{a}{2}$",
              "Met de normeringsfactor: $\\int_0^a|\\psi_n|^2\\,dx = \\frac{2}{a}\\cdot\\frac{a}{2} = 1$ ✓"
            ],
          },
        ],
      },
      {
        label: "Opgave 4",
        title: "Tijdsevolutie in de oneindige put",
        intro: "Een deeltje in een oneindige put ($0 < x < a$) begint op $t = 0$ in de toestand $\\Psi(x,0) = A[\\psi_1(x) + \\psi_2(x)]$. We bestuderen de tijdsevolutie.",
        steps: [
          {
            question: "Bepaal de normeringsconstante $A$. Gebruik de orthonormaliteit van $\\psi_1$ en $\\psi_2$.",
            hints: [
              "$\\int|\\Psi(x,0)|^2\\,dx = A^2\\int(\\psi_1 + \\psi_2)^2\\,dx = A^2(1 + 0 + 0 + 1) = 2A^2$.",
              "Stel dit gelijk aan 1."
            ],
            answer: ["1/sqrt(2)"],
            solution: [
              "$\\int_0^a|\\Psi|^2\\,dx = A^2\\int_0^a(\\psi_1 + \\psi_2)(\\psi_1 + \\psi_2)\\,dx$",
              "$= A^2(\\underbrace{\\int\\psi_1^2}_{1} + \\underbrace{\\int\\psi_1\\psi_2}_{0} + \\underbrace{\\int\\psi_2\\psi_1}_{0} + \\underbrace{\\int\\psi_2^2}_{1}) = 2A^2 = 1$",
              "$A = \\frac{1}{\\sqrt{2}}$"
            ],
          },
          {
            question: "Schrijf $\\Psi(x,t)$ op. Wat zijn de coëfficiënten $c_n$?",
            hints: [
              "Alleen $c_1$ en $c_2$ zijn niet nul.",
              "Elke term krijgt zijn eigen tijdsfase $e^{-iE_nt/\\hbar}$."
            ],
            solution: [
              "$c_1 = c_2 = 1/\\sqrt{2}$, alle andere $c_n = 0$.",
              "$\\Psi(x,t) = \\frac{1}{\\sqrt{2}}\\left[\\psi_1(x)e^{-iE_1t/\\hbar} + \\psi_2(x)e^{-iE_2t/\\hbar}\\right]$",
              "met $E_1 = \\pi^2\\hbar^2/(2ma^2)$ en $E_2 = 4E_1$."
            ],
          },
          {
            question: "Bereken $|\\Psi(x,t)|^2$ en laat zien dat de kansdichtheid oscilleert. Wat is de oscillatiefrequentie?",
            hints: [
              "Werk $|\\Psi|^2 = \\frac{1}{2}|\\psi_1 e^{-iE_1t/\\hbar} + \\psi_2 e^{-iE_2t/\\hbar}|^2$ uit.",
              "Gebruik $E_2 - E_1 = 3E_1 = 3\\pi^2\\hbar^2/(2ma^2)$."
            ],
            solution: [
              "$|\\Psi|^2 = \\frac{1}{2}\\left[\\psi_1^2 + \\psi_2^2 + 2\\psi_1\\psi_2\\cos\\left(\\frac{(E_2-E_1)t}{\\hbar}\\right)\\right]$",
              "$= \\frac{1}{2}\\left[\\psi_1^2 + \\psi_2^2 + 2\\psi_1\\psi_2\\cos(\\omega_{21}t)\\right]$",
              "met $\\omega_{21} = (E_2 - E_1)/\\hbar = 3\\pi^2\\hbar/(2ma^2)$.",
              "De kansdichtheid oscilleert met de Bohr-frequentie $\\omega_{21}$.",
              "Het deeltje 'klotst' heen en weer in de put!"
            ],
          },
          {
            question: "Bereken $\\langle x \\rangle(t)$ en laat zien dat het deeltje rond het midden van de put oscilleert.",
            hints: [
              "$\\langle x\\rangle = \\frac{1}{2}\\int x(\\psi_1^2 + \\psi_2^2)dx + \\int x\\psi_1\\psi_2\\cos(\\omega_{21}t)\\,dx$.",
              "Bereken $\\int_0^a x\\psi_1\\psi_2\\,dx = \\frac{2}{a}\\int_0^a x\\sin(\\pi x/a)\\sin(2\\pi x/a)\\,dx$."
            ],
            solution: [
              "De eerste twee termen geven elk $\\langle x\\rangle_n = a/2$ (bewezen eerder).",
              "De kruisterm: $I = \\frac{2}{a}\\int_0^a x\\sin(\\pi x/a)\\sin(2\\pi x/a)\\,dx$.",
              "Na uitwerking (product-naar-som formule + partiële integratie): $I = -\\frac{16a}{9\\pi^2}$.",
              "$\\langle x\\rangle(t) = \\frac{a}{2} - \\frac{16a}{9\\pi^2}\\cos(\\omega_{21}t)$",
              "De verwachtingswaarde oscilleert rond $a/2$ met amplitude $16a/(9\\pi^2) \\approx 0.18a$.",
              "Dit is de quantummechanische versie van een heen-en-weer stuitend deeltje!"
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        question: "Waarom is $\\psi = 0$ buiten de oneindige put?",
        options: [
          "Het is een wiskundige conventie",
          "De kans om het deeltje bij oneindige potentiaal te vinden is nul",
          "De golffunctie is altijd nul",
          "De energieniveaus zijn oneindig buiten de put"
        ],
        correct: 1,
        explanation: "Bij oneindige potentiaal zou het deeltje oneindige energie nodig hebben om daar te zijn. De kansdichtheid is nul, dus $\\psi = 0$."
      },
      {
        question: "Welke randvoorwaarde leidt tot de kwantisatie van de energieniveaus?",
        options: [
          "$\\psi'(0) = 0$",
          "$\\psi(a) = 0$, waardoor $\\sin(ka) = 0$ en $k = n\\pi/a$",
          "$\\psi(a) = \\psi(0)$ (periodiek)",
          "$\\psi(a) = 1$ (normering)"
        ],
        correct: 1,
        explanation: "De eis $\\psi(a) = 0$ selecteert $k = n\\pi/a$ en daarmee de discrete energieniveaus $E_n = n^2\\pi^2\\hbar^2/(2ma^2)$."
      },
      {
        question: "De energieniveaus van de oneindige put zijn evenredig met:",
        options: ["$n$", "$n^2$", "$n^3$", "$1/n^2$"],
        correct: 1,
        explanation: "$E_n = n^2\\pi^2\\hbar^2/(2ma^2)$, dus $E_n \\propto n^2$."
      },
      {
        question: "Hoeveel knopen (nulpunten, exclusief de randen) heeft $\\psi_3(x)$?",
        options: ["$1$", "$2$", "$3$", "$4$"],
        correct: 1,
        explanation: "$\\psi_n$ heeft $n-1$ knopen in het inwendige van de put. Dus $\\psi_3$ heeft 2 knopen."
      },
      {
        question: "De laagste energie in de oneindige put ($n=1$) is:",
        options: [
          "Nul (het deeltje kan in rust zijn)",
          "Groter dan nul (nulpuntsenergie)",
          "Negatief (gebonden toestand)",
          "Oneindig (door de oneindige wanden)"
        ],
        correct: 1,
        explanation: "De nulpuntsenergie $E_1 = \\pi^2\\hbar^2/(2ma^2) > 0$. Een quantumdeeltje kan nooit volledig in rust zijn (onzekerheidsprincipe)."
      },
      {
        question: "Als de breedte $a$ van de put wordt verdubbeld, hoe veranderen de energieniveaus?",
        options: [
          "Ze verdubbelen",
          "Ze halveren",
          "Ze worden vier keer zo klein",
          "Ze blijven gelijk"
        ],
        correct: 2,
        explanation: "$E_n \\propto 1/a^2$, dus als $a \\to 2a$, dan $E_n \\to E_n/4$."
      },
      {
        question: "De verwachtingswaarde $\\langle x \\rangle$ voor de $n$-de eigentoestand is:",
        options: [
          "$0$",
          "$a/n$",
          "$a/2$",
          "$na$"
        ],
        correct: 2,
        explanation: "$\\langle x \\rangle = a/2$ voor alle $n$, vanwege de symmetrie van $|\\psi_n|^2$ rond het midden van de put."
      },
      {
        question: "Waarom is $n = 0$ geen toegestane kwantumtoestand?",
        options: [
          "De energie zou negatief zijn",
          "De golffunctie zou $\\psi = 0$ zijn (geen deeltje)",
          "De impuls zou oneindig zijn",
          "Het onzekerheidsprincipe verbiedt het"
        ],
        correct: 1,
        explanation: "Voor $n = 0$ geldt $\\psi_0(x) = \\sqrt{2/a}\\sin(0) = 0$ overal. Dit beschrijft geen deeltje — het is de triviale oplossing."
      },
    ],
};

export default chapter7;
