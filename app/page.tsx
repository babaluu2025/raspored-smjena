export default function RasporedApp() {
  const dani = [
    "Ponedeljak",
    "Utorak",
    "Srijeda",
    "Četvrtak",
    "Petak",
    "Subota",
    "Nedelja",
  ];

  const pauzePrva = [
    "09:00-09:30",
    "09:30-10:00",
    "10:00-10:30",
    "10:30-11:00",
  ];

  const pauzeDruga = [
    "17:00-17:30",
    "17:30-18:00",
    "18:00-18:30",
    "18:30-19:00",
  ];

  const napraviRedove = (broj) => {
    return Array.from({ length: broj }, (_, i) => {
      const smjena = i % 2 === 0 ? "I" : "II";
      const pauza = smjena === "I"
        ? pauzePrva[i % pauzePrva.length]
        : pauzeDruga[i % pauzeDruga.length];

      return {
        ime: "",
        pauza,
        raspored: {
          Ponedeljak: i === 0 ? "OFF" : smjena,
          Utorak: i === 1 ? "OFF" : smjena,
          Srijeda: i === 2 ? "OFF" : smjena,
          Četvrtak: i === 3 ? "OFF" : smjena,
          Petak: i === 4 ? "OFF" : smjena,
          Subota: i === 5 ? "OFF" : smjena,
          Nedelja: i === 6 ? "OFF" : smjena,
        },
      };
    });
  };

  const grupe = [
    {
      naziv: "KONOBARI",
      podaci: napraviRedove(12),
    },
    {
      naziv: "KUHINJA",
      podaci: napraviRedove(8),
    },
    {
      naziv: "ŠANK",
      podaci: napraviRedove(6),
    },
  ];

  const smjene = ["I", "II", "OFF"];

  return (
    <div className="bg-gray-100 min-h-screen p-4 print:p-0">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-2xl print:shadow-none">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h1 className="text-3xl font-bold">Raspored Smjena</h1>

          <button
            onClick={() => window.print()}
            className="bg-black text-white px-5 py-2 rounded-xl"
          >
            ŠTAMPAJ A4
          </button>
        </div>

        {grupe.map((grupa, grupaIndex) => (
          <div key={grupaIndex} className="mb-10">
            <h2 className="text-xl font-bold mb-3 border-b pb-2">
              {grupa.naziv}
            </h2>

            <div className="overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border bg-gray-200 p-2 min-w-[170px]">
                      Ime
                    </th>

                    {dani.map((dan) => (
                      <th
                        key={dan}
                        className="border bg-gray-200 p-2 min-w-[100px]"
                      >
                        {dan}
                      </th>
                    ))}

                    <th className="border bg-yellow-300 p-2 min-w-[150px]">
                      30 MIN PAUZA
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {grupa.podaci.map((osoba, index) => (
                    <tr key={index}>
                      <td className="border p-1">
                        <input
                          defaultValue={osoba.ime}
                          className="w-full p-1 outline-none"
                          placeholder="Upiši ime"
                        />
                      </td>

                      {dani.map((dan) => (
                        <td key={dan} className="border p-1 text-center">
                          <select
                            defaultValue={osoba.raspored[dan]}
                            className="w-full p-1 text-center"
                          >
                            {smjene.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      ))}

                      <td className="border p-1 bg-yellow-100">
                        <select
                          defaultValue={osoba.pauza}
                          className="w-full p-1 bg-yellow-100"
                        >
                          {pauzePrva.concat(pauzeDruga).map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="mt-8 border-t pt-4 text-sm text-gray-600">
          <p>• I = Prva smjena</p>
          <p>• II = Druga smjena</p>
          <p>• OFF = Slobodan dan</p>
          <p>• Pauze i OFF dani su automatski raspoređeni da se manje sudaraju.</p>
          <p>• Sve možeš ručno promijeniti klikom na polje.</p>
        </div>
      </div>
    </div>
  );
}
