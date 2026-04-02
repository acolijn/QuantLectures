const chapter11 = {
    id: 11,
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
};

export default chapter11;
