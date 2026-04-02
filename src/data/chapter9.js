const chapter9 = {
    id: 9,
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
};

export default chapter9;
