const chapter9 = {
    id: 9,
    title: "Het Vrije Deeltje",
    subtitle: "Golfpakketten, dispersie, groepssnelheid (Griffiths §2.4)",
    formulas: [
      { name: "TISV vrij deeltje", latex: "-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} = E\\psi" },
      { name: "Vlakke golf", latex: "\\Psi_k(x,t) = A e^{i(kx - \\omega t)}" },
      { name: "Dispersierelatie", latex: "\\omega = \\frac{\\hbar k^2}{2m}" },
      { name: "Golfpakket", latex: "\\Psi(x,t) = \\frac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^{\\infty} \\phi(k) \\, e^{i(kx - \\omega(k)t)} \\, dk" },
      { name: "Fouriertransformatie", latex: "\\phi(k) = \\frac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^{\\infty} \\Psi(x,0) \\, e^{-ikx} \\, dx" },
      { name: "Fasesnelheid", latex: "v_{\\text{fase}} = \\frac{\\omega}{k} = \\frac{\\hbar k}{2m}" },
      { name: "Groepssnelheid", latex: "v_{\\text{groep}} = \\frac{d\\omega}{dk} = \\frac{\\hbar k}{m} = \\frac{p}{m}" },
      { name: "Gaussisch golfpakket", latex: "\\Psi(x,0) = \\left(\\frac{2a}{\\pi}\\right)^{1/4} e^{ik_0 x}\\,e^{-ax^2}" },
    ],
    concepts: [
      {
        title: "Het vrije deeltje: de TISV (Griffiths §2.4)",
        content: "Voor een vrij deeltje is $V(x) = 0$ overal. De tijdsonafhankelijke Schrödingervergelijking wordt:\n\n$$-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} = E\\psi \\qquad \\Rightarrow \\qquad \\frac{d^2\\psi}{dx^2} = -k^2\\psi$$\n\nmet $k \\equiv \\sqrt{2mE}/\\hbar$. De algemene oplossing is $\\psi(x) = Ae^{ikx} + Be^{-ikx}$. Dit lijkt op de oneindige put, maar er is een cruciaal verschil: er zijn géén randvoorwaarden. Daardoor is $k$ (en dus $E$) niet gekwantiseerd — het energiespectrum is continu. Bovendien is er geen restrictie $E > 0$: voor negatieve $k^2$ zouden we exponentieel groeiende oplossingen krijgen, maar die zijn niet normeerbaar. Griffiths kiest een andere schrijfwijze dan bij de put: $e^{\\pm ikx}$ in plaats van $\\sin$ en $\\cos$, omdat lopende golven hier natuurlijker zijn."
      },
      {
        title: "Vlakke golven en hun problemen",
        content: "De volledige tijdsafhankelijke oplossing voor een enkele $k$-waarde is een vlakke golf:\n\n$$\\Psi_k(x,t) = Ae^{i(kx - \\omega t)}$$\n\nmet $\\omega = \\hbar k^2/(2m)$. Maar deze vlakke golven zijn niet normeerbaar:\n\n$$\\int_{-\\infty}^{\\infty}|\\Psi_k|^2\\,dx = |A|^2\\int_{-\\infty}^{\\infty}dx = \\infty$$\n\nDus een vlakke golf kan geen fysisch deeltje beschrijven — het zou betekenen dat het deeltje overal tegelijk is met gelijke waarschijnlijkheid. Dit is fundamenteel anders dan bij de oneindige put of de harmonische oscillator, waar de eigentoestanden wél normeerbaar zijn. Een vrij deeltje heeft geen gebonden toestanden."
      },
      {
        title: "Het golfpakket als oplossing",
        content: "Een fysisch deeltje wordt beschreven door een golfpakket — een superpositie van vlakke golven met een continue verdeling van $k$-waarden:\n\n$$\\Psi(x,t) = \\frac{1}{\\sqrt{2\\pi}}\\int_{-\\infty}^{\\infty}\\phi(k)\\,e^{i(kx - \\omega(k)t)}\\,dk$$\n\nDe functie $\\phi(k)$ bepaalt het 'gewicht' van elke vlakke-golfcomponent. Hoewel elke individuele vlakke golf niet normeerbaar is, kan de superpositie dat wél zijn — door destructieve interferentie ver van het centrum gaat het pakket naar nul. De continue som (integraal) vervangt hier de discrete som $\\sum c_n\\psi_n$ die we bij de put en de HO hadden. Dit is de stap van Fourier-reeksen naar Fourier-integralen."
      },
      {
        title: "De begintoestand en de Fouriertransformatie",
        content: "Op $t = 0$ is het golfpakket:\n\n$$\\Psi(x,0) = \\frac{1}{\\sqrt{2\\pi}}\\int_{-\\infty}^{\\infty}\\phi(k)\\,e^{ikx}\\,dk$$\n\nDit is een inverse Fouriertransformatie. Gegeven de begintoestand $\\Psi(x,0)$ vinden we $\\phi(k)$ via de Fouriertransformatie:\n\n$$\\phi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int_{-\\infty}^{\\infty}\\Psi(x,0)\\,e^{-ikx}\\,dx$$\n\nDit is het analoog van de Fourier-truc ($c_n = \\int\\psi_n^*f\\,dx$), maar nu met continue $k$ in plaats van discrete $n$. De orthonormaliteitsrelatie van de vlakke golven is:\n\n$$\\frac{1}{2\\pi}\\int_{-\\infty}^{\\infty}e^{i(k-k')x}\\,dx = \\delta(k - k')$$\n\nmet een Dirac-delta in plaats van een Kronecker-delta."
      },
      {
        title: "Fasesnelheid vs. groepssnelheid",
        content: "Een vlakke golf $e^{i(kx - \\omega t)}$ beweegt met de fasesnelheid:\n\n$$v_{\\text{fase}} = \\frac{\\omega}{k} = \\frac{\\hbar k}{2m} = \\frac{p}{2m}$$\n\nDit is de helft van de klassieke snelheid $v_{\\text{klass}} = p/m$ — verwarrend! Maar het deeltje beweegt niet met de fasesnelheid. Het beweegt met de groepssnelheid, de snelheid van de envelop van het golfpakket:\n\n$$v_{\\text{groep}} = \\frac{d\\omega}{dk}\\bigg|_{k_0} = \\frac{\\hbar k_0}{m} = \\frac{p}{m} = v_{\\text{klass}}$$\n\nDe groepssnelheid is wél gelijk aan de klassieke deeltjessnelheid. Dit is een belangrijk consistentieresultaat: de quantummechanische beschrijving geeft dezelfde deeltjessnelheid als de klassieke mechanica."
      },
      {
        title: "Dispersie: het uiteenlopen van het golfpakket",
        content: "De dispersierelatie $\\omega = \\hbar k^2/(2m)$ is niet-lineair in $k$: $\\omega \\propto k^2$. Dit betekent dat verschillende $k$-componenten met verschillende snelheden $v_{\\text{fase}} = \\omega/k$ bewegen. Het gevolg: het golfpakket spreidt zich uit in de loop van de tijd.\n\nVoor een Gaussisch golfpakket met initiële breedte $\\sigma_0$ groeit de breedte als:\n\n$$\\sigma(t) = \\sigma_0\\sqrt{1 + \\left(\\frac{\\hbar t}{2m\\sigma_0^2}\\right)^2}$$\n\nVoor korte tijden ($t \\ll 2m\\sigma_0^2/\\hbar$) is de spreiding verwaarloosbaar. Voor een macroscopisch voorwerp ($m \\sim 1$ kg, $\\sigma_0 \\sim 1$ mm) is de spreidingstijd astronomisch lang — quantumspreiding is alleen merkbaar voor microscopische deeltjes. Let op: het totaal oppervlak onder $|\\Psi|^2$ blijft altijd 1 (normering). Het pakket wordt breder maar lager."
      },
      {
        title: "Het Gaussisch golfpakket",
        content: "Het standaardvoorbeeld is een Gaussisch golfpakket met gemiddeld golfgetal $k_0$:\n\n$$\\Psi(x,0) = \\left(\\frac{2a}{\\pi}\\right)^{1/4}e^{ik_0x}\\,e^{-ax^2}$$\n\nDe Fouriertransformatie is ook Gaussisch:\n\n$$\\phi(k) = \\left(\\frac{1}{2\\pi a}\\right)^{1/4}e^{-(k-k_0)^2/(4a)}$$\n\nDit pakket is gecentreerd rond $x = 0$ in positieruimte en rond $k = k_0$ in impulsruimte. De breedtes voldoen aan $\\sigma_x\\sigma_k = 1/2$, ofwel $\\sigma_x\\sigma_p = \\hbar/2$ — de minimale onzekerheid. Een Gaussisch pakket is het enige golfpakket dat de ondergrens van het onzekerheidsprincipe bereikt, net als de grondtoestand van de harmonische oscillator (die ook Gaussisch is)."
      },
      {
        title: "Negatieve $k$ en de bewegingsrichting",
        content: "In tegenstelling tot de oneindige put (waar $n \\geq 1$), kunnen we hier $k < 0$ hebben. De interpretatie: $k > 0$ correspondeert met een naar rechts lopende golf (positief impuls $p = \\hbar k > 0$), en $k < 0$ met een naar links lopende golf ($p < 0$). De energie hangt af van $k^2$, dus $E = \\hbar^2k^2/(2m)$ is altijd positief, ongeacht de richting. Elke energie is tweevoudig ontaard: voor een gegeven $E$ zijn er twee oplossingen, $e^{ikx}$ (naar rechts) en $e^{-ikx}$ (naar links), met $k = \\sqrt{2mE}/\\hbar$."
      },
      {
        title: "Het onzekerheidsprincipe en het vrije deeltje",
        content: "Het vrije deeltje illustreert het onzekerheidsprincipe op twee manieren:\n\n1. **Positie vs. impuls**: een vlakke golf $e^{ikx}$ heeft een scherp gedefinieerde impuls ($\\sigma_p = 0$) maar een volledig onbepaalde positie ($\\sigma_x = \\infty$). Een smal golfpakket ($\\sigma_x$ klein) vereist een brede verdeling van $k$-waarden ($\\sigma_k$ groot), dus grote impulsonzekerheid.\n\n2. **Dynamische spreiding**: zelfs als we op $t = 0$ een goed gelokaliseerd pakket maken, zal het zich door dispersie uiteindelijk uitspreiden. Een scherpere beginlokalisatie leidt tot snéllere spreiding — opnieuw het onzekerheidsprincipe in actie. De positie-impuls onzekerheid neemt toe met de tijd: $\\sigma_x(t)\\sigma_p \\geq \\hbar/2$ blijft gelden, maar $\\sigma_x(t)$ groeit terwijl $\\sigma_p$ constant blijft."
      },
    ],
    exercises: [
      {
        label: "Opgave 1",
        title: "Fasesnelheid en groepssnelheid",
        intro: "We leiden de fase- en groepssnelheid af voor een vrij quantumdeeltje en vergelijken met de klassieke snelheid.",
        steps: [
          {
            question: "De dispersierelatie voor een vrij deeltje is $\\omega = \\hbar k^2/(2m)$. Bereken de fasesnelheid $v_{\\text{fase}} = \\omega/k$ en druk deze uit in de impuls $p = \\hbar k$.",
            hints: [
              "$v_{\\text{fase}} = \\omega/k = \\hbar k^2/(2mk) = \\hbar k/(2m)$.",
              "Substitueer $p = \\hbar k$."
            ],
            solution: [
              "$v_{\\text{fase}} = \\frac{\\omega}{k} = \\frac{\\hbar k}{2m} = \\frac{p}{2m}$",
              "Dit is de helft van de klassieke snelheid $v_{\\text{klass}} = p/m$."
            ],
          },
          {
            question: "Bereken de groepssnelheid $v_{\\text{groep}} = d\\omega/dk$ en vergelijk met de klassieke snelheid.",
            hints: [
              "Differentieer $\\omega = \\hbar k^2/(2m)$ naar $k$."
            ],
            solution: [
              "$v_{\\text{groep}} = \\frac{d\\omega}{dk} = \\frac{2\\hbar k}{2m} = \\frac{\\hbar k}{m} = \\frac{p}{m} = v_{\\text{klass}}$",
              "De groepssnelheid is gelijk aan de klassieke deeltjessnelheid — de quantummechanica is consistent met de klassieke limiet."
            ],
          },
          {
            question: "Wat is de relatie tussen $v_{\\text{groep}}$ en $v_{\\text{fase}}$ voor het vrije deeltje?",
            hints: [
              "Vergelijk de twee uitdrukkingen."
            ],
            answer: ["v_groep = 2 * v_fase"],
            solution: [
              "$v_{\\text{groep}} = \\frac{\\hbar k}{m} = 2 \\cdot \\frac{\\hbar k}{2m} = 2\\,v_{\\text{fase}}$",
              "De groepssnelheid is precies twee keer de fasesnelheid. Dit geldt specifiek voor de kwadratische dispersierelatie $\\omega \\propto k^2$.",
              "Voor licht in vacuüm geldt $\\omega = ck$ (lineair), en dan $v_{\\text{fase}} = v_{\\text{groep}} = c$ — geen dispersie."
            ],
          },
        ],
      },
      {
        label: "Opgave 2",
        title: "De Fouriertransformatie van een Gaussisch golfpakket",
        intro: "We bepalen $\\phi(k)$ voor een Gaussisch golfpakket en analyseren het verband tussen positie- en impulsonzekerheid.",
        steps: [
          {
            question: "Gegeven $\\Psi(x,0) = \\left(\\frac{2a}{\\pi}\\right)^{1/4}e^{-ax^2}$ (met $k_0 = 0$ voor de eenvoud). Bereken $\\phi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int_{-\\infty}^{\\infty}\\Psi(x,0)\\,e^{-ikx}\\,dx$. Gebruik $\\int_{-\\infty}^{\\infty}e^{-\\alpha x^2 + \\beta x}\\,dx = \\sqrt{\\pi/\\alpha}\\,e^{\\beta^2/(4\\alpha)}$.",
            hints: [
              "Combineer de exponenten: $e^{-ax^2}\\cdot e^{-ikx} = e^{-ax^2 - ikx}$.",
              "Dit is de vorm $e^{-\\alpha x^2 + \\beta x}$ met $\\alpha = a$ en $\\beta = -ik$.",
              "$\\beta^2/(4\\alpha) = (-ik)^2/(4a) = -k^2/(4a)$."
            ],
            solution: [
              "$\\phi(k) = \\frac{1}{\\sqrt{2\\pi}}\\left(\\frac{2a}{\\pi}\\right)^{1/4}\\int_{-\\infty}^{\\infty}e^{-ax^2 - ikx}\\,dx$",
              "$= \\frac{1}{\\sqrt{2\\pi}}\\left(\\frac{2a}{\\pi}\\right)^{1/4}\\sqrt{\\frac{\\pi}{a}}\\,e^{-k^2/(4a)}$",
              "$= \\left(\\frac{1}{2\\pi a}\\right)^{1/4}e^{-k^2/(4a)}$",
              "Dit is weer een Gaussische functie! Smal in $x$ (grote $a$) geeft breed in $k$, en omgekeerd."
            ],
          },
          {
            question: "Bereken $\\sigma_x$ en $\\sigma_k$ voor dit golfpakket en verifieer het onzekerheidsprincipe.",
            hints: [
              "De standaarddeviatie van $e^{-ax^2}$ is $\\sigma_x = 1/\\sqrt{4a} = 1/(2\\sqrt{a})$.",
              "De standaarddeviatie van $e^{-k^2/(4a)}$ is $\\sigma_k = \\sqrt{2a}$.",
              "Bereken $\\sigma_x\\sigma_k$ en vervolgens $\\sigma_x\\sigma_p = \\hbar\\sigma_x\\sigma_k$."
            ],
            solution: [
              "Voor $|\\Psi(x,0)|^2 \\propto e^{-2ax^2}$: $\\sigma_x = \\frac{1}{2\\sqrt{a}}$",
              "Voor $|\\phi(k)|^2 \\propto e^{-k^2/(2a)}$: $\\sigma_k = \\sqrt{a}$",
              "$\\sigma_x \\cdot \\sigma_k = \\frac{1}{2\\sqrt{a}} \\cdot \\sqrt{a} = \\frac{1}{2}$",
              "$\\sigma_x \\cdot \\sigma_p = \\hbar\\sigma_x\\sigma_k = \\frac{\\hbar}{2}$",
              "Dit is precies de minimale onzekerheid — het Gaussisch pakket verzadigt het onzekerheidsprincipe. ✓"
            ],
          },
        ],
      },
      {
        label: "Opgave 3",
        title: "Tijdsevolutie en dispersie",
        intro: "We bestuderen hoe een Gaussisch golfpakket zich in de tijd ontwikkelt en uitspreidt.",
        steps: [
          {
            question: "Schrijf $\\Psi(x,t)$ op voor het Gaussisch golfpakket met $\\phi(k) = \\left(\\frac{1}{2\\pi a}\\right)^{1/4}e^{-k^2/(4a)}$. Substitueer de dispersierelatie $\\omega(k) = \\hbar k^2/(2m)$.",
            hints: [
              "$\\Psi(x,t) = \\frac{1}{\\sqrt{2\\pi}}\\int\\phi(k)e^{i(kx - \\omega t)}dk$.",
              "Combineer de exponenten in de $k$-integraal tot één kwadratische vorm in $k$."
            ],
            solution: [
              "$\\Psi(x,t) = \\frac{1}{\\sqrt{2\\pi}}\\left(\\frac{1}{2\\pi a}\\right)^{1/4}\\int_{-\\infty}^{\\infty}e^{-k^2/(4a)}\\,e^{i(kx - \\hbar k^2 t/(2m))}\\,dk$",
              "$= \\frac{1}{\\sqrt{2\\pi}}\\left(\\frac{1}{2\\pi a}\\right)^{1/4}\\int e^{-k^2\\left(\\frac{1}{4a} + \\frac{i\\hbar t}{2m}\\right) + ikx}\\,dk$",
              "Dit is een Gaussische integraal met $\\alpha = \\frac{1}{4a} + \\frac{i\\hbar t}{2m}$ en $\\beta = ix$."
            ],
          },
          {
            question: "Noem $\\alpha = \\frac{1}{4a} + \\frac{i\\hbar t}{2m}$. Laat zien dat $|\\Psi(x,t)|^2$ opnieuw Gaussisch is, maar met een breedte die toeneemt in de tijd.",
            hints: [
              "Na de Gaussische integratie: $\\Psi(x,t) \\propto \\frac{1}{\\sqrt{\\alpha}}e^{-x^2/(4\\alpha)}$.",
              "$|\\Psi|^2 \\propto \\frac{1}{|\\alpha|}e^{-x^2 \\text{Re}(1/(2\\alpha))}$.",
              "Bereken $|\\alpha|^2 = \\frac{1}{16a^2} + \\frac{\\hbar^2 t^2}{4m^2}$."
            ],
            solution: [
              "De kansdichtheid blijft Gaussisch: $|\\Psi(x,t)|^2 \\propto e^{-x^2/(2\\sigma_x^2(t))}$",
              "met $\\sigma_x^2(t) = \\frac{1}{4a}\\left(1 + \\frac{4a^2\\hbar^2 t^2}{m^2}\\right) = \\sigma_0^2\\left(1 + \\frac{\\hbar^2 t^2}{4m^2\\sigma_0^4}\\right)$",
              "waar $\\sigma_0 = 1/(2\\sqrt{a})$ de initiële breedte is.",
              "$\\sigma_x(t) = \\sigma_0\\sqrt{1 + \\left(\\frac{\\hbar t}{2m\\sigma_0^2}\\right)^2}$",
              "De breedte groeit monotoon — het pakket spreidt uit door dispersie."
            ],
          },
          {
            question: "Na welke karakteristieke tijd $\\tau$ is het pakket een factor $\\sqrt{2}$ breder geworden? Bereken $\\tau$ voor een elektron met $\\sigma_0 = 1$ nm.",
            hints: [
              "Stel $\\sigma_x(\\tau) = \\sqrt{2}\\,\\sigma_0$, dus $1 + (\\hbar\\tau/(2m\\sigma_0^2))^2 = 2$.",
              "Gebruik $\\hbar \\approx 1.055 \\times 10^{-34}$ J·s, $m_e \\approx 9.109 \\times 10^{-31}$ kg."
            ],
            answer: ["2*m*sigma_0^2/hbar"],
            solution: [
              "$\\left(\\frac{\\hbar\\tau}{2m\\sigma_0^2}\\right)^2 = 1 \\implies \\tau = \\frac{2m\\sigma_0^2}{\\hbar}$",
              "Voor een elektron met $\\sigma_0 = 10^{-9}$ m:",
              "$\\tau = \\frac{2 \\times 9.1 \\times 10^{-31} \\times 10^{-18}}{1.055 \\times 10^{-34}} \\approx 1.7 \\times 10^{-14}$ s",
              "Het pakket spreidt zich in femtoseconden uit — extreem snel voor een elektron op nanoschaal!",
              "Voor een macroscopisch object ($m = 1$ kg, $\\sigma_0 = 1$ mm): $\\tau \\sim 10^{25}$ s — langer dan de leeftijd van het universum."
            ],
          },
        ],
      },
      {
        label: "Opgave 4",
        title: "Verwachtingswaarden van het vrije golfpakket",
        intro: "We berekenen hoe $\\langle x\\rangle$ en $\\langle p\\rangle$ zich in de tijd gedragen voor een vrij golfpakket.",
        steps: [
          {
            question: "Gebruik het theorema van Ehrenfest ($d\\langle x\\rangle/dt = \\langle p\\rangle/m$ en $d\\langle p\\rangle/dt = -\\langle dV/dx\\rangle$) om het verloop van $\\langle x\\rangle$ en $\\langle p\\rangle$ te bepalen voor het vrije deeltje ($V = 0$).",
            hints: [
              "Voor $V = 0$ geldt $dV/dx = 0$, dus $d\\langle p\\rangle/dt = 0$.",
              "Wat betekent $d\\langle p\\rangle/dt = 0$ voor $\\langle p\\rangle$?"
            ],
            solution: [
              "$\\frac{d\\langle p\\rangle}{dt} = -\\left\\langle\\frac{dV}{dx}\\right\\rangle = 0 \\implies \\langle p\\rangle = \\langle p\\rangle_0 = \\text{const}$",
              "De verwachtingswaarde van de impuls is constant — er werkt geen kracht.",
              "$\\frac{d\\langle x\\rangle}{dt} = \\frac{\\langle p\\rangle_0}{m} \\implies \\langle x\\rangle(t) = \\langle x\\rangle_0 + \\frac{\\langle p\\rangle_0}{m}t$",
              "De verwachtingswaarde van de positie beweegt uniform — precies als een klassiek vrij deeltje!"
            ],
          },
          {
            question: "Hoe veranderen $\\sigma_x$ en $\\sigma_p$ met de tijd? Is het onzekerheidsprincipe op elk tijdstip voldaan?",
            hints: [
              "$\\sigma_p$ hangt af van $|\\phi(k)|^2$, dat tijdsonafhankelijk is (waarom?).",
              "$\\sigma_x$ groeit door dispersie."
            ],
            solution: [
              "$|\\phi(k)|^2$ verandert niet in de tijd — de impulssamenstelling van het pakket blijft gelijk.",
              "Dus $\\sigma_p = \\text{const}$.",
              "$\\sigma_x(t) = \\sigma_0\\sqrt{1 + (\\hbar t/(2m\\sigma_0^2))^2}$ groeit.",
              "$\\sigma_x(t)\\sigma_p \\geq \\sigma_0\\sigma_p = \\frac{\\hbar}{2}$ (voor Gauss-pakket bij $t=0$).",
              "Op latere tijden: $\\sigma_x(t)\\sigma_p > \\hbar/2$ — het onzekerheidsprincipe is ruimschoots voldaan. ✓"
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        question: "De groepssnelheid van een quantumdeeltje is gelijk aan:",
        options: [
          "De halve klassieke snelheid",
          "De klassieke snelheid $v = p/m$",
          "Twee keer de klassieke snelheid",
          "De lichtsnelheid"
        ],
        correct: 1,
        explanation: "$v_g = d\\omega/dk = \\hbar k/m = p/m$, wat gelijk is aan de klassieke snelheid."
      },
      {
        question: "Waarom kan een vlakke golf $e^{ikx}$ geen fysisch deeltje beschrijven?",
        options: [
          "De energie is negatief",
          "Het is niet normeerbaar ($\\int |e^{ikx}|^2 dx = \\infty$)",
          "Het schendt het onzekerheidsprincipe",
          "Het is niet complex"
        ],
        correct: 1,
        explanation: "Een vlakke golf is uniform over de hele ruimte: $|e^{ikx}|^2 = 1$ overal. De integraal divergeert."
      },
      {
        question: "Een golfpakket van een vrij deeltje wordt na verloop van tijd:",
        options: [
          "Smaller (het deeltje lokaliseert zich)",
          "Breder (het spreidt uit door dispersie)",
          "Blijft dezelfde breedte",
          "Verdwijnt"
        ],
        correct: 1,
        explanation: "Door de niet-lineaire dispersierelatie $\\omega \\propto k^2$ lopen verschillende golfcomponenten uit fase, waardoor het pakket uitspreidt."
      },
      {
        question: "De relatie tussen fase- en groepssnelheid voor een vrij quantumdeeltje is:",
        options: [
          "$v_{\\text{groep}} = v_{\\text{fase}}$",
          "$v_{\\text{groep}} = 2\\,v_{\\text{fase}}$",
          "$v_{\\text{groep}} = v_{\\text{fase}}/2$",
          "$v_{\\text{groep}} = v_{\\text{fase}}^2$"
        ],
        correct: 1,
        explanation: "$v_{\\text{fase}} = \\hbar k/(2m)$ en $v_{\\text{groep}} = \\hbar k/m$. De groepssnelheid is twee keer de fasesnelheid."
      },
      {
        question: "De Fouriertransformatie van een smal Gaussisch golfpakket (kleine $\\sigma_x$) is:",
        options: [
          "Ook smal in $k$-ruimte",
          "Breed in $k$-ruimte",
          "Een Dirac-delta",
          "Een constante"
        ],
        correct: 1,
        explanation: "Hoe smaller het pakket in positieruimte, hoe breder in impulsruimte — dit is het onzekerheidsprincipe: $\\sigma_x\\sigma_k \\geq 1/2$."
      },
      {
        question: "Het energiespectrum van een vrij deeltje is:",
        options: [
          "Discreet met equidistante niveaus",
          "Discreet met $E_n \\propto n^2$",
          "Continu",
          "Er zijn geen toegestane energieën"
        ],
        correct: 2,
        explanation: "Zonder randvoorwaarden is $k$ (en dus $E = \\hbar^2k^2/(2m)$) niet gekwantiseerd. Het spectrum is continu."
      },
      {
        question: "Welk golfpakket verzadigt het onzekerheidsprincipe ($\\sigma_x\\sigma_p = \\hbar/2$)?",
        options: [
          "Een blokgolfpakket",
          "Een Gaussisch golfpakket",
          "Elk golfpakket",
          "Geen enkel golfpakket"
        ],
        correct: 1,
        explanation: "Alleen het Gaussisch golfpakket bereikt de minimale onzekerheid $\\sigma_x\\sigma_p = \\hbar/2$."
      },
      {
        question: "De impulsondzekerheid $\\sigma_p$ van een vrij Gaussisch golfpakket:",
        options: [
          "Neemt toe met de tijd",
          "Neemt af met de tijd",
          "Blijft constant in de tijd",
          "Oscilleert"
        ],
        correct: 2,
        explanation: "De impulsverdeling $|\\phi(k)|^2$ is tijdsonafhankelijk. Alleen $\\sigma_x$ groeit — de impulsonzekerheid verandert niet."
      },
    ],
};

export default chapter9;
