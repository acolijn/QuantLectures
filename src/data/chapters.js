const chapters = [
  {
    id: 1,
    title: "Klassiek versus Quantum",
    subtitle: "Het Bohr-model, golf-deeltjes dualiteit, dubbelspletexperimenten",
    formulas: [
      { name: "Fotonenergie", latex: "E = hf" },
      { name: "De Broglie golflengte", latex: "\\lambda = \\frac{h}{p}" },
      { name: "Kracht en potentiaal", latex: "F(x) = -\\frac{dV(x)}{dx}" },
      { name: "Totale energie", latex: "E_{\\text{tot}} = \\frac{p^2}{2m} + V" },
      { name: "Centripetale kracht = Coulombkracht", latex: "\\frac{m_e v^2}{r} = \\frac{\\alpha}{r^2}, \\quad \\alpha = \\frac{e^2}{4\\pi\\varepsilon_0}" },
      { name: "Bohr kwantisatievoorwaarde", latex: "m_e v r = n\\hbar" },
      { name: "Bohr straal", latex: "r_n = n^2 \\frac{\\hbar^2}{m_e \\alpha} = n^2 r_B, \\quad r_B \\approx 0.529 \\text{ Å}" },
      { name: "Energie waterstof", latex: "E_n = -\\frac{E_0}{n^2}, \\quad E_0 = \\frac{m_e \\alpha^2}{2\\hbar^2} = 13.6 \\text{ eV}" },
      { name: "Fotonfrequentie bij overgang", latex: "f_{n \\to m} = \\frac{E_n - E_m}{h}" },
      { name: "Klassieke omloopfrequentie", latex: "f_{\\text{klass}} = \\frac{v}{2\\pi r} = \\frac{1}{2\\pi}\\sqrt{\\frac{\\alpha}{m_e r^3}}" },
    ],
    concepts: [
      {
        title: "Fotonen en het foto-elektrisch effect",
        content: "In 1905 postuleerde Einstein dat licht met frequentie $f$ is opgebouwd uit fotonen met energie $E = hf$, waarbij $h$ de constante van Planck is ($h = 6.626 \\times 10^{-34}$ Js). Deze deeltjestheorie van licht verklaart het foto-elektrisch effect: licht kan elektronen uit een metaaloppervlak slaan, maar alleen als de frequentie hoog genoeg is — onafhankelijk van de intensiteit. Klassiek (golf-theorie) zou elke frequentie moeten werken als je maar lang genoeg wacht. Einstein's verklaring: elk foton draagt energie $hf$; alleen als $hf$ groter is dan de uittreearbeid $\\phi$ van het metaal, kan een elektron vrijkomen. De kinetische energie van het vrijgekomen elektron is $E_k = hf - \\phi$. Dit was een van de eerste aanwijzingen dat de klassieke fysica niet compleet is."
      },
      {
        title: "De Broglie en golf-deeltjes dualiteit",
        content: "Rond 1924 merkte De Broglie op: als licht (typisch een golfverschijnsel) zich soms als deeltje gedraagt, dan zouden deeltjes zich ook als golven moeten kunnen gedragen. Hij stelde voor dat elk deeltje met impuls $p$ een golflengte heeft: $\\lambda = h/p$. Voor een foton met $E = hf = pc$ geeft dit inderdaad $\\lambda = h/p = c/f$, consistent met de bekende relatie voor elektromagnetische golven. Voor een elektron met kinetische energie $E_k$ geldt $p = \\sqrt{2m_e E_k}$, dus $\\lambda = h/\\sqrt{2m_e E_k}$. Voorbeeld: een elektron versneld over 100 V heeft $E_k = 100$ eV, wat leidt tot $\\lambda \\approx 0.12$ nm — vergelijkbaar met de afstand tussen atomen in een kristal, waardoor elektronendiffractie mogelijk wordt."
      },
      {
        title: "Het Bohr-model: krachtenevenwicht",
        content: "In het Bohr-model (1913) draait het elektron in cirkelvormige banen rond het proton. De Coulombkracht houdt het elektron in zijn baan: $F_{\\text{el}} = \\alpha/r^2$ met $\\alpha = e^2/(4\\pi\\varepsilon_0)$. Dit is tegelijk de centripetale kracht: $m_e v^2/r = \\alpha/r^2$. Hieruit volgt direct $m_e v^2 = \\alpha/r$. De totale energie is dan: $E = \\frac{1}{2}m_e v^2 - \\alpha/r = -\\alpha/(2r)$. Let op het minteken: de totale energie is negatief (gebonden toestand) en gelijk aan min de helft van de kinetische energie. Dit is een voorbeeld van het viriaaltheorema."
      },
      {
        title: "Het Bohr-model: kwantisatie",
        content: "Bohr's cruciale aanname is dat alleen die banen zijn toegestaan waarvan de omtrek een veelvoud $n$ van de De Broglie golflengte is: $2\\pi r = n\\lambda = nh/p = nh/(m_e v)$. Dit geeft de kwantisatievoorwaarde $m_e v r = n\\hbar$ (met $\\hbar = h/(2\\pi)$). Combinatie met $m_e v^2 = \\alpha/r$ levert de Bohr-straal: $r_n = n^2 \\hbar^2/(m_e \\alpha) = n^2 r_B$ met $r_B \\approx 0.529$ Å. De bijbehorende energieniveaus zijn $E_n = -E_0/n^2$ met $E_0 = 13.6$ eV. De grondtoestand ($n=1$) heeft de laagste energie; voor $n \\to \\infty$ gaat $E_n \\to 0$ (vrij elektron). De ionisatie-energie is dus 13.6 eV."
      },
      {
        title: "Spectraallijnen van waterstof",
        content: "Als een elektron overspringt van baan $n$ naar baan $m$ (met $n > m$), komt het energieverschil vrij als een foton: $hf = E_n - E_m = E_0(1/m^2 - 1/n^2)$. Dit voorspelt scherpe spectraallijnen bij specifieke golflengtes. De Lyman serie ($m=1$, UV), Balmer serie ($m=2$, zichtbaar licht) en Paschen serie ($m=3$, infrarood) zijn allemaal experimenteel bevestigd. Voorbeeld: de rode Balmer-lijn bij 656 nm komt overeen met de overgang $n=3 \\to m=2$: $1/\\lambda = E_0(1/4 - 1/9)/(hc) = R_H \\cdot 5/36$ met $R_H$ de Rydberg-constante."
      },
      {
        title: "Het correspondentieprincipe",
        content: "Volgens het correspondentieprincipe van Bohr moeten de voorspellingen van de quantummechanica voor grote kwantumgetallen $n$ overeenkomen met de klassieke fysica. In het Bohr-model: de klassieke omloopfrequentie van het elektron is $f_{\\text{klass}} = v/(2\\pi r)$. De quantummechanische fotonfrequentie bij een overgang $n+1 \\to n$ is $f = (E_{n+1} - E_n)/h$. Voor grote $n$ kan men aantonen dat $E_{n+1} - E_n \\approx 2E_0/n^3$, en inderdaad geldt dan $f \\to f_{\\text{klass}}$. Dit is een belangrijke consistentiecheck: de quantumtheorie geeft de juiste klassieke limiet."
      },
      {
        title: "Dubbelspletexperiment: klassieke deeltjes",
        content: "Als we klassieke kogeltjes op een dubbele spleet afschieten, zien we twee pieken op het scherm — één achter elke spleet. De kansverdeling als beide spleten open zijn is simpelweg de som: $P_{12} = P_1 + P_2$. Er is geen interferentie: deeltjes gaan door de ene óf de andere spleet."
      },
      {
        title: "Dubbelspletexperiment: golven",
        content: "Bij watergolven of lichtgolven zien we een interferentiepatroon met afwisselend maxima en minima. De intensiteit is $I_{12} = |A_1 + A_2|^2 \\neq I_1 + I_2$. Het verschil zit in de kruistermen (interferentietermen): $I_{12} = I_1 + I_2 + 2\\text{Re}(A_1^* A_2)$. Op plekken waar de golven in fase aankomen (wegverschil = $n\\lambda$) is er constructieve interferentie; bij een wegverschil van $(n+\\frac{1}{2})\\lambda$ destructieve interferentie."
      },
      {
        title: "Dubbelspletexperiment: elektronen",
        content: "Het verrassende resultaat: ook individuele elektronen, één voor één afgevuurd, bouwen na verloop van tijd een interferentiepatroon op. Elk elektron arriveert als een punt op het scherm (deeltjesgedrag bij detectie), maar de kansverdeling volgt een golfpatroon. Dit geldt zelfs als we de stroom zo laag zetten dat er nooit twee elektronen tegelijk onderweg zijn. Elk elektron 'interfereert met zichzelf'. Als we echter een detector plaatsen om te meten door welke spleet het elektron gaat, verdwijnt het interferentiepatroon en krijgen we het klassieke deeltjespatroon. De meting verstoort de superpositie."
      },
      {
        title: "Superpositie en toestanden",
        content: "Het dubbelspletexperiment leidt tot een fundamenteel nieuw concept: als een elektron door beide spleten kan gaan, is de toestand een superpositie $\\Psi = \\Psi_1 + \\Psi_2$. De kansverdeling is $|\\Psi_1 + \\Psi_2|^2$, niet $|\\Psi_1|^2 + |\\Psi_2|^2$. Dit verschil — de interferentietermen — is de essentie van de quantummechanica. Bij een meting 'collapst' de superpositie naar één van de mogelijke uitkomsten. Dit is fundamenteel anders dan klassieke onwetendheid: het is niet zo dat het elektron 'eigenlijk' door één spleet gaat maar we weten niet welke."
      },
    ],
    exercises: [
      {
        label: "Opgave 1",
        title: "Het Bohr-atoom: van Coulomb tot energieniveaus",
        intro: "In deze opgave leiden we stap voor stap de energieniveaus van het waterstofatoom af binnen het Bohr-model. We beginnen bij de Coulombkracht en eindigen bij de bekende formule $E_n = -13.6/n^2$ eV.",
        steps: [
          {
            question: "Het elektron (lading $-e$) draait in een cirkelbaan met straal $r$ rond het proton (lading $+e$). De potentiële energie is $V(r) = -\\alpha/r$ met $\\alpha = e^2/(4\\pi\\varepsilon_0)$. Toon aan dat de Coulombkracht gegeven wordt door $F_{\\text{el}} = -dV/dr = -\\alpha/r^2$ (aantrekkend, richting proton).",
            hints: [
              "Gebruik $F = -dV/dr$ en differentieer $V(r) = -\\alpha/r$.",
              "$d/dr(-\\alpha/r) = \\alpha/r^2$. De kracht is $F = -\\alpha/r^2$ (negatief = richting proton)."
            ],
            solution: [
              "$V(r) = -\\alpha / r$",
              "$F = -\\frac{dV}{dr} = -\\frac{d}{dr}\\left(-\\frac{\\alpha}{r}\\right) = -\\frac{\\alpha}{r^2}$",
              "Het minteken geeft aan dat de kracht aantrekkend is (naar het proton toe gericht)."
            ],
          },
          {
            question: "De Coulombkracht fungeert als centripetale kracht: $m_e v^2/r = \\alpha/r^2$. Leid hieruit af dat $m_e v^2 = \\alpha/r$ en toon aan dat de totale energie gelijk is aan $E = -\\alpha/(2r)$.",
            hints: [
              "Vermenigvuldig beide kanten van $m_e v^2/r = \\alpha/r^2$ met $r$.",
              "De totale energie is $E = \\frac{1}{2}m_e v^2 + V = \\frac{1}{2}m_e v^2 - \\alpha/r$. Substitueer $m_e v^2 = \\alpha/r$."
            ],
            solution: [
              "Uit $m_e v^2/r = \\alpha/r^2$ volgt direct: $m_e v^2 = \\alpha/r$.",
              "$E = \\frac{1}{2}m_e v^2 - \\frac{\\alpha}{r} = \\frac{\\alpha}{2r} - \\frac{\\alpha}{r} = -\\frac{\\alpha}{2r}$",
              "De totale energie is negatief (gebonden toestand) en gelijk aan min de helft van de kinetische energie."
            ],
          },
          {
            question: "Bohr neemt aan dat de omtrek van de baan een geheel aantal keer de De Broglie golflengte is: $2\\pi r = n\\lambda = n h/(m_e v)$. Leid hieruit de kwantisatievoorwaarde $m_e v r = n\\hbar$ af.",
            hints: [
              "Herschrijf $2\\pi r = nh/(m_e v)$ door beide kanten te vermenigvuldigen met $m_e v/(2\\pi)$.",
              "Gebruik $\\hbar = h/(2\\pi)$."
            ],
            solution: [
              "$2\\pi r = \\frac{nh}{m_e v}$",
              "$m_e v r = \\frac{nh}{2\\pi} = n\\hbar$"
            ],
          },
          {
            question: "Combineer $m_e v^2 = \\alpha/r$ met $m_e v r = n\\hbar$ om de Bohr-straal af te leiden: $r_n = n^2 \\hbar^2/(m_e \\alpha)$.",
            hints: [
              "Uit $m_e v r = n\\hbar$ volgt $v = n\\hbar/(m_e r)$. Substitueer dit in $m_e v^2 = \\alpha/r$.",
              "Je krijgt $m_e \\cdot n^2\\hbar^2/(m_e^2 r^2) = \\alpha/r$. Vereenvoudig en los op naar $r$."
            ],
            solution: [
              "Uit kwantisatievoorwaarde: $v = \\frac{n\\hbar}{m_e r}$",
              "Substitutie in $m_e v^2 = \\alpha/r$:",
              "$m_e \\cdot \\frac{n^2\\hbar^2}{m_e^2 r^2} = \\frac{\\alpha}{r}$",
              "$\\frac{n^2\\hbar^2}{m_e r^2} = \\frac{\\alpha}{r}$",
              "$r = r_n = \\frac{n^2\\hbar^2}{m_e \\alpha} = n^2 r_B$"
            ],
          },
          {
            question: "Bereken de Bohr-straal $r_B = r_1$ in meters. Gebruik $\\hbar = 1.054 \\times 10^{-34}$ Js, $m_e = 9.11 \\times 10^{-31}$ kg, en $\\alpha = e^2/(4\\pi\\varepsilon_0) = 2.307 \\times 10^{-28}$ Jm. Geef je antwoord in ångström (1 Å = $10^{-10}$ m).",
            hints: [
              "$r_B = \\hbar^2/(m_e \\alpha)$. Reken eerst $\\hbar^2$ uit, dan delen door $m_e \\cdot \\alpha$."
            ],
            answer: ["0.529", "0.53"],
            solution: [
              "$r_B = \\frac{(1.054 \\times 10^{-34})^2}{9.11 \\times 10^{-31} \\times 2.307 \\times 10^{-28}}$",
              "$= \\frac{1.111 \\times 10^{-68}}{2.102 \\times 10^{-58}} = 5.29 \\times 10^{-11}$ m $= 0.529$ Å"
            ],
          },
          {
            question: "Leid de energieniveaus af: $E_n = -E_0/n^2$ met $E_0 = m_e\\alpha^2/(2\\hbar^2)$. Bereken $E_0$ in eV.",
            hints: [
              "Substitueer $r_n = n^2\\hbar^2/(m_e\\alpha)$ in $E = -\\alpha/(2r)$.",
              "Gebruik $1$ eV $= 1.602 \\times 10^{-19}$ J om naar eV om te rekenen."
            ],
            answer: ["13.6"],
            solution: [
              "$E_n = -\\frac{\\alpha}{2r_n} = -\\frac{\\alpha}{2} \\cdot \\frac{m_e\\alpha}{n^2\\hbar^2} = -\\frac{m_e\\alpha^2}{2n^2\\hbar^2} = -\\frac{E_0}{n^2}$",
              "$E_0 = \\frac{m_e\\alpha^2}{2\\hbar^2} = \\frac{9.11 \\times 10^{-31} \\times (2.307 \\times 10^{-28})^2}{2 \\times (1.054 \\times 10^{-34})^2}$",
              "$= 2.18 \\times 10^{-18}$ J $= 13.6$ eV"
            ],
          },
        ],
      },
      {
        label: "Opgave 2",
        title: "De harmonische oscillator à la Bohr",
        intro: "We passen het Bohr-model toe op een deeltje in een krachtveld $F = -Cr$. We vergelijken het resultaat met de volledige quantummechanische oplossing uit hoofdstuk 7.",
        steps: [
          {
            question: "Een deeltje met massa $m$ beweegt in een cirkelbaan onder invloed van $F = -Cr$. Toon aan dat de potentiële energie $V(r) = \\frac{1}{2}Cr^2$ is (kies $V(0) = 0$).",
            hints: [
              "Gebruik $V(r) = -\\int_0^r F(r')dr' = -\\int_0^r (-Cr')dr'$."
            ],
            solution: [
              "$V(r) = -\\int_0^r (-Cr')dr' = C\\int_0^r r'dr' = \\frac{1}{2}Cr^2$"
            ],
          },
          {
            question: "De kracht levert de centripetale versnelling: $Cr = mv^2/r$. Leid hieruit af dat de totale energie $E = Cr^2$ is.",
            hints: [
              "Uit $Cr = mv^2/r$ volgt $mv^2 = Cr^2$. Wat is de kinetische energie?",
              "$E = \\frac{1}{2}mv^2 + \\frac{1}{2}Cr^2 = \\frac{1}{2}Cr^2 + \\frac{1}{2}Cr^2$."
            ],
            solution: [
              "$mv^2 = Cr^2$, dus $E_k = \\frac{1}{2}mv^2 = \\frac{1}{2}Cr^2$.",
              "$E = E_k + V = \\frac{1}{2}Cr^2 + \\frac{1}{2}Cr^2 = Cr^2$"
            ],
          },
          {
            question: "Toon aan dat alle cirkelbanen dezelfde frequentie hebben: $f = \\frac{1}{2\\pi}\\sqrt{C/m}$.",
            hints: [
              "De omloopfrequentie is $f = v/(2\\pi r)$. Uit $mv^2 = Cr^2$ volgt $v/r = \\sqrt{C/m}$."
            ],
            solution: [
              "$f = \\frac{v}{2\\pi r} = \\frac{1}{2\\pi}\\frac{v}{r}$. Uit $mv^2 = Cr^2$: $v^2/r^2 = C/m$.",
              "$f = \\frac{1}{2\\pi}\\sqrt{\\frac{C}{m}}$",
              "Dit is onafhankelijk van $r$: alle banen hebben dezelfde frequentie!"
            ],
          },
          {
            question: "Pas de Bohr-kwantisatie toe ($mvr = n\\hbar$) en leid af dat $E_n = n\\hbar\\omega$ met $\\omega = 2\\pi f = \\sqrt{C/m}$.",
            hints: [
              "Uit $mvr = n\\hbar$ en $mv^2 = Cr^2$: elimineer $v$ om $r_n^2 = n\\hbar/\\sqrt{mC}$ te vinden.",
              "Gebruik $E = Cr^2$ en $\\omega = \\sqrt{C/m}$."
            ],
            solution: [
              "Uit $mvr = n\\hbar$: $v = n\\hbar/(mr)$.",
              "Substitutie in $mv^2 = Cr^2$: $n^2\\hbar^2/(mr^2) = Cr^2$, dus $r^4 = n^2\\hbar^2/(mC)$.",
              "Nee, beter: $mv^2 = Cr^2$ en $mvr = n\\hbar$. Delen: $v/r = Cr^2/(n\\hbar)$ en $v/r = \\sqrt{C/m}$.",
              "Dus $r^2 = n\\hbar/\\sqrt{mC} = n\\hbar/\\omega m$ (met $\\omega^2 = C/m$).",
              "$E_n = Cr_n^2 = C \\cdot \\frac{n\\hbar}{\\sqrt{mC}} = n\\hbar\\sqrt{C/m} = n\\hbar\\omega$"
            ],
          },
          {
            question: "De quantummechanica geeft $E_n = (n + \\frac{1}{2})\\hbar\\omega$ met $n = 0, 1, 2, \\ldots$ Wat is het verschil met het Bohr-resultaat, en waarom verdwijnt dit verschil in de klassieke limiet $\\hbar \\to 0$?",
            hints: [
              "Schrijf $E_n^{\\text{QM}} = n\\hbar\\omega + \\frac{1}{2}\\hbar\\omega$. Het verschil is de nulpuntsenergie $\\frac{1}{2}\\hbar\\omega$.",
              "In de klassieke limiet: vervang $n$ door $J/\\hbar$ (met $J = n\\hbar$ vast) en stuur $\\hbar \\to 0$."
            ],
            solution: [
              "Het verschil is de nulpuntsenergie $\\frac{1}{2}\\hbar\\omega$, die het Bohr-model niet voorspelt.",
              "In de klassieke limiet houden we $J = n\\hbar$ vast en sturen $\\hbar \\to 0$ (dus $n \\to \\infty$).",
              "$E = J\\omega + \\frac{1}{2}\\hbar\\omega \\to J\\omega$ als $\\hbar \\to 0$.",
              "De nulpuntsenergie verdwijnt en het Bohr-resultaat wordt exact."
            ],
          },
        ],
      },
      {
        label: "Opgave 3",
        title: "Het dubbelspletexperiment: vergelijking van klassiek en quantum",
        intro: "We vergelijken systematisch het gedrag van kogeltjes, golven en elektronen bij een dubbele spleet.",
        steps: [
          {
            question: "Bij het dubbelspletexperiment met watergolven ontstaat een interferentiepatroon. Leg uit hoe dit patroon ontstaat aan de hand van het verschil in afgelegde weg vanaf de twee spleten.",
            hints: [
              "Beschouw twee punten op het scherm: één waar de golven in fase aankomen, één waar ze in tegenfase aankomen.",
            ],
            solution: [
              "Elke spleet fungeert als een nieuwe bron van cirkelvormige golven (principe van Huygens).",
              "Op het scherm komen golven van beide spleten aan met een wegverschil $\\Delta = d\\sin\\theta$.",
              "Constructieve interferentie (maximum): $\\Delta = n\\lambda$ ($n = 0, \\pm 1, \\pm 2, \\ldots$).",
              "Destructieve interferentie (minimum): $\\Delta = (n + \\frac{1}{2})\\lambda$.",
              "Het resultaat is een patroon van afwisselend lichte en donkere banden."
            ],
          },
          {
            question: "Bij kogeltjes zien we GEEN interferentie. Leg uit waarom, en beschrijf wat je wél ziet op het scherm als beide spleten open staan.",
            hints: [
              "Denk aan het verschil tussen amplitudes optellen (golven) en kansen optellen (deeltjes)."
            ],
            solution: [
              "Kogeltjes gaan altijd door de ene óf de andere spleet. De verdeling bij twee open spleten is de som van de twee afzonderlijke verdelingen: $P_{12} = P_1 + P_2$.",
              "Je ziet twee overlappende pieken op het scherm, zonder interferentie-effecten.",
              "Dit komt omdat er geen fase-relatie is tussen de twee 'paden' — er zijn geen kruistermen."
            ],
          },
          {
            question: "Nu het experiment met elektronen. Beschrijf wat er te zien is als we de elektronenbundel langzaam opbouwen, van de eerste aankomst op het scherm tot een groot aantal elektronen.",
            hints: [
              "Elk individueel elektron verschijnt als een punt. Kijk naar het patroon dat geleidelijk ontstaat."
            ],
            solution: [
              "De eerste elektronen verschijnen op willekeurige posities als individuele punten (deeltjesgedrag bij detectie).",
              "Na tientallen elektronen is er nog geen duidelijk patroon zichtbaar.",
              "Na duizenden elektronen begint een interferentiepatroon zichtbaar te worden.",
              "Na miljoenen elektronen is het patroon identiek aan dat van watergolven.",
              "Conclusie: elk elektron arriveert als een deeltje, maar de kansverdeling volgt een golfpatroon."
            ],
          },
          {
            question: "Wat gebeurt er als we een detector plaatsen bij de spleten om te bepalen door welke spleet elk elektron gaat? En wat zegt dit over de aard van de superpositie?",
            hints: [
              "Vergelijk het resultaat met en zonder detector. Denk na over wat de meting doet met de golffunctie."
            ],
            solution: [
              "Met een detector verdwijnt het interferentiepatroon. We zien dan het klassieke deeltjespatroon $P_{12} = P_1 + P_2$.",
              "De meting forceert het elektron in één van de twee paden. De superpositie $\\Psi = \\Psi_1 + \\Psi_2$ wordt vernietigd.",
              "Dit is NIET een kwestie van onhandigheid: elke meting die 'welke spleet'-informatie geeft, vernietigt de interferentie. Dit is fundamenteel, niet technisch.",
              "Het onderscheidt de quantumsuperpositie van klassieke onwetendheid: het elektron 'kiest' pas bij de meting."
            ],
          },
        ],
      },
      {
        label: "Opgave 4",
        title: "Correspondentieprincipe: quantum benadert klassiek",
        intro: "We tonen aan dat voor grote $n$ de fotonfrequentie bij een overgang $n+1 \\to n$ overeenkomt met de klassieke omloopfrequentie.",
        steps: [
          {
            question: "Bereken het energieverschil $E_{n+1} - E_n$ en toon aan dat dit voor grote $n$ benaderd wordt door $2E_0/n^3$. Gebruik $(1 + \\varepsilon)^{-2} \\approx 1 - 2\\varepsilon$ voor kleine $\\varepsilon$.",
            hints: [
              "$E_{n+1} = -E_0/(n+1)^2 = -E_0/n^2 \\cdot 1/(1 + 1/n)^2$. Pas de benadering toe met $\\varepsilon = 1/n$.",
            ],
            solution: [
              "$E_{n+1} - E_n = -\\frac{E_0}{(n+1)^2} + \\frac{E_0}{n^2} = E_0\\left(\\frac{1}{n^2} - \\frac{1}{(n+1)^2}\\right)$",
              "$= \\frac{E_0}{n^2}\\left(1 - \\frac{1}{(1+1/n)^2}\\right) \\approx \\frac{E_0}{n^2}\\left(1 - (1 - 2/n)\\right) = \\frac{2E_0}{n^3}$"
            ],
          },
          {
            question: "De fotonfrequentie bij de overgang $n+1 \\to n$ is $f = (E_{n+1} - E_n)/h$. De klassieke omloopfrequentie is $f_{\\text{klass}} = \\frac{1}{2\\pi}\\sqrt{\\alpha/(m_e r_n^3)}$. Toon aan dat deze gelijk zijn voor grote $n$.",
            hints: [
              "Gebruik $r_n = n^2\\hbar^2/(m_e\\alpha)$ en $E_0 = m_e\\alpha^2/(2\\hbar^2)$.",
              "Bereken $f_{\\text{klass}}$ door $r_n$ te substitueren en vergelijk met $f = 2E_0/(n^3 h)$."
            ],
            solution: [
              "$f_{\\text{QM}} = \\frac{2E_0}{n^3 h} = \\frac{2}{n^3 h} \\cdot \\frac{m_e\\alpha^2}{2\\hbar^2} = \\frac{m_e\\alpha^2}{n^3 h \\hbar^2}$",
              "$f_{\\text{klass}} = \\frac{1}{2\\pi}\\sqrt{\\frac{\\alpha}{m_e r_n^3}} = \\frac{1}{2\\pi}\\sqrt{\\frac{\\alpha \\cdot m_e^3 \\alpha^3}{n^6 \\hbar^6}} = \\frac{m_e\\alpha^2}{2\\pi n^3\\hbar^3} = \\frac{m_e\\alpha^2}{n^3 h \\hbar^2}$",
              "Inderdaad: $f_{\\text{QM}} = f_{\\text{klass}}$ voor grote $n$. Het correspondentieprincipe is bevestigd!"
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        question: "Wat is de De Broglie golflengte van een deeltje met impuls $p$?",
        options: ["$\\lambda = hp$", "$\\lambda = h/p$", "$\\lambda = p/h$", "$\\lambda = h^2/p$"],
        correct: 1,
        explanation: "De Broglie postuleerde dat $\\lambda = h/p$, net als voor fotonen."
      },
      {
        question: "De ionisatie-energie van waterstof volgens het Bohr-model is:",
        options: ["$1.6$ eV", "$3.4$ eV", "$13.6$ eV", "$27.2$ eV"],
        correct: 2,
        explanation: "$E_0 = 13.6$ eV. Dit is de energie nodig om het elektron uit de grondtoestand ($n=1$) te verwijderen."
      },
      {
        question: "In het Bohr-model, wat is de relatie tussen kinetische energie $E_k$ en potentiële energie $V$ van het elektron?",
        options: [
          "$E_k = V$",
          "$E_k = -V$",
          "$E_k = -\\frac{1}{2}V$",
          "$E_k = 2V$"
        ],
        correct: 2,
        explanation: "Uit $m_e v^2 = \\alpha/r$ volgt $E_k = \\frac{1}{2}m_e v^2 = \\alpha/(2r) = -V/2$. Dit is het viriaaltheorema voor de Coulombkracht."
      },
      {
        question: "In het dubbelspletexperiment met elektronen: als we detecteren door welke spleet elk elektron gaat, wat gebeurt er met het interferentiepatroon?",
        options: [
          "Het patroon wordt sterker",
          "Het patroon verdwijnt",
          "Het patroon blijft hetzelfde",
          "Het patroon verschuift"
        ],
        correct: 1,
        explanation: "Door te meten door welke spleet het elektron gaat, vernietigen we de superpositie en verdwijnt het interferentiepatroon."
      },
      {
        question: "Hoe schaalt de Bohr-straal $r_n$ met het kwantumgetal $n$?",
        options: ["$r_n \\propto n$", "$r_n \\propto n^2$", "$r_n \\propto n^3$", "$r_n \\propto 1/n^2$"],
        correct: 1,
        explanation: "$r_n = n^2 r_B$, dus de straal groeit kwadratisch met $n$."
      },
      {
        question: "De energie van het elektron in het waterstofatoom voor baan $n=2$ is:",
        options: ["$-13.6$ eV", "$-6.8$ eV", "$-3.4$ eV", "$-1.5$ eV"],
        correct: 2,
        explanation: "$E_2 = -13.6/4 = -3.4$ eV."
      },
      {
        question: "Het foto-elektrisch effect bewijst dat:",
        options: [
          "Licht een golf is",
          "Licht uit deeltjes (fotonen) bestaat",
          "Elektronen golven zijn",
          "De lichtsnelheid eindig is"
        ],
        correct: 1,
        explanation: "Het foto-elektrisch effect kan alleen verklaard worden als licht uit discrete energiepakketjes (fotonen) bestaat met $E = hf$."
      },
      {
        question: "Een elektron versneld over een potentiaalverschil van 100 V. Wat is de orde van grootte van zijn De Broglie golflengte?",
        options: [
          "$\\sim 10^{-6}$ m (micrometer)",
          "$\\sim 10^{-10}$ m (ångström)",
          "$\\sim 10^{-15}$ m (femtometer)",
          "$\\sim 10^{-3}$ m (millimeter)"
        ],
        correct: 1,
        explanation: "$\\lambda = h/\\sqrt{2m_e E_k}$ met $E_k = 100$ eV $= 1.6 \\times 10^{-17}$ J. Dit geeft $\\lambda \\approx 1.2 \\times 10^{-10}$ m $\\approx 1.2$ Å."
      },
      {
        question: "In het dubbelspletexperiment: individuele elektronen worden één voor één afgeschoten. Het interferentiepatroon verschijnt pas na veel elektronen. Dit bewijst dat:",
        options: [
          "Elektronen onderling interfereren",
          "Elk elektron interfereert met zichzelf",
          "Het interferentiepatroon toevallig is",
          "De detector foutief werkt"
        ],
        correct: 1,
        explanation: "Aangezien er nooit twee elektronen tegelijk onderweg zijn, kan de interferentie niet tussen elektronen plaatsvinden. Elk elektron interfereert met zichzelf — het gaat 'door beide spleten tegelijk'."
      },
      {
        question: "Het correspondentieprincipe zegt dat voor grote $n$:",
        options: [
          "De energieniveaus continu worden",
          "De fotonfrequentie overeenkomt met de klassieke omloopfrequentie",
          "Het onzekerheidsprincipe niet meer geldt",
          "De golffunctie kan worden verwaarloosd"
        ],
        correct: 1,
        explanation: "Voor grote $n$ naderen de quantumresultaten de klassieke voorspellingen. Specifiek: de fotonfrequentie bij $n+1 \\to n$ benadert de klassieke omloopfrequentie."
      },
      {
        question: "De golflengte van de rode Balmer-lijn ($n=3 \\to n=2$) van waterstof is:",
        options: ["$122$ nm", "$656$ nm", "$434$ nm", "$1870$ nm"],
        correct: 1,
        explanation: "$1/\\lambda = R_H(1/4 - 1/9) = R_H \\cdot 5/36$. Met $R_H = 1.097 \\times 10^7$ m$^{-1}$ geeft dit $\\lambda = 656$ nm (rood licht)."
      },
      {
        question: "In het Bohr-model, hoe schaalt de snelheid $v_n$ van het elektron met $n$?",
        options: ["$v_n \\propto n$", "$v_n \\propto 1/n$", "$v_n \\propto n^2$", "$v_n \\propto 1/n^2$"],
        correct: 1,
        explanation: "Uit $m_e v r = n\\hbar$ en $r_n \\propto n^2$ volgt $v_n = n\\hbar/(m_e r_n) \\propto n/n^2 = 1/n$."
      },
    ],
  },
  {
    id: 2,
    title: "De Golffunctie",
    subtitle: "De Schrödingervergelijking, waarschijnlijkheidsinterpretatie",
    formulas: [
      { name: "Schrödingervergelijking", latex: "i\\hbar \\frac{\\partial}{\\partial t} \\Psi(x,t) = -\\frac{\\hbar^2}{2m} \\frac{\\partial^2}{\\partial x^2} \\Psi(x,t) + V(x)\\Psi(x,t)" },
      { name: "Tijdsonafhankelijke SV", latex: "-\\frac{\\hbar^2}{2m} \\frac{d^2\\psi}{dx^2} + V(x)\\psi(x) = E\\psi(x)" },
      { name: "Waarschijnlijkheid", latex: "P_{a,b}(t) = \\int_a^b |\\Psi(x,t)|^2 \\, dx" },
    ],
    concepts: [
      {
        title: "De golffunctie $\\Psi(x,t)$",
        content: "De toestand van een quantumdeeltje wordt volledig beschreven door de golffunctie $\\Psi(x,t)$. Het is een complexwaardige functie van positie en tijd. De fysische informatie zit in $|\\Psi|^2$, de kansdichtheid."
      },
      {
        title: "Waarschijnlijkheidsinterpretatie (Born)",
        content: "$|\\Psi(x,t)|^2 dx$ is de kans om het deeltje aan te treffen in het interval $[x, x+dx]$ op tijdstip $t$. Dit is de Born-interpretatie van de golffunctie."
      },
      {
        title: "De Schrödingervergelijking",
        content: "De tijdsafhankelijke Schrödingervergelijking beschrijft hoe de golffunctie evolueert in de tijd. Het is het quantummechanische equivalent van $F = ma$."
      },
    ],
    quiz: [
      {
        question: "Wat beschrijft $|\\Psi(x,t)|^2$?",
        options: [
          "De energie van het deeltje",
          "De snelheid van het deeltje",
          "De kansdichtheid om het deeltje bij positie $x$ te vinden",
          "De impuls van het deeltje"
        ],
        correct: 2,
        explanation: "Volgens Born's interpretatie is $|\\Psi(x,t)|^2$ de kansdichtheid."
      },
      {
        question: "De Schrödingervergelijking is:",
        options: [
          "Tweede orde in tijd, eerste orde in positie",
          "Eerste orde in tijd, tweede orde in positie",
          "Tweede orde in tijd en positie",
          "Eerste orde in tijd en positie"
        ],
        correct: 1,
        explanation: "De SV bevat $\\partial/\\partial t$ (eerste orde in tijd) en $\\partial^2/\\partial x^2$ (tweede orde in positie)."
      },
      {
        question: "De golffunctie $\\Psi(x,t)$ is in het algemeen:",
        options: ["Reëelwaardig", "Complexwaardig", "Altijd positief", "Altijd genormeerd op 1 in elk punt"],
        correct: 1,
        explanation: "De golffunctie is complexwaardig. Alleen $|\\Psi|^2$ heeft een directe fysische betekenis."
      },
      {
        question: "Welke vergelijking beschrijft de stationaire toestanden?",
        options: [
          "$i\\hbar \\frac{\\partial \\Psi}{\\partial t} = \\hat{H}\\Psi$",
          "$\\hat{H}\\psi = E\\psi$",
          "$\\frac{\\partial |\\Psi|^2}{\\partial t} = 0$",
          "$\\Psi(x,t) = \\psi(x)e^{-iEt/\\hbar}$"
        ],
        correct: 1,
        explanation: "De tijdsonafhankelijke Schrödingervergelijking $\\hat{H}\\psi = E\\psi$ beschrijft de stationaire toestanden."
      },
    ],
  },
  {
    id: 3,
    title: "Waarschijnlijkheid",
    subtitle: "Normering, verwachtingswaarden, standaardafwijking",
    formulas: [
      { name: "Normeringsvoorwaarde", latex: "\\int_{-\\infty}^{\\infty} |\\Psi(x,t)|^2 \\, dx = 1" },
      { name: "Verwachtingswaarde positie", latex: "\\langle x \\rangle = \\int_{-\\infty}^{\\infty} x |\\Psi(x,t)|^2 \\, dx" },
      { name: "Verwachtingswaarde van $f(x)$", latex: "\\langle f(x) \\rangle = \\int_{-\\infty}^{\\infty} f(x) |\\Psi(x,t)|^2 \\, dx" },
      { name: "Standaardafwijking", latex: "\\sigma_x = \\sqrt{\\langle x^2 \\rangle - \\langle x \\rangle^2}" },
    ],
    concepts: [
      {
        title: "Normering",
        content: "De totale kans om het deeltje ergens te vinden moet 1 zijn: $\\int |\\Psi|^2 dx = 1$. Als $\\Psi$ op $t=0$ genormeerd is, blijft het genormeerd voor alle $t$ (bewijs via de Schrödingervergelijking)."
      },
      {
        title: "Verwachtingswaarde",
        content: "De verwachtingswaarde $\\langle x \\rangle$ is het gemiddelde van vele metingen aan identiek geprepareerde systemen. Het is NIET het gemiddelde van herhaalde metingen aan hetzelfde deeltje."
      },
      {
        title: "Standaardafwijking en spreiding",
        content: "De standaardafwijking $\\sigma_x$ kwantificeert de spreiding in meetresultaten. Een kleine $\\sigma_x$ betekent dat het deeltje goed gelokaliseerd is; een grote $\\sigma_x$ betekent dat het deeltje uitgespreid is."
      },
    ],
    quiz: [
      {
        question: "Als $\\Psi$ genormeerd is op $t=0$, is het dan ook genormeerd op $t>0$?",
        options: [
          "Ja, dit volgt uit de Schrödingervergelijking",
          "Nee, je moet steeds opnieuw normeren",
          "Alleen als $V(x) = 0$",
          "Alleen voor gebonden toestanden"
        ],
        correct: 0,
        explanation: "De Schrödingervergelijking garandeert behoud van normering: $\\frac{d}{dt}\\int |\\Psi|^2 dx = 0$."
      },
      {
        question: "De verwachtingswaarde $\\langle x \\rangle$ vertegenwoordigt:",
        options: [
          "De meest waarschijnlijke positie",
          "Het gemiddelde van metingen aan een ensemble van identieke systemen",
          "De positie waar het deeltje zich bevindt",
          "De mediaan van de kansverdeling"
        ],
        correct: 1,
        explanation: "$\\langle x \\rangle$ is het ensemble-gemiddelde, niet de meest waarschijnlijke positie of een eigenschap van één deeltje."
      },
      {
        question: "De standaardafwijking $\\sigma_x$ is nul wanneer:",
        options: [
          "Het deeltje in rust is",
          "De golffunctie een Dirac delta-functie is",
          "Het deeltje een vrij deeltje is",
          "Dit kan nooit (Heisenberg)"
        ],
        correct: 1,
        explanation: "$\\sigma_x = 0$ betekent dat het deeltje exact gelokaliseerd is, wat overeenkomt met $|\\Psi|^2 = \\delta(x - x_0)$."
      },
    ],
  },
  {
    id: 4,
    title: "Operatoren en Verwachtingswaarden",
    subtitle: "Impulsoperator, commutatoren, onzekerheidsprincipe",
    formulas: [
      { name: "Impulsoperator", latex: "\\hat{p} = -i\\hbar \\frac{\\partial}{\\partial x}" },
      { name: "Verwachtingswaarde impuls", latex: "\\langle p \\rangle = -i\\hbar \\int \\Psi^* \\frac{\\partial \\Psi}{\\partial x} dx" },
      { name: "Hamiltoniaan", latex: "\\hat{H} = \\frac{\\hat{p}^2}{2m} + V(x) = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2}{\\partial x^2} + V(x)" },
      { name: "Commutator", latex: "[\\hat{x}, \\hat{p}] = i\\hbar" },
      { name: "Onzekerheidsprincipe", latex: "\\sigma_x \\sigma_p \\geq \\frac{\\hbar}{2}" },
    ],
    concepts: [
      {
        title: "Operatoren in de quantummechanica",
        content: "Elke observabele correspondeert met een operator. Positie wordt gerepresenteerd door $\\hat{x} = x$ (vermenigvuldiging), en impuls door $\\hat{p} = -i\\hbar \\frac{\\partial}{\\partial x}$."
      },
      {
        title: "De commutator",
        content: "De commutator $[\\hat{A}, \\hat{B}] = \\hat{A}\\hat{B} - \\hat{B}\\hat{A}$ meet hoe twee operatoren van volgorde verwisselen. Als $[\\hat{A}, \\hat{B}] \\neq 0$, kunnen $A$ en $B$ niet simultaan scherp bepaald zijn."
      },
      {
        title: "Heisenbergs onzekerheidsprincipe",
        content: "Het is fundamenteel onmogelijk om positie en impuls tegelijkertijd exact te kennen: $\\sigma_x \\sigma_p \\geq \\hbar/2$. Dit is geen meetfout, maar een fundamentele eigenschap van de natuur."
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
        explanation: "$\\sigma_x \\sigma_p \\geq \\hbar/2$ is een fundamenteel principe, geen meetbeperking."
      },
      {
        question: "Twee observabelen $A$ en $B$ kunnen simultaan scherp bepaald zijn als:",
        options: [
          "Ze dezelfde eenheden hebben",
          "Hun commutatoren nul is: $[\\hat{A}, \\hat{B}] = 0$",
          "Ze allebei Hermitisch zijn",
          "De golffunctie reëelwaardig is"
        ],
        correct: 1,
        explanation: "Commuterende observabelen delen eigentoestanden en kunnen tegelijk scherp bepaald zijn."
      },
    ],
  },
  {
    id: 5,
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
  },
  {
    id: 6,
    title: "De Oneindig Diepe Potentiaalput",
    subtitle: "Deeltje in een doos, energieniveaus, golffuncties",
    formulas: [
      { name: "Potentiaal", latex: "V(x) = \\begin{cases} 0 & 0 < x < a \\\\ \\infty & \\text{anders} \\end{cases}" },
      { name: "Golffuncties", latex: "\\psi_n(x) = \\sqrt{\\frac{2}{a}} \\sin\\left(\\frac{n\\pi x}{a}\\right)" },
      { name: "Energieniveaus", latex: "E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2ma^2}, \\quad n = 1, 2, 3, \\ldots" },
      { name: "Nulpuntsenergie", latex: "E_1 = \\frac{\\pi^2 \\hbar^2}{2ma^2} > 0" },
    ],
    concepts: [
      {
        title: "Randvoorwaarden",
        content: "De golffunctie moet continu zijn en moet nul zijn bij de wanden ($\\psi(0) = \\psi(a) = 0$). Dit beperkt de oplossingen tot staande golven en leidt tot gekwantiseerde energieniveaus."
      },
      {
        title: "Energiekwantisatie",
        content: "$E_n \\propto n^2$: de energieniveaus groeien kwadratisch. De grondtoestand ($n=1$) heeft een niet-nul energie, de nulpuntsenergie $E_1$. Dit is een direct gevolg van het onzekerheidsprincipe."
      },
      {
        title: "Orthogonaliteit",
        content: "De golffuncties vormen een orthonormale set: $\\int_0^a \\psi_m^*(x) \\psi_n(x) dx = \\delta_{mn}$. Elke functie op $[0,a]$ kan als lineaire combinatie van deze eigenfuncties geschreven worden (compleetheid)."
      },
    ],
    quiz: [
      {
        question: "De energieniveaus van de oneindig diepe put zijn evenredig met:",
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
        question: "De laagste energie in de oneindig diepe put ($n=1$) is:",
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
    ],
  },
  {
    id: 7,
    title: "De Harmonische Oscillator",
    subtitle: "Ladderoperatoren, energieniveaus, nulpuntsenergie",
    formulas: [
      { name: "Potentiaal", latex: "V(x) = \\frac{1}{2}m\\omega^2 x^2" },
      { name: "Energieniveaus", latex: "E_n = \\left(n + \\frac{1}{2}\\right)\\hbar\\omega, \\quad n = 0, 1, 2, \\ldots" },
      { name: "Ladderoperatoren", latex: "\\hat{a}_{\\pm} = \\frac{1}{\\sqrt{2\\hbar m\\omega}}(\\mp i\\hat{p} + m\\omega\\hat{x})" },
      { name: "Commutator", latex: "[\\hat{a}_-, \\hat{a}_+] = 1" },
      { name: "Hamiltoniaan", latex: "\\hat{H} = \\hbar\\omega\\left(\\hat{a}_+\\hat{a}_- + \\frac{1}{2}\\right)" },
    ],
    concepts: [
      {
        title: "Equidistante energieniveaus",
        content: "De energieniveaus van de harmonische oscillator zijn equidistant: het verschil is altijd $\\hbar\\omega$. De nulpuntsenergie is $E_0 = \\frac{1}{2}\\hbar\\omega$."
      },
      {
        title: "Ladder (ophef- en verlagings-) operatoren",
        content: "$\\hat{a}_+$ (ophefoperator) brengt het systeem naar een hogere eigentoestand: $\\hat{a}_+|n\\rangle \\propto |n+1\\rangle$. $\\hat{a}_-$ (verlagingsoperator) verlaagt: $\\hat{a}_-|n\\rangle \\propto |n-1\\rangle$. De grondtoestand $|0\\rangle$ wordt gedefinieerd door $\\hat{a}_-|0\\rangle = 0$."
      },
      {
        title: "Grondtoestand",
        content: "De grondtoestand $\\psi_0(x) = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4} e^{-m\\omega x^2/2\\hbar}$ is een Gaussische functie. Alle hogere toestanden worden verkregen door herhaalde toepassing van $\\hat{a}_+$."
      },
    ],
    quiz: [
      {
        question: "Het energiespectrum van de harmonische oscillator is:",
        options: [
          "Continu",
          "Evenredig met $n^2$",
          "Equidistant met tussenafstand $\\hbar\\omega$",
          "Evenredig met $1/n^2$"
        ],
        correct: 2,
        explanation: "$E_n = (n + 1/2)\\hbar\\omega$. De afstand tussen opeenvolgende niveaus is altijd $\\hbar\\omega$."
      },
      {
        question: "Wat is het effect van de ophefoperator $\\hat{a}_+$ op toestand $|n\\rangle$?",
        options: [
          "$\\hat{a}_+|n\\rangle = 0$",
          "$\\hat{a}_+|n\\rangle \\propto |n+1\\rangle$",
          "$\\hat{a}_+|n\\rangle \\propto |n-1\\rangle$",
          "$\\hat{a}_+|n\\rangle = E_n|n\\rangle$"
        ],
        correct: 1,
        explanation: "$\\hat{a}_+$ verhoogt het kwantumgetal: $\\hat{a}_+|n\\rangle = \\sqrt{n+1}|n+1\\rangle$."
      },
      {
        question: "Wat is de nulpuntsenergie van de harmonische oscillator?",
        options: ["$0$", "$\\hbar\\omega$", "$\\frac{1}{2}\\hbar\\omega$", "$\\frac{3}{2}\\hbar\\omega$"],
        correct: 2,
        explanation: "$E_0 = \\frac{1}{2}\\hbar\\omega$. Dit is de minimale energie; het deeltje is nooit volledig in rust."
      },
      {
        question: "De grondtoestand golffunctie $\\psi_0(x)$ van de harmonische oscillator is:",
        options: [
          "Een sinusfunctie",
          "Een Gaussische functie",
          "Een exponentieel afnemende functie",
          "Een constante"
        ],
        correct: 1,
        explanation: "$\\psi_0 \\propto e^{-m\\omega x^2/(2\\hbar)}$, een Gaussische (klokvormige) functie."
      },
    ],
  },
  {
    id: 8,
    title: "Het Vrije Deeltje",
    subtitle: "Golfpakketten, dispersie, groepssnelheid",
    formulas: [
      { name: "Golffunctie (vlakke golf)", latex: "\\Psi_k(x,t) = A e^{i(kx - \\omega t)}" },
      { name: "Dispersierelatie", latex: "\\omega = \\frac{\\hbar k^2}{2m}" },
      { name: "Golfpakket", latex: "\\Psi(x,t) = \\frac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^{\\infty} \\phi(k) \\, e^{i(kx - \\omega(k)t)} \\, dk" },
      { name: "Fasesnelheid", latex: "v_{\\text{fase}} = \\frac{\\omega}{k} = \\frac{\\hbar k}{2m}" },
      { name: "Groepssnelheid", latex: "v_{\\text{groep}} = \\frac{d\\omega}{dk} = \\frac{\\hbar k}{m} = \\frac{p}{m}" },
    ],
    concepts: [
      {
        title: "Niet-normeerbaarheid van vlakke golven",
        content: "Een vlakke golf $e^{ikx}$ is niet normeerbaar en kan dus niet de golffunctie van een echt deeltje zijn. Een fysisch deeltje wordt beschreven door een golfpakket: een superpositie van vlakke golven."
      },
      {
        title: "Groepssnelheid vs. fasesnelheid",
        content: "De fasesnelheid $v_f = \\omega/k$ is de snelheid van de golfkammen. De groepssnelheid $v_g = d\\omega/dk$ is de snelheid van de envelop van het golfpakket. Het deeltje beweegt met de groepssnelheid: $v_g = p/m$."
      },
      {
        title: "Dispersie",
        content: "Omdat $\\omega$ niet lineair afhangt van $k$ ($\\omega \\propto k^2$), is de dispersierelatie niet-lineair. Het golfpakket spreidt zich uit in de loop van de tijd."
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
        explanation: "De vlakke golf is uniform over de hele ruimte en kan niet genormeerd worden."
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
        explanation: "Door de niet-lineaire dispersierelatie $\\omega \\propto k^2$ lopen verschillende golfcomponenten uit fase, waardoor het pakket spreidt."
      },
    ],
  },
  {
    id: 9,
    title: "Eindige Potentiaalbarrières",
    subtitle: "Tunneling, reflectie- en transmissiecoëfficiënten",
    formulas: [
      { name: "Transmissiecoëfficiënt", latex: "T = \\frac{|F|^2}{|A|^2}" },
      { name: "Reflectiecoëfficiënt", latex: "R = \\frac{|B|^2}{|A|^2}" },
      { name: "Behoud", latex: "R + T = 1" },
      { name: "Golfgetal (klassiek toegankelijk)", latex: "k = \\frac{\\sqrt{2m(E-V)}}{\\hbar}" },
      { name: "Vervalconstante (klassiek verboden)", latex: "\\kappa = \\frac{\\sqrt{2m(V-E)}}{\\hbar}" },
    ],
    concepts: [
      {
        title: "Quantumtunneling",
        content: "In de klassieke mechanica kan een deeltje met $E < V_0$ een barrière niet passeren. In de quantummechanica is er een niet-nul kans dat het deeltje 'tunnelt' door de barrière. De golffunctie dringt exponentieel door in het klassiek verboden gebied."
      },
      {
        title: "Randvoorwaarden",
        content: "Bij een potentiaalstap of -barrière moeten de golffunctie $\\psi$ en haar afgeleide $d\\psi/dx$ continu zijn op de grenzen. Dit leidt tot vergelijkingen voor de reflectie- en transmissiecoëfficiënten."
      },
      {
        title: "Exponentieel verval",
        content: "In het klassiek verboden gebied ($E < V$) is de golffunctie $\\psi \\propto e^{-\\kappa x}$. De tunnelkans neemt exponentieel af met de breedte en hoogte van de barrière."
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
        explanation: "Tunneling is het quantummechanische verschijnsel dat een deeltje een klassiek verboden barrière kan passeren."
      },
      {
        question: "Als de breedte van een potentiaalbarrière verdubbelt, dan neemt de tunnelkans:",
        options: [
          "Lineair af",
          "Kwadratisch af",
          "Exponentieel af",
          "Niet af"
        ],
        correct: 2,
        explanation: "$T \\propto e^{-2\\kappa a}$, dus verdubbeling van $a$ leidt tot een exponentiële afname."
      },
      {
        question: "Welke voorwaarde geldt altijd bij een potentiaalstap?",
        options: [
          "$R = T$",
          "$R + T = 1$",
          "$R = 1$",
          "$T = 1$"
        ],
        correct: 1,
        explanation: "Behoud van waarschijnlijkheid eist $R + T = 1$: het deeltje wordt gereflecteerd of getransmitteerd."
      },
      {
        question: "In het klassiek verboden gebied ($E < V$) is de golffunctie:",
        options: [
          "Oscillerend (sinus/cosinus)",
          "Exponentieel afnemend",
          "Constant",
          "Nul"
        ],
        correct: 1,
        explanation: "De golffunctie is $\\propto e^{-\\kappa x}$ (exponentieel afnemend) in het klassiek verboden gebied."
      },
    ],
  },
  {
    id: 10,
    title: "Quantumtoestanden en hun Betekenis",
    subtitle: "Qubits, verstrengeling, Bell toestanden, teleportatie, neutrino-oscillaties",
    formulas: [
      { name: "Qubit", latex: "|\\psi\\rangle = \\alpha|1\\rangle + \\beta|0\\rangle, \\quad |\\alpha|^2 + |\\beta|^2 = 1" },
      { name: "Tensorproduct", latex: "|\\psi_{AB}\\rangle = |\\psi_A\\rangle \\otimes |\\psi_B\\rangle" },
      { name: "Bell toestanden", latex: "\\Phi^{(\\pm)} = \\frac{1}{\\sqrt{2}}(|11\\rangle \\pm |00\\rangle)" },
      { name: "Pauli-matrices", latex: "\\hat{\\sigma}_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}, \\; \\hat{\\sigma}_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}, \\; \\hat{\\sigma}_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}" },
      { name: "Neutrino-oscillaties", latex: "P(\\nu_\\mu \\to \\nu_e) = \\sin^2(2\\theta)\\sin^2\\!\\left(\\frac{(E_1-E_2)t}{2\\hbar}\\right)" },
    ],
    concepts: [
      {
        title: "Qubits",
        content: "Een qubit is een twee-toestandssysteem met toestand $|\\psi\\rangle = \\alpha|1\\rangle + \\beta|0\\rangle$. Voorbeelden zijn de spin van een elektron (up/down) of de polarisatie van een foton."
      },
      {
        title: "Verstrengeling (Entanglement)",
        content: "Twee qubits zijn verstrengeld als hun gezamenlijke toestand NIET als een tensorproduct geschreven kan worden. Een meting aan één qubit beïnvloedt instantaan de toestand van de andere, ongeacht de afstand. Dit schendt echter niet de speciale relativiteitstheorie."
      },
      {
        title: "Quantumteleportatie",
        content: "Met behulp van een verstrengeld paar en twee bits klassieke communicatie kan de toestand van een qubit van Alice naar Charlie worden geteleporteerd. De originele qubit wordt vernietigd en exact gereconstrueerd."
      },
      {
        title: "Neutrino-oscillaties",
        content: "Neutrino's ($\\nu_e, \\nu_\\mu, \\nu_\\tau$) zijn geen eigentoestanden van de Hamiltoniaan. Een geproduceerde $\\nu_e$ kan na verloop van tijd als $\\nu_\\mu$ worden waargenomen. Dit bewijst dat neutrino's massa hebben."
      },
    ],
    quiz: [
      {
        question: "Een toestand $|\\psi\\rangle = \\frac{1}{\\sqrt{2}}(|11\\rangle + |00\\rangle)$ is:",
        options: [
          "Scheidbaar (separabel)",
          "Verstrengeld",
          "Niet genormeerd",
          "Een eigentoestand van $\\hat{\\sigma}_z$"
        ],
        correct: 1,
        explanation: "Deze toestand kan niet geschreven worden als $|a\\rangle \\otimes |b\\rangle$, dus is verstrengeld."
      },
      {
        question: "Bij quantumteleportatie, hoeveel bits klassieke informatie moet Alice naar Charlie sturen?",
        options: ["$0$", "$1$", "$2$", "$3$"],
        correct: 2,
        explanation: "Alice stuurt het resultaat van haar Bell-meting: 4 mogelijke uitkomsten = 2 bits."
      },
      {
        question: "Neutrino-oscillaties bewijzen dat:",
        options: [
          "Neutrino's sneller dan het licht reizen",
          "Neutrino's massa hebben",
          "Er meer dan drie soorten neutrino's bestaan",
          "De speciale relativiteitstheorie onjuist is"
        ],
        correct: 1,
        explanation: "Neutrino-oscillaties zijn alleen mogelijk als neutrino's massa hebben, zodat de energie-eigenwaarden verschillen."
      },
      {
        question: "De EPR-paradox en Bell-experimenten tonen aan dat:",
        options: [
          "De quantummechanica incompleet is",
          "Verborgen variabelen de quantummechanica verklaren",
          "Lokaal-realistische theorieën niet kloppen",
          "Informatie sneller dan het licht kan reizen"
        ],
        correct: 2,
        explanation: "Bell-experimenten hebben de Bell-ongelijkheden geschonden, wat lokale verborgen-variabele theorieën uitsluit."
      },
      {
        question: "De eigenwaarden van de Pauli-matrix $\\hat{\\sigma}_z$ zijn:",
        options: ["$0$ en $1$", "$+1$ en $-1$", "$+i$ en $-i$", "$+\\hbar/2$ en $-\\hbar/2$"],
        correct: 1,
        explanation: "$\\hat{\\sigma}_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$ heeft eigenwaarden $+1$ en $-1$."
      },
    ],
  },
];

export default chapters;
