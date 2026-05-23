import { useState, useEffect } from 'react'

const DANI = ["Ponedeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedelja"];
const SMJENE = ["I", "II", "OFF"];
const SEKTORI = ["KONOBARI", "KUHINJA", "ŠANK"];

const PAUZE_PRVA = [
  "09:00-09:30", "09:30-10:00", "10:00-10:30", "10:30-11:00",
  "11:00-11:30", "11:30-12:00", "12:00-12:30"
];

const PAUZE_DRUGA = [
  "17:00-17:30", "17:30-18:00", "18:00-18:30", "18:30-19:00",
  "19:00-19:30", "19:30-20:00", "20:00-20:30"
];

const POCETNI_PODACI = {
  KONOBARI: [
    { ime: "Vladan", smjena: "I", pauza: "09:00-09:30", slobodniDan: 3 },
    { ime: "Aleksa", smjena: "I", pauza: "09:30-10:00", slobodniDan: 4 },
    { ime: "Balša", smjena: "I", pauza: "10:00-10:30", slobodniDan: 1 },
    { ime: "Slobo", smjena: "I", pauza: "10:30-11:00", slobodniDan: 0 },
    { ime: "Misel", smjena: "I", pauza: "11:00-11:30", slobodniDan: 5 },
    { ime: "Goran", smjena: "I", pauza: "11:30-12:00", slobodniDan: 3 },
    { ime: "Peđa M", smjena: "I", pauza: "12:00-12:30", slobodniDan: 4 },
    { ime: "Jovan", smjena: "II", pauza: "17:00-17:30", slobodniDan: 0 },
    { ime: "Miloš Z", smjena: "II", pauza: "17:30-18:00", slobodniDan: 6 },
    { ime: "Marko P", smjena: "II", pauza: "18:00-18:30", slobodniDan: 1 },
    { ime: "Sreten", smjena: "II", pauza: "18:30-19:00", slobodniDan: 3 },
    { ime: "Ranko", smjena: "II", pauza: "19:00-19:30", slobodniDan: 4 },
  ],
  KUHINJA: [
    { ime: "Mira", smjena: "I", pauza: "09:00-09:30", slobodniDan: 0 },
    { ime: "Miroslav", smjena: "I", pauza: "09:30-10:00", slobodniDan: 4 },
    { ime: "Nataša", smjena: "I", pauza: "10:00-10:30", slobodniDan: 3 },
    { ime: "Lidija", smjena: "I", pauza: "10:30-11:00", slobodniDan: 5 },
    { ime: "Nevena", smjena: "II", pauza: "17:00-17:30", slobodniDan: 2 },
    { ime: "Dragan", smjena: "II", pauza: "17:30-18:00", slobodniDan: 2 },
    { ime: "Abduš", smjena: "II", pauza: "18:00-18:30", slobodniDan: 4 },
    { ime: "Todor", smjena: "II", pauza: "18:30-19:00", slobodniDan: 2 },
  ],
  ŠANK: [
    { ime: "Radovan", smjena: "I", pauza: "09:00-09:30", slobodniDan: 0 },
    { ime: "Ratko", smjena: "I", pauza: "09:30-10:00", slobodniDan: 4 },
    { ime: "Tijana", smjena: "I", pauza: "10:00-10:30", slobodniDan: 3 },
    { ime: "Dušan", smjena: "II", pauza: "17:00-17:30", slobodniDan: 1 },
    { ime: "Aco", smjena: "II", pauza: "17:30-18:00", slobodniDan: 2 },
    { ime: "Nina", smjena: "II", pauza: "18:00-18:30", slobodniDan: 5 },
  ]
};

