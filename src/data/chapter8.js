const chapter8 = {
    id: 8,
    title: "De Harmonische Oscillator",
    subtitle: "Ladderoperatoren, energieniveaus, nulpuntsenergie (Griffiths §2.3)",
    formulas: [
      { name: "Potentiaal", latex: "V(x) = \\frac{1}{2}m\\omega^2 x^2" },
      { name: "TISV", latex: "-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} + \\frac{1}{2}m\\omega^2 x^2\\psi = E\\psi" },
      { name: "Ladderoperatoren", latex: "\\hat{a}_{\\pm} = \\frac{1}{\\sqrt{2\\hbar m\\omega}}(\\mp i\\hat{p} + m\\omega\\hat{x})" },
      { name: "Commutator ladderoperatoren", latex: "[\\hat{a}_-, \\hat{a}_+] = 1" },
      { name: "Hamiltoniaan in ladderoperatoren", latex: "\\hat{H} = \\hbar\\omega\\left(\\hat{a}_+\\hat{a}_- + \\frac{1}{2}\\right)" },
      { name: "Energieniveaus", latex: "E_n = \\left(n + \\frac{1}{2}\\right)\\hbar\\omega, \\quad n = 0, 1, 2, \\ldots" },
      { name: "Werking ophefoperator", latex: "\\hat{a}_+|n\\rangle = \\sqrt{n+1}\\,|n+1\\rangle" },
      { name: "Werking verlagingsoperator", latex: "\\hat{a}_-|n\\rangle = \\sqrt{n}\\,|n-1\\rangle" },
      { name: "Grondtoestand definitie", latex: "\\hat{a}_-|0\\rangle = 0" },
      { name: "Grondtoestand golffunctie", latex: "\\psi_0(x) = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4} e^{-m\\omega x^2/(2\\hbar)}" },
      { name: "Hogere toestanden", latex: "\\psi_n(x) = \\frac{1}{\\sqrt{n!}}(\\hat{a}_+)^n\\,\\psi_0(x)" },
    ],
    concepts: [
      {
        title: "De harmonische oscillator: waarom zo belangrijk? (Griffiths §2.3)",
        content: "De quantumharmonische oscillator (QHO) is wellicht het belangrijkste modelsysteem in de hele fysica. Elk systeem in de buurt van een stabiel evenwicht gedraagt zich bij kleine uitwijkingen als een harmonische oscillator. Als $V(x)$ een minimum heeft bij $x_0$, dan geldt de Taylor-ontwikkeling:\n\n$$V(x) \\approx V(x_0) + \\underbrace{V'(x_0)}_{0}(x-x_0) + \\frac{1}{2}V''(x_0)(x-x_0)^2 + \\ldots$$\n\nDe eerste afgeleide is nul (minimum), dus bij kleine uitwijkingen is $V \\approx \\frac{1}{2}kx^2$ met $k = V''(x_0)$. De QHO beschrijft trillingen van moleculen, fononen in vaste stoffen, elektromagnetische velden (fotonen), en veel meer. Met $\\omega = \\sqrt{k/m}$ schrijven we de potentiaal als $V(x) = \\frac{1}{2}m\\omega^2x^2$."
      },
      {
        title: "De algebraïsche methode: ladderoperatoren",
        content: "Griffiths presenteert een elegante algebraïsche methode om de QHO op te lossen, zonder de differentiaalvergelijking direct op te lossen. We herschrijven de Hamiltoniaan $\\hat{H} = \\hat{p}^2/(2m) + \\frac{1}{2}m\\omega^2\\hat{x}^2$ als een product van twee factoren. Definieer de ladderoperatoren:\n\n$$\\hat{a}_\\pm = \\frac{1}{\\sqrt{2\\hbar m\\omega}}(\\mp i\\hat{p} + m\\omega\\hat{x})$$\n\n$\\hat{a}_-$ heet de verlagingsoperator (of annihilatie-operator), $\\hat{a}_+$ de ophefoperator (of creatie-operator). Dit zijn niet-Hermitische operatoren: $\\hat{a}_+^\\dagger = \\hat{a}_-$. Het cruciale punt: de Hamiltoniaan wordt er eenvoudig in."
      },
      {
        title: "De commutator $[\\hat{a}_-, \\hat{a}_+] = 1$",
        content: "Bereken het product $\\hat{a}_-\\hat{a}_+$:\n\n$$\\hat{a}_-\\hat{a}_+ = \\frac{1}{2\\hbar m\\omega}(i\\hat{p} + m\\omega\\hat{x})(-i\\hat{p} + m\\omega\\hat{x})$$\n$$= \\frac{1}{2\\hbar m\\omega}(\\hat{p}^2 + m^2\\omega^2\\hat{x}^2 - im\\omega[\\hat{x},\\hat{p}])$$\n$$= \\frac{1}{\\hbar\\omega}\\hat{H} + \\frac{1}{2}$$\n\nwaar we $[\\hat{x},\\hat{p}] = i\\hbar$ hebben gebruikt. Analoog: $\\hat{a}_+\\hat{a}_- = \\frac{1}{\\hbar\\omega}\\hat{H} - \\frac{1}{2}$. Het verschil geeft:\n\n$$[\\hat{a}_-, \\hat{a}_+] = \\hat{a}_-\\hat{a}_+ - \\hat{a}_+\\hat{a}_- = 1$$\n\nEn de Hamiltoniaan wordt: $\\hat{H} = \\hbar\\omega(\\hat{a}_+\\hat{a}_- + \\frac{1}{2})$."
      },
      {
        title: "De ladderoperatoren als 'ladder'",
        content: "Het sleutelresultaat: als $\\psi$ een eigentoestand is van $\\hat{H}$ met energie $E$, dan is $\\hat{a}_+\\psi$ een eigentoestand met energie $E + \\hbar\\omega$, en $\\hat{a}_-\\psi$ een eigentoestand met energie $E - \\hbar\\omega$.\n\nBewijs: $\\hat{H}(\\hat{a}_+\\psi) = \\hbar\\omega(\\hat{a}_+\\hat{a}_-\\hat{a}_+ + \\frac{1}{2}\\hat{a}_+)\\psi$. Gebruik $\\hat{a}_-\\hat{a}_+ = \\hat{a}_+\\hat{a}_- + 1$:\n$$= \\hbar\\omega\\hat{a}_+(\\hat{a}_+\\hat{a}_- + 1 + \\frac{1}{2})\\psi = \\hat{a}_+(\\hat{H} + \\hbar\\omega)\\psi = (E + \\hbar\\omega)(\\hat{a}_+\\psi)$$\n\nDus $\\hat{a}_+$ 'klimt' een trede op de energieladder ($+\\hbar\\omega$), en $\\hat{a}_-$ daalt een trede af ($-\\hbar\\omega$). Vandaar de naam ladderoperatoren."
      },
      {
        title: "De grondtoestand en het energiespectrum",
        content: "De ladder kan niet oneindig naar beneden gaan — de energie moet positief zijn (bewijs: $\\langle H\\rangle = \\langle p^2\\rangle/(2m) + \\frac{1}{2}m\\omega^2\\langle x^2\\rangle \\geq 0$). Er moet een laagste toestand $\\psi_0$ bestaan waarvoor:\n\n$$\\hat{a}_-\\psi_0 = 0$$\n\nDit is de grondtoestand. Uit $\\hat{H} = \\hbar\\omega(\\hat{a}_+\\hat{a}_- + \\frac{1}{2})$ volgt $E_0 = \\frac{1}{2}\\hbar\\omega$ (de nulpuntsenergie). Vanaf de grondtoestand klimmen we op met $\\hat{a}_+$:\n\n$$E_n = \\left(n + \\frac{1}{2}\\right)\\hbar\\omega, \\qquad n = 0, 1, 2, \\ldots$$\n\nDe energieniveaus zijn equidistant met tussenafstand $\\hbar\\omega$. Dit is een uniek kenmerk van de harmonische oscillator — voor andere potentialen zijn de niveaus niet equidistant."
      },
      {
        title: "De grondtoestand golffunctie",
        content: "De vergelijking $\\hat{a}_-\\psi_0 = 0$ geeft in positierepresentatie:\n\n$$\\frac{1}{\\sqrt{2\\hbar m\\omega}}\\left(\\hbar\\frac{d}{dx} + m\\omega x\\right)\\psi_0 = 0$$\n\nDit is een eerste-orde ODE: $\\frac{d\\psi_0}{dx} = -\\frac{m\\omega}{\\hbar}x\\,\\psi_0$. De oplossing is:\n\n$$\\psi_0(x) = A\\,e^{-m\\omega x^2/(2\\hbar)}$$\n\nNa normering: $\\psi_0(x) = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}e^{-m\\omega x^2/(2\\hbar)}$. Dit is een Gaussische functie, gecentreerd op $x = 0$, met breedte $\\sim \\sqrt{\\hbar/(m\\omega)}$. Merk op: de grondtoestand is een minimum-onzekerheidstoestand ($\\sigma_x\\sigma_p = \\hbar/2$), zoals we in hoofdstuk 5 hebben gezien."
      },
      {
        title: "Hogere toestanden opbouwen",
        content: "Alle hogere toestanden worden verkregen door herhaalde toepassing van $\\hat{a}_+$ op de grondtoestand:\n\n$$\\psi_n = \\frac{1}{\\sqrt{n!}}(\\hat{a}_+)^n\\psi_0$$\n\nDe factor $1/\\sqrt{n!}$ zorgt voor de juiste normering. De precieze werking is:\n$$\\hat{a}_+|n\\rangle = \\sqrt{n+1}\\,|n+1\\rangle, \\qquad \\hat{a}_-|n\\rangle = \\sqrt{n}\\,|n-1\\rangle$$\n\nDe eerste paar golffuncties in positierepresentatie zijn:\n- $\\psi_0 \\propto e^{-\\xi^2/2}$\n- $\\psi_1 \\propto 2\\xi\\,e^{-\\xi^2/2}$\n- $\\psi_2 \\propto (4\\xi^2 - 2)e^{-\\xi^2/2}$\n\nmet $\\xi = \\sqrt{m\\omega/\\hbar}\\,x$. De polynomen in $\\xi$ zijn de Hermite-polynomen $H_n(\\xi)$. Het patroon: $\\psi_n$ heeft $n$ knopen, even $n$ zijn symmetrisch ($\\psi_n(-x) = \\psi_n(x)$), oneven $n$ zijn antisymmetrisch."
      },
      {
        title: "Verwachtingswaarden met ladderoperatoren",
        content: "Ladderoperatoren maken het berekenen van verwachtingswaarden eenvoudig. Schrijf $\\hat{x}$ en $\\hat{p}$ in termen van $\\hat{a}_\\pm$:\n\n$$\\hat{x} = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat{a}_+ + \\hat{a}_-), \\qquad \\hat{p} = i\\sqrt{\\frac{\\hbar m\\omega}{2}}(\\hat{a}_+ - \\hat{a}_-)$$\n\nMet de orthonormaliteit $\\langle m|n\\rangle = \\int\\psi_m^*(x)\\,\\psi_n(x)\\,dx = \\delta_{mn}$ en de werking van $\\hat{a}_\\pm$ volgt direct:\n- $\\langle n|\\hat{x}|n\\rangle = 0$ (want $\\hat{a}_+|n\\rangle \\propto |n+1\\rangle$ is orthogonaal op $|n\\rangle$)\n- $\\langle n|\\hat{p}|n\\rangle = 0$ (idem)\n- $\\langle n|\\hat{x}^2|n\\rangle = \\frac{\\hbar}{2m\\omega}(2n+1)$\n- $\\langle n|\\hat{p}^2|n\\rangle = \\frac{\\hbar m\\omega}{2}(2n+1)$\n\nDit bevestigt: $\\langle T\\rangle = \\langle V\\rangle = E_n/2$ (viriaaltheorema voor de HO)."
      },
      {
        title: "De klassieke limiet",
        content: "Klassiek oscilleert een deeltje met amplitude $A$ heen en weer. De kansverdeling is het grootst bij de keerpunten (waar het deeltje langzaam beweegt) en het kleinst bij het evenwicht (waar het snel beweegt): $\\rho_{\\text{klass}} \\propto 1/\\sqrt{A^2 - x^2}$. De quantummechanische $|\\psi_n|^2$ ziet er heel anders uit voor kleine $n$, maar voor grote $n$ convergeert het gemiddelde naar de klassieke verdeling. Een ander opmerkelijk verschil: quantummechanisch heeft het deeltje een niet-nul kans om buiten de klassieke keerpunten terecht te komen ($|x| > A$). Dit heet 'tunneling' — het deeltje dringt door in het klassiek verboden gebied waar $E < V$."
      },
    ],
    exercises: [
      {
        label: "Opgave 1",
        title: "De Hamiltoniaan factoriseren",
        intro: "We herschrijven de Hamiltoniaan $\\hat{H} = \\frac{\\hat{p}^2}{2m} + \\frac{1}{2}m\\omega^2\\hat{x}^2$ in termen van ladderoperatoren.",
        steps: [
          {
            question: "Bereken het product $\\hat{a}_-\\hat{a}_+$ door de definities te substitueren. Gebruik $[\\hat{x}, \\hat{p}] = i\\hbar$.",
            hints: [
              "$\\hat{a}_- = \\frac{1}{\\sqrt{2\\hbar m\\omega}}(i\\hat{p} + m\\omega\\hat{x})$ en $\\hat{a}_+ = \\frac{1}{\\sqrt{2\\hbar m\\omega}}(-i\\hat{p} + m\\omega\\hat{x})$.",
              "Werk het product uit: $(i\\hat{p} + m\\omega\\hat{x})(-i\\hat{p} + m\\omega\\hat{x}) = \\hat{p}^2 + m^2\\omega^2\\hat{x}^2 + im\\omega(\\hat{x}\\hat{p} - \\hat{p}\\hat{x})$.",
              "Herken $\\hat{x}\\hat{p} - \\hat{p}\\hat{x} = [\\hat{x},\\hat{p}] = i\\hbar$."
            ],
            solution: [
              "$\\hat{a}_-\\hat{a}_+ = \\frac{1}{2\\hbar m\\omega}(\\hat{p}^2 + m^2\\omega^2\\hat{x}^2 + im\\omega \\cdot i\\hbar)$",
              "$= \\frac{1}{2\\hbar m\\omega}(\\hat{p}^2 + m^2\\omega^2\\hat{x}^2 - m\\omega\\hbar)$",
              "$= \\frac{1}{\\hbar\\omega}\\left(\\frac{\\hat{p}^2}{2m} + \\frac{1}{2}m\\omega^2\\hat{x}^2\\right) - \\frac{1}{2}$",
              "$= \\frac{\\hat{H}}{\\hbar\\omega} - \\frac{1}{2} + 1 = \\frac{\\hat{H}}{\\hbar\\omega} + \\frac{1}{2}$"
            ],
          },
          {
            question: "Bereken op analoge wijze $\\hat{a}_+\\hat{a}_-$ en leid de commutator $[\\hat{a}_-, \\hat{a}_+]$ af.",
            hints: [
              "Het enige verschil is het teken van de commutatieterm.",
              "$\\hat{a}_+\\hat{a}_- = \\frac{\\hat{H}}{\\hbar\\omega} - \\frac{1}{2}$."
            ],
            solution: [
              "$\\hat{a}_+\\hat{a}_- = \\frac{1}{2\\hbar m\\omega}(\\hat{p}^2 + m^2\\omega^2\\hat{x}^2 + m\\omega\\hbar) = \\frac{\\hat{H}}{\\hbar\\omega} - \\frac{1}{2}$",
              "$[\\hat{a}_-, \\hat{a}_+] = \\hat{a}_-\\hat{a}_+ - \\hat{a}_+\\hat{a}_- = \\left(\\frac{\\hat{H}}{\\hbar\\omega} + \\frac{1}{2}\\right) - \\left(\\frac{\\hat{H}}{\\hbar\\omega} - \\frac{1}{2}\\right) = 1$"
            ],
          },
          {
            question: "Schrijf $\\hat{H}$ in termen van $\\hat{a}_+\\hat{a}_-$.",
            hints: [
              "Los de uitdrukking $\\hat{a}_+\\hat{a}_- = \\hat{H}/(\\hbar\\omega) - 1/2$ op naar $\\hat{H}$."
            ],
            solution: [
              "$\\hat{H} = \\hbar\\omega\\left(\\hat{a}_+\\hat{a}_- + \\frac{1}{2}\\right)$",
              "De operator $\\hat{n} \\equiv \\hat{a}_+\\hat{a}_-$ heet de getaloperator (number operator).",
              "De eigenwaarden van $\\hat{n}$ zijn $n = 0, 1, 2, \\ldots$ en $E_n = \\hbar\\omega(n + 1/2)$."
            ],
          },
        ],
      },
      {
        label: "Opgave 2",
        title: "De grondtoestand vinden",
        intro: "We bepalen de grondtoestand golffunctie $\\psi_0(x)$ uit de voorwaarde $\\hat{a}_-\\psi_0 = 0$.",
        steps: [
          {
            question: "Schrijf $\\hat{a}_-\\psi_0 = 0$ uit in positierepresentatie (gebruik $\\hat{p} = -i\\hbar d/dx$). Welke differentiaalvergelijking voor $\\psi_0(x)$ vind je?",
            hints: [
              "$\\hat{a}_- = \\frac{1}{\\sqrt{2\\hbar m\\omega}}(\\hbar\\frac{d}{dx} + m\\omega x)$.",
              "Stel dit gelijk aan nul: $\\hbar\\frac{d\\psi_0}{dx} + m\\omega x\\,\\psi_0 = 0$."
            ],
            solution: [
              "$\\hat{a}_-\\psi_0 = \\frac{1}{\\sqrt{2\\hbar m\\omega}}\\left(\\hbar\\frac{d\\psi_0}{dx} + m\\omega x\\,\\psi_0\\right) = 0$",
              "$\\frac{d\\psi_0}{dx} = -\\frac{m\\omega}{\\hbar}x\\,\\psi_0$",
              "Dit is een eerste-orde ODE (separabel) — veel eenvoudiger dan de oorspronkelijke tweede-orde TISV!"
            ],
          },
          {
            question: "Los de differentiaalvergelijking $d\\psi_0/dx = -(m\\omega/\\hbar)x\\,\\psi_0$ op door scheiding van variabelen.",
            hints: [
              "$\\frac{d\\psi_0}{\\psi_0} = -\\frac{m\\omega}{\\hbar}x\\,dx$. Integreer beide kanten.",
              "$\\ln\\psi_0 = -\\frac{m\\omega}{2\\hbar}x^2 + C$."
            ],
            solution: [
              "$\\int\\frac{d\\psi_0}{\\psi_0} = -\\frac{m\\omega}{\\hbar}\\int x\\,dx$",
              "$\\ln\\psi_0 = -\\frac{m\\omega}{2\\hbar}x^2 + \\text{const}$",
              "$\\psi_0(x) = A\\,e^{-m\\omega x^2/(2\\hbar)}$",
              "Dit is een Gaussische functie!"
            ],
          },
          {
            question: "Normeer $\\psi_0$: bereken $A$ uit $\\int_{-\\infty}^{\\infty}|\\psi_0|^2\\,dx = 1$. Gebruik $\\int_{-\\infty}^{\\infty}e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$.",
            hints: [
              "$A^2\\int e^{-m\\omega x^2/\\hbar}\\,dx = A^2\\sqrt{\\pi\\hbar/(m\\omega)} = 1$."
            ],
            answer: ["(m*omega/(pi*hbar))^(1/4)"],
            solution: [
              "$A^2\\sqrt{\\frac{\\pi\\hbar}{m\\omega}} = 1 \\implies A^2 = \\sqrt{\\frac{m\\omega}{\\pi\\hbar}}$",
              "$A = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}$",
              "$\\psi_0(x) = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}e^{-m\\omega x^2/(2\\hbar)}$"
            ],
          },
          {
            question: "Verifieer dat $\\psi_0$ de TISV oplost met $E_0 = \\frac{1}{2}\\hbar\\omega$.",
            hints: [
              "Bereken $\\hat{H}\\psi_0 = \\hbar\\omega(\\hat{a}_+\\hat{a}_- + 1/2)\\psi_0$.",
              "Gebruik $\\hat{a}_-\\psi_0 = 0$."
            ],
            solution: [
              "$\\hat{H}\\psi_0 = \\hbar\\omega\\left(\\hat{a}_+\\underbrace{\\hat{a}_-\\psi_0}_{0} + \\frac{1}{2}\\psi_0\\right) = \\frac{1}{2}\\hbar\\omega\\,\\psi_0$",
              "Inderdaad: $E_0 = \\frac{1}{2}\\hbar\\omega$ ✓"
            ],
          },
        ],
      },
      {
        label: "Opgave 3",
        title: "Het energiespectrum afleiden",
        intro: "We bewijzen dat de ladderoperatoren het energieniveau met $\\pm\\hbar\\omega$ verschuiven en leiden het volledige spectrum af.",
        steps: [
          {
            question: "Toon aan: als $\\hat{H}\\psi = E\\psi$, dan is $\\hat{H}(\\hat{a}_+\\psi) = (E + \\hbar\\omega)(\\hat{a}_+\\psi)$. Tip: gebruik $[\\hat{H}, \\hat{a}_+] = \\hbar\\omega\\hat{a}_+$.",
            hints: [
              "Bereken $[\\hat{H}, \\hat{a}_+]$ uit $\\hat{H} = \\hbar\\omega(\\hat{a}_+\\hat{a}_- + 1/2)$.",
              "$[\\hat{a}_+\\hat{a}_-, \\hat{a}_+] = \\hat{a}_+[\\hat{a}_-, \\hat{a}_+] = \\hat{a}_+ \\cdot 1 = \\hat{a}_+$.",
              "Dus $\\hat{H}\\hat{a}_+ = \\hat{a}_+\\hat{H} + \\hbar\\omega\\hat{a}_+$."
            ],
            solution: [
              "$[\\hat{H}, \\hat{a}_+] = \\hbar\\omega[\\hat{a}_+\\hat{a}_-, \\hat{a}_+] = \\hbar\\omega\\hat{a}_+$",
              "$\\hat{H}(\\hat{a}_+\\psi) = (\\hat{a}_+\\hat{H} + \\hbar\\omega\\hat{a}_+)\\psi = \\hat{a}_+(E\\psi) + \\hbar\\omega\\hat{a}_+\\psi$",
              "$= (E + \\hbar\\omega)(\\hat{a}_+\\psi)$ ✓"
            ],
          },
          {
            question: "Toon analoog aan dat $\\hat{H}(\\hat{a}_-\\psi) = (E - \\hbar\\omega)(\\hat{a}_-\\psi)$.",
            hints: [
              "Bereken $[\\hat{H}, \\hat{a}_-] = -\\hbar\\omega\\hat{a}_-$."
            ],
            solution: [
              "$[\\hat{H}, \\hat{a}_-] = \\hbar\\omega[\\hat{a}_+\\hat{a}_-, \\hat{a}_-] = \\hbar\\omega\\hat{a}_+[\\hat{a}_-, \\hat{a}_-] + \\hbar\\omega[\\hat{a}_+, \\hat{a}_-]\\hat{a}_- = -\\hbar\\omega\\hat{a}_-$",
              "$\\hat{H}(\\hat{a}_-\\psi) = (\\hat{a}_-\\hat{H} - \\hbar\\omega\\hat{a}_-)\\psi = (E - \\hbar\\omega)(\\hat{a}_-\\psi)$ ✓"
            ],
          },
          {
            question: "Beargumenteer dat er een laagste energieniveau moet bestaan en dat de grondtoestandsenergie $E_0 = \\frac{1}{2}\\hbar\\omega$ is.",
            hints: [
              "Kan $E$ negatief worden? Bedenk dat $\\langle H \\rangle = \\langle p^2\\rangle/(2m) + \\frac{1}{2}m\\omega^2\\langle x^2\\rangle \\geq 0$.",
              "Er moet een toestand $\\psi_0$ bestaan waarvoor $\\hat{a}_-\\psi_0 = 0$ (anders zouden we eindeloos kunnen afdalen)."
            ],
            solution: [
              "$\\langle H\\rangle = \\frac{\\langle p^2\\rangle}{2m} + \\frac{1}{2}m\\omega^2\\langle x^2\\rangle \\geq 0$ (som van niet-negatieve termen).",
              "Dus de ladder kan niet oneindig afdalen. Er is een laagste toestand $\\psi_0$ met $\\hat{a}_-\\psi_0 = 0$.",
              "$\\hat{H}\\psi_0 = \\hbar\\omega(\\hat{a}_+\\hat{a}_- + \\frac{1}{2})\\psi_0 = \\frac{1}{2}\\hbar\\omega\\,\\psi_0$",
              "Dus $E_0 = \\frac{1}{2}\\hbar\\omega$."
            ],
          },
          {
            question: "Leid af dat $\\hat{a}_+|n\\rangle = \\sqrt{n+1}\\,|n+1\\rangle$ en $\\hat{a}_-|n\\rangle = \\sqrt{n}\\,|n-1\\rangle$. Tip: bereken $\\|\\hat{a}_+|n\\rangle\\|^2 = \\langle n|\\hat{a}_-\\hat{a}_+|n\\rangle$.",
            hints: [
              "$\\hat{a}_-\\hat{a}_+ = \\hat{a}_+\\hat{a}_- + 1 = \\hat{n} + 1$.",
              "$\\langle n|\\hat{n} + 1|n\\rangle = n + 1$.",
              "Dus $\\|\\hat{a}_+|n\\rangle\\|^2 = n + 1$, wat $\\hat{a}_+|n\\rangle = \\sqrt{n+1}|n+1\\rangle$ geeft."
            ],
            solution: [
              "$\\|\\hat{a}_+|n\\rangle\\|^2 = \\langle n|\\hat{a}_-\\hat{a}_+|n\\rangle = \\langle n|(\\hat{n} + 1)|n\\rangle = n + 1$",
              "Dus $\\hat{a}_+|n\\rangle = \\sqrt{n+1}\\,|n+1\\rangle$.",
              "Analoog: $\\|\\hat{a}_-|n\\rangle\\|^2 = \\langle n|\\hat{a}_+\\hat{a}_-|n\\rangle = \\langle n|\\hat{n}|n\\rangle = n$",
              "Dus $\\hat{a}_-|n\\rangle = \\sqrt{n}\\,|n-1\\rangle$.",
              "Controle: $\\hat{a}_-|0\\rangle = \\sqrt{0}\\,|{-1}\\rangle = 0$ ✓ (de ladder stopt bij $n = 0$)."
            ],
          },
        ],
      },
      {
        label: "Opgave 4",
        title: "Verwachtingswaarden berekenen met ladderoperatoren",
        intro: "We berekenen verwachtingswaarden in de $n$-de eigentoestand met behulp van ladderoperatoren — veel eenvoudiger dan integreren!",
        steps: [
          {
            question: "Druk $\\hat{x}$ uit in $\\hat{a}_+$ en $\\hat{a}_-$. Bereken vervolgens $\\langle n|\\hat{x}|n\\rangle$.",
            hints: [
              "Uit de definities: $\\hat{a}_+ + \\hat{a}_- = \\frac{2m\\omega\\hat{x}}{\\sqrt{2\\hbar m\\omega}} = \\sqrt{\\frac{2m\\omega}{\\hbar}}\\hat{x}$.",
              "Dus $\\hat{x} = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat{a}_+ + \\hat{a}_-)$.",
              "$\\langle n|\\hat{a}_+|n\\rangle = \\sqrt{n+1}\\langle n|n+1\\rangle = 0$ (orthogonaliteit)."
            ],
            solution: [
              "$\\hat{x} = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat{a}_+ + \\hat{a}_-)$",
              "$\\langle n|\\hat{x}|n\\rangle = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\underbrace{\\langle n|\\hat{a}_+|n\\rangle}_{\\sqrt{n+1}\\langle n|n+1\\rangle = 0} + \\underbrace{\\langle n|\\hat{a}_-|n\\rangle}_{\\sqrt{n}\\langle n|n-1\\rangle = 0}) = 0$",
              "$\\langle x \\rangle = 0$ voor elke eigentoestand — het deeltje zit gemiddeld op het evenwichtspunt."
            ],
          },
          {
            question: "Bereken $\\langle n|\\hat{x}^2|n\\rangle$.",
            hints: [
              "$\\hat{x}^2 = \\frac{\\hbar}{2m\\omega}(\\hat{a}_+ + \\hat{a}_-)^2 = \\frac{\\hbar}{2m\\omega}(\\hat{a}_+^2 + \\hat{a}_+\\hat{a}_- + \\hat{a}_-\\hat{a}_+ + \\hat{a}_-^2)$.",
              "$\\hat{a}_+^2|n\\rangle \\propto |n+2\\rangle$ en $\\hat{a}_-^2|n\\rangle \\propto |n-2\\rangle$ — orthogonaal op $|n\\rangle$.",
              "Alleen $\\hat{a}_+\\hat{a}_- = \\hat{n}$ en $\\hat{a}_-\\hat{a}_+ = \\hat{n} + 1$ geven bijdragen."
            ],
            solution: [
              "$\\langle n|\\hat{x}^2|n\\rangle = \\frac{\\hbar}{2m\\omega}\\langle n|(\\hat{a}_+\\hat{a}_- + \\hat{a}_-\\hat{a}_+)|n\\rangle$",
              "$= \\frac{\\hbar}{2m\\omega}\\langle n|(\\hat{n} + \\hat{n} + 1)|n\\rangle = \\frac{\\hbar}{2m\\omega}(2n + 1)$",
              "$\\langle x^2\\rangle = \\frac{\\hbar(2n+1)}{2m\\omega}$"
            ],
          },
          {
            question: "Bereken $\\langle n|\\hat{p}^2|n\\rangle$ op analoge wijze en verifieer het viriaaltheorema: $\\langle T \\rangle = \\langle V \\rangle = E_n/2$.",
            hints: [
              "$\\hat{p} = i\\sqrt{\\frac{\\hbar m\\omega}{2}}(\\hat{a}_+ - \\hat{a}_-)$.",
              "$\\hat{p}^2 = -\\frac{\\hbar m\\omega}{2}(\\hat{a}_+ - \\hat{a}_-)^2$.",
              "Weer overleven alleen de termen $\\hat{a}_+\\hat{a}_-$ en $\\hat{a}_-\\hat{a}_+$."
            ],
            solution: [
              "$\\hat{p}^2 = -\\frac{\\hbar m\\omega}{2}(\\hat{a}_+^2 - \\hat{a}_+\\hat{a}_- - \\hat{a}_-\\hat{a}_+ + \\hat{a}_-^2)$",
              "$\\langle n|\\hat{p}^2|n\\rangle = \\frac{\\hbar m\\omega}{2}(2n+1)$",
              "$\\langle T\\rangle = \\frac{\\langle p^2\\rangle}{2m} = \\frac{\\hbar\\omega(2n+1)}{4} = \\frac{E_n}{2}$ ✓",
              "$\\langle V\\rangle = \\frac{1}{2}m\\omega^2\\langle x^2\\rangle = \\frac{1}{2}m\\omega^2 \\cdot \\frac{\\hbar(2n+1)}{2m\\omega} = \\frac{\\hbar\\omega(2n+1)}{4} = \\frac{E_n}{2}$ ✓",
              "Het viriaaltheorema: voor de harmonische oscillator geldt $\\langle T\\rangle = \\langle V\\rangle$ exact."
            ],
          },
          {
            question: "Bereken $\\sigma_x\\sigma_p$ voor de $n$-de eigentoestand en verifieer het onzekerheidsprincipe.",
            hints: [
              "$\\sigma_x^2 = \\langle x^2\\rangle - \\langle x\\rangle^2 = \\langle x^2\\rangle$ (want $\\langle x\\rangle = 0$).",
              "Idem voor $\\sigma_p$."
            ],
            solution: [
              "$\\sigma_x = \\sqrt{\\frac{\\hbar(2n+1)}{2m\\omega}}, \\qquad \\sigma_p = \\sqrt{\\frac{\\hbar m\\omega(2n+1)}{2}}$",
              "$\\sigma_x\\sigma_p = \\frac{\\hbar(2n+1)}{2} = \\left(n + \\frac{1}{2}\\right)\\hbar$",
              "Voor $n = 0$: $\\sigma_x\\sigma_p = \\hbar/2$ — de minimale onzekerheid (Gauss-pakket)! ✓",
              "Voor $n \\geq 1$: $\\sigma_x\\sigma_p = (n + 1/2)\\hbar > \\hbar/2$ ✓",
              "Alleen de grondtoestand verzadigt het onzekerheidsprincipe."
            ],
          },
        ],
      },
    ],
    quiz: [
      {
        question: "Waarom is de harmonische oscillator zo belangrijk in de fysica?",
        options: [
          "Het is het enige exact oplosbare probleem",
          "Elk systeem bij een stabiel evenwicht gedraagt zich bij kleine uitwijkingen als een HO",
          "Het beschrijft alleen massa-veersystemen",
          "De energieniveaus zijn altijd eindig"
        ],
        correct: 1,
        explanation: "Bij een stabiel evenwicht is $V(x) \\approx V_0 + \\frac{1}{2}V''(x_0)(x-x_0)^2$ — een harmonische potentiaal. De HO is daardoor universeel toepasbaar."
      },
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
          "$\\hat{a}_+|n\\rangle = \\sqrt{n+1}\\,|n+1\\rangle$",
          "$\\hat{a}_+|n\\rangle = \\sqrt{n}\\,|n-1\\rangle$",
          "$\\hat{a}_+|n\\rangle = E_n|n\\rangle$"
        ],
        correct: 1,
        explanation: "$\\hat{a}_+$ klimt een trede op de energieladder: $\\hat{a}_+|n\\rangle = \\sqrt{n+1}\\,|n+1\\rangle$."
      },
      {
        question: "Wat is de nulpuntsenergie van de harmonische oscillator?",
        options: ["$0$", "$\\hbar\\omega$", "$\\frac{1}{2}\\hbar\\omega$", "$\\frac{3}{2}\\hbar\\omega$"],
        correct: 2,
        explanation: "$E_0 = \\frac{1}{2}\\hbar\\omega > 0$. Het deeltje kan nooit volledig in rust zijn — een gevolg van het onzekerheidsprincipe."
      },
      {
        question: "De grondtoestand golffunctie $\\psi_0(x)$ is:",
        options: [
          "Een sinusfunctie",
          "Een Gaussische functie",
          "Een exponentieel afnemende functie",
          "Een constante"
        ],
        correct: 1,
        explanation: "$\\psi_0 \\propto e^{-m\\omega x^2/(2\\hbar)}$, een Gaussische (klokvormige) functie. Het is de enige toestand die het onzekerheidsprincipe verzadigt."
      },
      {
        question: "Wat is $[\\hat{a}_-, \\hat{a}_+]$?",
        options: ["$0$", "$1$", "$\\hbar$", "$i\\hbar$"],
        correct: 1,
        explanation: "De commutator van de ladderoperatoren is $[\\hat{a}_-, \\hat{a}_+] = 1$. Dit is een gevolg van $[\\hat{x}, \\hat{p}] = i\\hbar$."
      },
      {
        question: "Het viriaaltheorema voor de HO stelt dat:",
        options: [
          "$\\langle T \\rangle = 2\\langle V \\rangle$",
          "$\\langle T \\rangle = \\langle V \\rangle = E_n/2$",
          "$\\langle T \\rangle = E_n$",
          "$\\langle V \\rangle = 0$"
        ],
        correct: 1,
        explanation: "Voor de harmonische oscillator geldt $\\langle T\\rangle = \\langle V\\rangle = E_n/2$: de energie is gelijk verdeeld over kinetisch en potentieel."
      },
      {
        question: "Welke toestand van de HO verzadigt het onzekerheidsprincipe ($\\sigma_x\\sigma_p = \\hbar/2$)?",
        options: [
          "Alle eigentoestanden",
          "Alleen de grondtoestand $n = 0$",
          "Alleen oneven $n$",
          "Geen enkele"
        ],
        correct: 1,
        explanation: "$\\sigma_x\\sigma_p = (n + 1/2)\\hbar$. Alleen voor $n = 0$ is dit $\\hbar/2$ — de minimale onzekerheid. De grondtoestand is een Gaussisch golfpakket."
      },
    ],
};

export default chapter8;
