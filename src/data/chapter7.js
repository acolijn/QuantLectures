const chapter7 = {
    id: 7,
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
};

export default chapter7;