export default function RasporedApp() {
  const [podaci, setPodaci] = useState(() => {
    const saved = localStorage.getItem('rasporedPodaci');
    return saved ? JSON.parse(saved) : POCETNI_PODACI;
  });

  const [aktivniSektor, setAktivniSektor] = useState(SEKTORI[0]);

  useEffect(() => {
    localStorage.setItem('rasporedPodaci', JSON.stringify(podaci));
  }, [podaci]);

  const generisiRaspored = (radnici) => {
    return radnici.map(radnik => {
      const raspored = {};
      DANI.forEach((dan, index) => {
        raspored[dan] = index === radnik.slobodniDan ? "OFF" : radnik.smjena;
      });
      return { ...radnik, raspored };
    });
  };

  const azurirajDan = (sektor, index, dan, vrijednost) => {
    const noviPodaci = { ...podaci };
    const radnik = noviPodaci[sektor][index];
    
    if (vrijednost === "OFF") {
      radnik.slobodniDan = DANI.indexOf(dan);
    }
    radnik.smjena = vrijednost === "OFF" ? radnik.smjena : vrijednost;
    
    setPodaci(noviPodaci);
  };

  const azurirajIme = (sektor, index, ime) => {
    const noviPodaci = { ...podaci };
    noviPodaci[sektor][index].ime = ime;
    setPodaci(noviPodaci);
  };

  const azurirajPauzu = (sektor, index, pauza) => {
    const noviPodaci = { ...podaci };
    noviPodaci[sektor][index].pauza = pauza;
    setPodaci(noviPodaci);
  };

  const dodajRadnika = () => {
    const noviPodaci = { ...podaci };
    const sektor = aktivniSektor;
    const brojRadnika = noviPodaci[sektor].length;
    
    const noviRadnik = {
      ime: "",
      smjena: brojRadnika < 7 ? "I" : "II",
      pauza: brojRadnika < 7 ? PAUZE_PRVA[brojRadnika % PAUZE_PRVA.length] : PAUZE_DRUGA[brojRadnika % PAUZE_DRUGA.length],
      slobodniDan: brojRadnika % 7
    };
    
    noviPodaci[sektor].push(noviRadnik);
    setPodaci(noviPodaci);
  };

  const obrisiRadnika = (sektor, index) => {
    const noviPodaci = { ...podaci };
    noviPodaci[sektor].splice(index, 1);
    setPodaci(noviPodaci);
  };

  const autoRasporedi = () => {
    const noviPodaci = { ...podaci };
    
    Object.keys(noviPodaci).forEach(sektor => {
      noviPodaci[sektor].forEach((radnik, index) => {
        radnik.slobodniDan = index % 7;
        
        // Rotacija slobodnih dana svake sedmice
        const trenutniOffset = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 7;
        radnik.slobodniDan = (radnik.slobodniDan + trenutniOffset) % 7;
      });
    });
    
    setPodaci(noviPodaci);
  };

  const radniciSaRasporedom = generisiRaspored(podaci[aktivniSektor]);
  const svePauze = [...PAUZE_PRVA, ...PAUZE_DRUGA];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6 no-print">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">📋 RASPORED SMJENA</h1>
              <p className="text-sm text-gray-500 mt-1">Sedmica: 29.12.2026 - 04.01.2027</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={dodajRadnika} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700">
                + Dodaj Radnika
              </button>
              <button onClick={autoRasporedi} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700">
                🔄 Auto Raspored
              </button>
              <button onClick={() => window.print()} className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800">
                🖨️ Štampaj A4
              </button>
            </div>
          </div>

          {/* Tabovi za sektore */}
          <div className="flex gap-2 mb-6 no-print">
            {SEKTORI.map(sektor => (
              <button
                key={sektor}
                onClick={() => setAktivniSektor(sektor)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  aktivniSektor === sektor
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {sektor}
              </button>
            ))}
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-gray-900 text-white p-3 min-w-[150px] text-left">IME</th>
                  {DANI.map(dan => (
                    <th key={dan} className="border bg-gray-900 text-white p-3 min-w-[90px] text-center">
                      {dan}
                    </th>
                  ))}
                  <th className="border bg-yellow-500 text-black p-3 min-w-[140px] text-center">30 MIN PAUZA</th>
                  <th className="border bg-gray-200 p-3 w-10 no-print"></th>
                </tr>
              </thead>
              <tbody>
                {radniciSaRasporedom.map((radnik, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border p-2">
                      <input
                        value={radnik.ime}
                        onChange={(e) => azurirajIme(aktivniSektor, index, e.target.value)}
                        className="w-full p-2 outline-none font-medium bg-transparent"
                        placeholder="Upiši ime..."
                      />
                    </td>
                    {DANI.map(dan => (
                      <td key={dan} className="border p-1 text-center">
                        <select
                          value={radnik.raspored[dan]}
                          onChange={(e) => azurirajDan(aktivniSektor, index, dan, e.target.value)}
                          className={`w-full p-2 text-center font-bold rounded ${
                            radnik.raspored[dan] === 'OFF' ? 'bg-red-100 text-red-700' :
                            radnik.raspored[dan] === 'I' ? 'bg-blue-50 text-blue-700' :
                            'bg-green-50 text-green-700'
                          }`}
                        >
                          {SMJENE.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    ))}
                    <td className="border p-1 bg-yellow-50">
                      <select
                        value={radnik.pauza}
                        onChange={(e) => azurirajPauzu(aktivniSektor, index, e.target.value)}
                        className="w-full p-2 bg-yellow-50 font-medium"
                      >
                        {(radnik.smjena === "I" ? PAUZE_PRVA : PAUZE_DRUGA).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-1 text-center no-print">
                      <button
                        onClick={() => obrisiRadnika(aktivniSektor, index)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                        title="Obriši radnika"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Brojač radnika */}
          <div className="mt-4 text-sm text-gray-500 no-print">
            Ukupno radnika u sektoru <strong>{aktivniSektor}</strong>: {podaci[aktivniSektor].length}
          </div>
        </div>

        {/* Legenda */}
        <div className="bg-white rounded-2xl shadow p-6 no-print">
          <h3 className="font-bold mb-2">📌 Legenda:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="inline-block w-4 h-4 bg-blue-100 border border-blue-300 mr-2"></span>
              <strong>I</strong> = Prva smjena (09:00-17:00)
            </div>
            <div>
              <span className="inline-block w-4 h-4 bg-green-100 border border-green-300 mr-2"></span>
              <strong>II</strong> = Druga smjena (17:00-01:00)
            </div>
            <div>
              <span className="inline-block w-4 h-4 bg-red-100 border border-red-300 mr-2"></span>
              <strong>OFF</strong> = Slobodan dan
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            💾 Podaci se automatski čuvaju u browseru | 🖨️ Klikni "Štampaj A4" za štampu | 📱 Možeš instalirati kao aplikaciju
          </p>
        </div>
      </div>
    </div>
  );
}
