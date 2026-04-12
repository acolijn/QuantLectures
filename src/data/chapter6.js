const chapter6 = {
    id: 6,
    title: "Oplossen van de Schrödingervergelijking",
    subtitle: "Scheiding van variabelen, tijdsonafhankelijke SV, superpositie (Griffiths §2.1)",
    formulas: [
      { name: "Scheiding van variabelen", latex: "\\Psi(x,t) = \\psi(x)\\,\\phi(t)" },
      { name: "Tijdsonafhankelijke SV", latex: "-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} + V\\psi = E\\psi \\quad \\Leftrightarrow \\quad \\hat{H}\\psi = E\\psi" },
      { name: "Tijdsafhankelijkheid", latex: "\\phi(t) = e^{-iEt/\\hbar}" },
      { name: "Stationaire oplossing", latex: "\\Psi_n(x,t) = \\psi_n(x)\\,e^{-iE_n t/\\hbar}" },
      { name: "Algemene oplossing", latex: "\\Psi(x,t) = \\sum_n c_n\\,\\psi_n(x)\\,e^{-iE_n t/\\hbar}" },
      { name: "Coëfficiënten (Fourier-truc)", latex: "c_n = \\int_{-\\infty}^{\\infty} \\psi_n(x)^*\\,\\Psi(x,0)\\,dx" },
      { name: "Kanssommen", latex: "\\sum_n |c_n|^2 = 1" },
      { name: "Verwachtingswaarde energie", latex: "\\langle H \\rangle = \\sum_n |c_n|^2 E_n" },
    ],
    concepts: [
      {
        title: "Waarom scheiding van variabelen? (Griffiths §2.1)",
        content: "De tijdsafhankelijke Schrödingervergelijking is een partiële differentiaalvergelijking in $x$ en $t$:\n\n$$i\\hbar\\frac{\\partial\\Psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\Psi}{\\partial x^2} + V(x)\\Psi$$\n\nDe standaardtechniek om zulke vergelijkingen op te lossen is scheiding van variabelen: we proberen een oplossing van de vorm $\\Psi(x,t) = \\psi(x)\\phi(t)$, een product van een functie die alleen van $x$ afhangt en een die alleen van $t$ afhangt. Dit lijkt een zeer speciale aanname — en dat is het ook. Niet elke oplossing heeft deze vorm. Maar de methode werkt omdat de speciale oplossingen die we zo vinden als bouwstenen dienen: de algemene oplossing is een lineaire combinatie van deze separabele oplossingen."
      },
      {
        title: "De scheiding uitvoeren (Griffiths §2.1)",
        content: "Substitueer $\\Psi(x,t) = \\psi(x)\\phi(t)$ in de SV. Aan de linkerkant:\n\n$$i\\hbar\\,\\psi\\frac{d\\phi}{dt}$$\n\nAan de rechterkant:\n\n$$-\\frac{\\hbar^2}{2m}\\phi\\frac{d^2\\psi}{dx^2} + V\\psi\\phi$$\n\nDeel beide kanten door $\\psi\\phi$:\n\n$$i\\hbar\\frac{1}{\\phi}\\frac{d\\phi}{dt} = -\\frac{\\hbar^2}{2m}\\frac{1}{\\psi}\\frac{d^2\\psi}{dx^2} + V(x)$$\n\nNu hangt de linkerkant alleen van $t$ af en de rechterkant alleen van $x$. Een functie van $t$ kan alleen gelijk zijn aan een functie van $x$ als beide gelijk zijn aan een constante — de scheidingsconstante, die we $E$ noemen (straks zien we dat dit de energie is). Dit levert twee gewone differentiaalvergelijkingen op."
      },
      {
        title: "De tijdsvergelijking",
        content: "De tijdsvergelijking is:\n\n$$i\\hbar\\frac{d\\phi}{dt} = E\\phi$$\n\nDit is een eenvoudige eerste-orde ODE met oplossing:\n\n$$\\phi(t) = e^{-iEt/\\hbar}$$\n\n(De integratieconstante wordt geabsorbeerd in $\\psi$.) Merk op: dit is een complex oscillerende fase-factor, geen exponentiële groei of afname. De factor $e^{-iEt/\\hbar}$ heeft modulus 1: $|e^{-iEt/\\hbar}|^2 = 1$. Dit is essentieel — het garandeert dat de normering behouden blijft. De hoekfrequentie van de oscillatie is $\\omega = E/\\hbar$, consistent met de Planck-Einstein relatie $E = \\hbar\\omega$."
      },
      {
        title: "De tijdsonafhankelijke Schrödingervergelijking (TISV)",
        content: "De ruimtevergelijking is de tijdsonafhankelijke Schrödingervergelijking:\n\n$$-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} + V(x)\\psi = E\\psi$$\n\nIn operatornotatie: $\\hat{H}\\psi = E\\psi$. Dit is een eigenwaardevergelijking: we zoeken functies $\\psi$ (eigenfuncties) waarvoor de Hamiltoniaan $\\hat{H}$ gewoon een constante ($E$, de eigenwaarde) maal $\\psi$ oplevert. De TISV is het werkpaard van de quantummechanica — voor elk nieuw probleem (oneindige put, harmonische oscillator, waterstofatoom) moeten we deze vergelijking oplossen met de juiste potentiaal $V(x)$ en randvoorwaarden. De oplossingen zijn de energieniveaus $E_n$ en bijbehorende golffuncties $\\psi_n(x)$."
      },
      {
        title: "Eigenschap 1: Stationaire toestanden hebben een scherp bepaalde energie",
        content: "Voor een stationaire toestand $\\Psi_n(x,t) = \\psi_n(x)e^{-iE_nt/\\hbar}$ is de verwachtingswaarde van de energie:\n\n$$\\langle H \\rangle = \\int \\Psi_n^*\\hat{H}\\Psi_n\\,dx = E_n\\int|\\psi_n|^2\\,dx = E_n$$\n\nEn $\\langle H^2 \\rangle = E_n^2$, dus de variantie is:\n\n$$\\sigma_H^2 = \\langle H^2\\rangle - \\langle H\\rangle^2 = E_n^2 - E_n^2 = 0$$\n\nDe standaarddeviatie is nul! Dit betekent dat elke meting van de energie gegarandeerd de waarde $E_n$ oplevert — er is geen spreiding. Dit is waarom $E$ de energie is: in een stationaire toestand is de energie scherp bepaald."
      },
      {
        title: "Eigenschap 2: Tijdsonafhankelijke kansdichtheid",
        content: "De kansdichtheid van een stationaire toestand is:\n\n$$|\\Psi_n(x,t)|^2 = |\\psi_n(x)|^2\\,|e^{-iE_nt/\\hbar}|^2 = |\\psi_n(x)|^2$$\n\nDe tijdsafhankelijkheid valt volledig weg! De kansverdeling is constant in de tijd — vandaar de naam 'stationaire toestand'. Dit geldt ook voor verwachtingswaarden van elke observabele die niet expliciet van $t$ afhangt. Voorbeeld: $\\langle x \\rangle$ is constant in de tijd, en $\\langle p \\rangle = 0$ voor elke (reële) stationaire toestand. Er beweegt niets! Dit lijkt vreemd — later zullen we zien dat 'beweging' ontstaat door superpositie van meerdere stationaire toestanden."
      },
      {
        title: "Eigenschap 3: Orthonormaliteit van eigentoestanden",
        content: "De eigenfuncties van de Hamiltoniaan zijn (of kunnen gekozen worden als) orthonormaal:\n\n$$\\int_{-\\infty}^{\\infty}\\psi_m(x)^*\\,\\psi_n(x)\\,dx = \\delta_{mn}$$\n\nwaar $\\delta_{mn}$ het Kronecker-delta is ($1$ als $m = n$, $0$ als $m \\neq n$). Dit volgt uit het feit dat $\\hat{H}$ een Hermitische operator is. Orthonormaliteit is essentieel: het zorgt ervoor dat we elke golffunctie eenduidig kunnen ontbinden in energiecomponenten, en dat de coëfficiënten $c_n$ direct de meeteigenschappen geven."
      },
      {
        title: "Eigenschap 4: Volledigheid",
        content: "De eigenfuncties van $\\hat{H}$ vormen een volledige verzameling: elke (fatsoenlijke) golffunctie kan worden geschreven als lineaire combinatie:\n\n$$\\Psi(x,0) = \\sum_n c_n\\,\\psi_n(x)$$\n\nDit is de quantummechanische versie van een Fourier-reeks. De coëfficiënten worden bepaald door de 'Fourier-truc' — vermenigvuldig beide kanten met $\\psi_m^*$ en integreer, gebruik orthonormaliteit:\n\n$$c_m = \\int \\psi_m(x)^*\\,\\Psi(x,0)\\,dx$$\n\nDit is een projectie: $c_m$ is de component van $\\Psi(x,0)$ langs de basistoestand $\\psi_m$. Het is analoog aan het bepalen van de componenten van een vector door het inproduct te nemen met de basisvectoren."
      },
      {
        title: "De algemene oplossing: superpositie van stationaire toestanden",
        content: "Nu we de stationare oplossingen $\\psi_n(x)$ kennen en de begintoestand $\\Psi(x,0)$ kunnen ontbinden, is de volledige tijdsafhankelijke oplossing:\n\n$$\\Psi(x,t) = \\sum_n c_n\\,\\psi_n(x)\\,e^{-iE_nt/\\hbar}$$\n\nDit is het meest centrale recept van de quantummechanica:\n1. Los de TISV op: vind $\\psi_n$ en $E_n$\n2. Ontbind de begintoestand: $c_n = \\int\\psi_n^*\\Psi(x,0)\\,dx$\n3. Plak de tijdsafhankelijkheid erbij: vermenigvuldig elke term met $e^{-iE_nt/\\hbar}$\n\nMerk op: elke term oscilleert met zijn eigen frequentie $\\omega_n = E_n/\\hbar$. Bij een superpositie ontstaan kruistermen in $|\\Psi|^2$ die wél tijdsafhankelijk zijn — dit is hoe 'beweging' ontstaat in de QM."
      },
      {
        title: "Meeteigenschappen van de coëfficiënten",
        content: "De coëfficiënt $c_n$ bevat alle informatie over meetuitkomsten:\n\n- $|c_n|^2$ is de kans om bij een energiemeting de waarde $E_n$ te vinden\n- De verwachtingswaarde van de energie is $\\langle H \\rangle = \\sum_n |c_n|^2 E_n$\n- De normering eist $\\sum_n |c_n|^2 = 1$ (totale kans = 1)\n- $\\langle H \\rangle$ is constant in de tijd (energiebehoud!)\n\nNa een energiemeting die $E_n$ oplevert, collapst de golffunctie naar $\\psi_n$. Bij een onmiddellijk herhaalde meting vind je weer $E_n$. De energie is een bijzondere observabele: elke meting geeft een van de eigenwaarden $E_n$, nooit een waarde 'ertussenin'."
      },
    ],
    exercises: [
      {
        label: "Opgave 1",
        title: "Scheiding van variabelen uitvoeren",
        intro: "We voeren de scheiding van variabelen stap voor stap uit om van de tijdsafhankelijke SV tot de tijdsonafhankelijke SV te komen.",
        steps: [
          {
            question: "Substitueer $\\Psi(x,t) = \\psi(x)\\phi(t)$ in de tijdsafhankelijke Schrödingervergelijking. Schrijf het resultaat op.",
            hints: [
              "$\\frac{\\partial\\Psi}{\\partial t} = \\psi\\frac{d\\phi}{dt}$ en $\\frac{\\partial^2\\Psi}{\\partial x^2} = \\phi\\frac{d^2\\psi}{dx^2}$ (gemengde afgeleiden vereenvoudigen).",
              "Let op: $\\psi$ hangt niet af van $t$, en $\\phi$ hangt niet af van $x$."
            ],
            solution: [
              "$i\\hbar\\,\\psi(x)\\frac{d\\phi}{dt} = -\\frac{\\hbar^2}{2m}\\phi(t)\\frac{d^2\\psi}{dx^2} + V(x)\\psi(x)\\phi(t)$"
            ],
          },
          {
            question: "Deel beide kanten door $\\psi(x)\\phi(t)$. Leg uit waarom beide kanten gelijk moeten zijn aan een constante.",
            hints: [
              "Na deling: linkerkant hangt alleen af van $t$, rechterkant alleen van $x$.",
              "Als $f(t) = g(x)$ voor alle $x$ en $t$, dan moeten beide constant zijn."
            ],
            solution: [
              "$i\\hbar\\frac{1}{\\phi}\\frac{d\\phi}{dt} = -\\frac{\\hbar^2}{2m}\\frac{1}{\\psi}\\frac{d^2\\psi}{dx^2} + V(x)$",
              "De linkerkant hangt alleen af van $t$; de rechterkant alleen van $x$.",
              "De enige manier waarop een functie van $t$ gelijk kan zijn aan een functie van $x$ voor álle waarden van $x$ en $t$, is als beide gelijk zijn aan dezelfde constante. Noem deze $E$."
            ],
          },
          {
            question: "Los de tijdsvergelijking $i\\hbar\\frac{d\\phi}{dt} = E\\phi$ op.",
            hints: [
              "Dit is een eerste-orde ODE van de vorm $\\frac{d\\phi}{dt} = -\\frac{iE}{\\hbar}\\phi$.",
              "De oplossing van $dy/dt = \\alpha y$ is $y = Ce^{\\alpha t}$."
            ],
            solution: [
              "$\\frac{d\\phi}{dt} = -\\frac{iE}{\\hbar}\\phi$",
              "$\\phi(t) = Ce^{-iEt/\\hbar}$",
              "De constante $C$ wordt geabsorbeerd in $\\psi(x)$, dus we schrijven $\\phi(t) = e^{-iEt/\\hbar}$."
            ],
          },
          {
            question: "Schrijf de ruimtevergelijking op. Waarom heet $E$ de 'energie'? (Hint: bereken $\\langle H \\rangle$ voor de oplossing $\\Psi = \\psi\\,e^{-iEt/\\hbar}$.)",
            hints: [
              "De ruimtevergelijking is $\\hat{H}\\psi = E\\psi$.",
              "$\\langle H \\rangle = \\int \\Psi^*\\hat{H}\\Psi\\,dx = \\int \\psi^* e^{+iEt/\\hbar} \\cdot E\\psi\\,e^{-iEt/\\hbar}\\,dx$."
            ],
            solution: [
              "De ruimtevergelijking (TISV): $-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} + V\\psi = E\\psi$.",
              "Oftewel: $\\hat{H}\\psi = E\\psi$.",
              "$\\langle H\\rangle = \\int\\psi^*e^{iEt/\\hbar}\\hat{H}(\\psi e^{-iEt/\\hbar})\\,dx = E\\int|\\psi|^2\\,dx = E$.",
              "De scheidingsconstante $E$ is dus de verwachtingswaarde van de energie — en omdat $\\sigma_H = 0$, is het de scherp bepaalde energie."
            ],
          },
        ],
      },
      {
        label: "Opgave 2",
        title: "Eigenschappen van stationaire toestanden",
        intro: "We bewijzen de drie kernresultaten over stationaire toestanden: de kansdichtheid is tijdsonafhankelijk, de energie is scherp bepaald, en $\\langle p \\rangle = 0$ (voor reële $\\psi$).",
        steps: [
          {
            question: "Laat zien dat de kansdichtheid $|\\Psi_n(x,t)|^2$ van een stationaire toestand niet afhangt van de tijd.",
            hints: [
              "$\\Psi_n = \\psi_n e^{-iE_nt/\\hbar}$. Bereken $|\\Psi_n|^2 = \\Psi_n^*\\Psi_n$.",
              "Wat is $e^{+i\\theta} \\cdot e^{-i\\theta}$?"
            ],
            solution: [
              "$|\\Psi_n|^2 = (\\psi_n^* e^{+iE_nt/\\hbar})(\\psi_n e^{-iE_nt/\\hbar}) = |\\psi_n|^2 \\cdot e^{0} = |\\psi_n(x)|^2$",
              "De fase-factoren $e^{\\pm iE_nt/\\hbar}$ cancelen exact. De kansdichtheid hangt niet af van $t$."
            ],
          },
          {
            question: "Toon aan dat de variantie van de energie nul is: $\\sigma_H^2 = 0$.",
            hints: [
              "Bereken $\\langle H \\rangle$ en $\\langle H^2 \\rangle$ apart.",
              "Gebruik $\\hat{H}\\psi_n = E_n\\psi_n$, dus $\\hat{H}^2\\psi_n = \\hat{H}(E_n\\psi_n) = E_n^2\\psi_n$."
            ],
            solution: [
              "$\\langle H \\rangle = \\int\\psi_n^*\\hat{H}\\psi_n\\,dx = E_n\\int|\\psi_n|^2\\,dx = E_n$",
              "$\\langle H^2 \\rangle = \\int\\psi_n^*\\hat{H}^2\\psi_n\\,dx = E_n^2\\int|\\psi_n|^2\\,dx = E_n^2$",
              "$\\sigma_H^2 = \\langle H^2\\rangle - \\langle H\\rangle^2 = E_n^2 - E_n^2 = 0$",
              "De energie is dus exact $E_n$ bij elke meting — geen spreiding."
            ],
          },
          {
            question: "Als $\\psi_n(x)$ reëelwaardig gekozen kan worden (wat altijd kan voor gebonden toestanden met een reële potentiaal), toon dan aan dat $\\langle p \\rangle = 0$.",
            hints: [
              "$\\langle p \\rangle = -i\\hbar\\int\\psi_n\\frac{d\\psi_n}{dx}\\,dx$ (met $\\psi_n^* = \\psi_n$ want reëel).",
              "Merk op dat $\\psi_n\\frac{d\\psi_n}{dx} = \\frac{1}{2}\\frac{d}{dx}(\\psi_n^2)$.",
              "Integreer en gebruik de randvoorwaarde $\\psi_n \\to 0$ voor $x \\to \\pm\\infty$."
            ],
            solution: [
              "$\\langle p \\rangle = -i\\hbar\\int_{-\\infty}^{\\infty}\\psi_n\\frac{d\\psi_n}{dx}\\,dx = -i\\hbar\\int_{-\\infty}^{\\infty}\\frac{1}{2}\\frac{d}{dx}(\\psi_n^2)\\,dx$",
              "$= -\\frac{i\\hbar}{2}\\left[\\psi_n^2\\right]_{-\\infty}^{\\infty} = -\\frac{i\\hbar}{2}(0 - 0) = 0$",
              "Een stationaire toestand met reële $\\psi_n$ heeft $\\langle p\\rangle = 0$: er is geen netto stroming.",
              "Dit is consistent met het feit dat $\\langle x\\rangle$ constant is — er beweegt niets!"
            ],
          },
          {
            question: "Toon aan dat ook de verwachtingswaarde van elke $x$-afhankelijke observabele $Q(x)$ tijdsonafhankelijk is in een stationaire toestand.",
            hints: [
              "$\\langle Q \\rangle = \\int \\Psi_n^*\\,Q(x)\\,\\Psi_n\\,dx$. Substitueer $\\Psi_n = \\psi_n e^{-iE_nt/\\hbar}$.",
              "De fasefactoren cancelen weer."
            ],
            solution: [
              "$\\langle Q \\rangle = \\int (\\psi_n^* e^{iE_nt/\\hbar})\\,Q(x)\\,(\\psi_n e^{-iE_nt/\\hbar})\\,dx$",
              "$= \\int \\psi_n^*\\,Q(x)\\,\\psi_n\\,dx$",
              "De tijdsafhankelijkheid verdwijnt volledig. Elke verwachtingswaarde is constant in de tijd.",
              "Vandaar de naam: in een stationaire toestand is er niets dat verandert."
            ],
          },
        ],
      },
      {
        label: "Opgave 3",
        title: "Superpositie en tijdsevolutie",
        intro: "We onderzoeken wat er gebeurt als een deeltje zich in een superpositie van twee stationaire toestanden bevindt: $\\Psi(x,0) = c_1\\psi_1(x) + c_2\\psi_2(x)$.",
        steps: [
          {
            question: "Schrijf $\\Psi(x,t)$ op voor de superpositie $\\Psi(x,0) = c_1\\psi_1 + c_2\\psi_2$.",
            hints: [
              "Elke component krijgt zijn eigen tijdsfase $e^{-iE_nt/\\hbar}$."
            ],
            solution: [
              "$\\Psi(x,t) = c_1\\psi_1(x)e^{-iE_1t/\\hbar} + c_2\\psi_2(x)e^{-iE_2t/\\hbar}$"
            ],
          },
          {
            question: "Bereken $|\\Psi(x,t)|^2$ en laat zien dat de kansdichtheid oscilleert met frequentie $\\omega_{21} = (E_2 - E_1)/\\hbar$.",
            hints: [
              "$|\\Psi|^2 = (c_1^*\\psi_1^* e^{iE_1t/\\hbar} + c_2^*\\psi_2^* e^{iE_2t/\\hbar})(c_1\\psi_1 e^{-iE_1t/\\hbar} + c_2\\psi_2 e^{-iE_2t/\\hbar})$.",
              "Werk de vier termen uit. De kruistermen bevatten $e^{\\pm i(E_2-E_1)t/\\hbar}$.",
              "Gebruik $e^{i\\theta} + e^{-i\\theta} = 2\\cos\\theta$."
            ],
            solution: [
              "$|\\Psi|^2 = |c_1|^2|\\psi_1|^2 + |c_2|^2|\\psi_2|^2 + 2\\,\\text{Re}\\left(c_1^*c_2\\,\\psi_1^*\\psi_2\\,e^{-i(E_2-E_1)t/\\hbar}\\right)$",
              "De eerste twee termen zijn tijdsonafhankelijk. De derde term oscilleert met:",
              "$\\omega_{21} = \\frac{E_2 - E_1}{\\hbar}$",
              "Dit is de 'Bohr-frequentie': de kansdichtheid oscilleert met de frequentie die overeenkomt met het energieverschil.",
              "Cruciaal: een enkele stationaire toestand geeft geen beweging; het is de interferentie tussen twee toestanden die dynamica creëert."
            ],
          },
          {
            question: "Wat zijn de kansen $P(E_1)$ en $P(E_2)$ om bij een energiemeting $E_1$ resp. $E_2$ te vinden? Hangen deze af van het tijdstip van de meting?",
            hints: [
              "De kans om $E_n$ te vinden is $|c_n|^2$.",
              "Verandert $c_n$ in de tijd? Kijk naar hoe $\\Psi(x,t)$ is opgebouwd."
            ],
            solution: [
              "$P(E_1) = |c_1|^2$ en $P(E_2) = |c_2|^2$.",
              "Deze kansen zijn tijdsonafhankelijk! De coëfficiënten $c_n$ veranderen niet in de Schrödinger-tijdsevolutie.",
              "De tijdsafhankelijkheid zit alleen in de fase-factoren $e^{-iE_nt/\\hbar}$, die de kansen niet beïnvloeden.",
              "Dit is energiebehoud: $\\langle H\\rangle = |c_1|^2E_1 + |c_2|^2E_2$ is constant."
            ],
          },
          {
            question: "Na een energiemeting op tijdstip $t_0$ vinden we $E_2$. Wat is de toestand direct na de meting? En hoe evolueert het systeem daarna?",
            hints: [
              "Denk aan het collapse-postulaat.",
              "Na collapse is de toestand een stationaire toestand. Hoe evolueert die?"
            ],
            solution: [
              "Direct na de meting collapst de golffunctie naar $\\Psi(x,t_0) = \\psi_2(x)$ (genormeerd).",
              "Voor $t > t_0$ evolueert de toestand als $\\Psi(x,t) = \\psi_2(x)e^{-iE_2(t-t_0)/\\hbar}$.",
              "Dit is nu een enkele stationaire toestand — de kansdichtheid $|\\psi_2|^2$ verandert niet meer.",
              "Elke volgende energiemeting geeft gegarandeerd $E_2$."
            ],
          },
        ],
      },
      {
        label: "Opgave 4",
        title: "De Fourier-truc: coëfficiënten bepalen",
        intro: "We gebruiken de orthonormaliteit van de eigenfuncties om de coëfficiënten $c_n$ te bepalen uit de begintoestand.",
        steps: [
          {
            question: "Gegeven $\\Psi(x,0) = \\sum_n c_n\\psi_n(x)$. Vermenigvuldig beide kanten met $\\psi_m^*(x)$ en integreer over $x$. Gebruik de orthonormaliteit $\\int\\psi_m^*\\psi_n\\,dx = \\delta_{mn}$ om $c_m$ te isoleren.",
            hints: [
              "$\\int\\psi_m^*\\sum_n c_n\\psi_n\\,dx = \\sum_n c_n\\int\\psi_m^*\\psi_n\\,dx = \\sum_n c_n\\delta_{mn}$.",
              "De Kronecker-delta selecteert precies de term $n = m$."
            ],
            solution: [
              "$\\int\\psi_m^*(x)\\Psi(x,0)\\,dx = \\int\\psi_m^*\\sum_n c_n\\psi_n\\,dx = \\sum_n c_n\\int\\psi_m^*\\psi_n\\,dx$",
              "$= \\sum_n c_n\\,\\delta_{mn} = c_m$",
              "Dus: $c_m = \\int\\psi_m^*(x)\\,\\Psi(x,0)\\,dx$ — de Fourier-truc."
            ],
          },
          {
            question: "Toon aan dat $\\sum_n|c_n|^2 = 1$ als $\\Psi(x,0)$ genormeerd is.",
            hints: [
              "Bereken $\\int|\\Psi(x,0)|^2\\,dx$ met $\\Psi = \\sum c_n\\psi_n$.",
              "Gebruik de orthonormaliteit om de integraal te vereenvoudigen."
            ],
            solution: [
              "$1 = \\int|\\Psi|^2\\,dx = \\int\\left(\\sum_m c_m^*\\psi_m^*\\right)\\left(\\sum_n c_n\\psi_n\\right)dx$",
              "$= \\sum_m\\sum_n c_m^*c_n\\int\\psi_m^*\\psi_n\\,dx = \\sum_m\\sum_n c_m^*c_n\\,\\delta_{mn}$",
              "$= \\sum_n |c_n|^2$",
              "Dit bevestigt de interpretatie: de kansen $|c_n|^2$ sommeren tot 1."
            ],
          },
          {
            question: "Toon aan dat $\\langle H \\rangle = \\sum_n |c_n|^2 E_n$ en dat dit tijdsonafhankelijk is.",
            hints: [
              "$\\langle H \\rangle = \\int\\Psi^*\\hat{H}\\Psi\\,dx$ met $\\Psi(x,t) = \\sum_n c_n\\psi_n e^{-iE_nt/\\hbar}$.",
              "Gebruik $\\hat{H}\\psi_n = E_n\\psi_n$ en orthonormaliteit."
            ],
            solution: [
              "$\\langle H \\rangle = \\int\\left(\\sum_m c_m^*\\psi_m^* e^{iE_mt/\\hbar}\\right)\\hat{H}\\left(\\sum_n c_n\\psi_n e^{-iE_nt/\\hbar}\\right)dx$",
              "$= \\sum_m\\sum_n c_m^*c_n E_n\\,e^{i(E_m-E_n)t/\\hbar}\\int\\psi_m^*\\psi_n\\,dx$",
              "$= \\sum_m\\sum_n c_m^*c_n E_n\\,e^{i(E_m-E_n)t/\\hbar}\\,\\delta_{mn}$",
              "$= \\sum_n |c_n|^2 E_n$",
              "De tijdsafhankelijke exponentiëlen verdwijnen door de Kronecker-delta ($m = n$ geeft $e^0 = 1$).",
              "Dus $\\langle H\\rangle$ is tijdsonafhankelijk — dit is energiebehoud in de quantummechanica!"
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        question: "Bij scheiding van variabelen $\\Psi(x,t) = \\psi(x)\\phi(t)$, wat is de oplossing voor $\\phi(t)$?",
        options: [
          "$\\phi(t) = e^{-Et/\\hbar}$",
          "$\\phi(t) = e^{-iEt/\\hbar}$",
          "$\\phi(t) = \\cos(Et/\\hbar)$",
          "$\\phi(t) = e^{-E^2t/\\hbar}$"
        ],
        correct: 1,
        explanation: "De tijdsvergelijking $i\\hbar d\\phi/dt = E\\phi$ geeft $\\phi(t) = e^{-iEt/\\hbar}$. Let op de factor $i$ — dit is een oscillerende fase, geen exponentieel verval."
      },
      {
        question: "De tijdsonafhankelijke Schrödingervergelijking $\\hat{H}\\psi = E\\psi$ is een:",
        options: [
          "Partiële differentiaalvergelijking",
          "Gewone differentiaalvergelijking en eigenwaardevergelijking",
          "Integaalvergelijking",
          "Algebraïsche vergelijking"
        ],
        correct: 1,
        explanation: "De TISV is een tweede-orde gewone differentiaalvergelijking in $x$ (de tijd is weg-gesepareerd). Het is ook een eigenwaardevergelijking: we zoeken functies $\\psi$ waarvoor $\\hat{H}$ een constante maal $\\psi$ geeft."
      },
      {
        question: "In een stationaire toestand is de kansdichtheid $|\\Psi(x,t)|^2$ tijdsafhankelijk?",
        options: [
          "Ja, het oscilleert met frequentie $E/\\hbar$",
          "Nee, de tijdsafhankelijkheid valt weg in $|\\Psi|^2$",
          "Alleen voor gebonden toestanden",
          "Alleen als $V(x) = 0$"
        ],
        correct: 1,
        explanation: "$|\\Psi_n|^2 = |\\psi_n|^2 |e^{-iE_n t/\\hbar}|^2 = |\\psi_n|^2$. De fase-factor heeft modulus 1, dus de kansdichtheid is tijdsonafhankelijk."
      },
      {
        question: "Wat is de variantie van de energie in een stationaire toestand?",
        options: [
          "$\\sigma_H^2 = E_n$",
          "$\\sigma_H^2 = \\hbar\\omega$",
          "$\\sigma_H^2 = 0$",
          "$\\sigma_H^2 = E_n^2/2$"
        ],
        correct: 2,
        explanation: "$\\langle H\\rangle = E_n$ en $\\langle H^2\\rangle = E_n^2$, dus $\\sigma_H^2 = E_n^2 - E_n^2 = 0$. De energie is scherp bepaald — elke meting geeft exact $E_n$."
      },
      {
        question: "Als $\\Psi = c_1\\psi_1 e^{-iE_1t/\\hbar} + c_2\\psi_2 e^{-iE_2t/\\hbar}$, wat is de kans om $E_1$ te meten?",
        options: ["$c_1$", "$|c_1|^2$", "$c_1^2$", "$|c_1|$"],
        correct: 1,
        explanation: "De kans om energie $E_n$ te meten is $|c_n|^2$ (Born's regel). De fase van $c_n$ beïnvloedt de kans niet."
      },
      {
        question: "Na een energiemeting die $E_n$ oplevert, bevindt het systeem zich in:",
        options: [
          "Dezelfde superpositie als ervoor",
          "De toestand $\\psi_n$ (collapse van de golffunctie)",
          "De grondtoestand $\\psi_1$",
          "Een willekeurige eigentoestand"
        ],
        correct: 1,
        explanation: "Na een meting collapst de golffunctie naar de gemeten eigentoestand $\\psi_n$. Het systeem is dan in een stationaire toestand."
      },
      {
        question: "De kansdichtheid van een superpositie $c_1\\psi_1 + c_2\\psi_2$ oscilleert met frequentie:",
        options: [
          "$E_1/\\hbar$",
          "$E_2/\\hbar$",
          "$(E_2 - E_1)/\\hbar$",
          "$(E_1 + E_2)/\\hbar$"
        ],
        correct: 2,
        explanation: "De kruistermen in $|\\Psi|^2$ bevatten $e^{\\pm i(E_2 - E_1)t/\\hbar}$, dus de oscillatiefrequentie is $\\omega_{21} = (E_2 - E_1)/\\hbar$ — de Bohr-frequentie."
      },
      {
        question: "De verwachtingswaarde $\\langle H \\rangle$ voor een superpositie is:",
        options: [
          "Tijdsafhankelijk en oscilleert",
          "Altijd gelijk aan $E_1$",
          "$\\sum_n |c_n|^2 E_n$, constant in de tijd",
          "Onbepaald totdat je meet"
        ],
        correct: 2,
        explanation: "$\\langle H\\rangle = \\sum_n|c_n|^2 E_n$ is tijdsonafhankelijk. Dit is energiebehoud in de quantummechanica."
      },
    ],
};

export default chapter6;
