import { useState, useEffect } from 'react'

const DANI = [
  "Ponedeljak", "Utorak", "Srijeda", "Četvrtak", 
  "Petak", "Subota", "Nedelja"
];

const SMJENE = ["I", "II", "OFF"];
const SEKTORI = ["KONOBARI", "KUHINJA", "ŠANK"];

// Pauze za prvu smenu (08:00-16:00)
const PAUZE_PRVA = [
  "09:00-09:30", "09:30-10:00", "10:00-10:30", 
  "10:30-11:00", "11:00-11:30", "11:30-12:00",
  "12:00-12:30", "12:30-13:00", "13:00-13:30",
  "13:30-14:00", "14:00-14:30", "14:30-15:00"
];

// Pauze za drugu smenu (16:00-00:00)
const PAUZE_DRUGA = [
  "17:00-17:30", "17:30-18:00", "18:00-18:30", 
  "18:30-19:00", "19:00-19:30", "19:30-20:00",
  "20:00-20:30", "20:30-21:00", "21:00-21:30",
  "21:30-22:00", "22:00-22:30", "22:30-23:00"
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
    } else {
      radnik.smjena = vrijednost;
    }
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

  const azurirajSmjenu = (sektor, index, smjena) => {
    const noviPodaci = { ...podaci };
    noviPodaci[sektor][index].smjena = smjena;
    if (smjena === "I") {
      noviPodaci[sektor][index].pauza = PAUZE_PRVA[index % PAUZE_PRVA.length];
    } else {
      noviPodaci[sektor][index].pauza = PAUZE_DRUGA[index % PAUZE_DRUGA.length];
    }
    setPodaci(noviPodaci);
  };

  const dodajRadnika = (sektor) => {
    const noviPodaci = { ...podaci };
    const radniciUSektoru = noviPodaci[sektor];
    const prvaSmena = radniciUSektoru.filter(r => r.smjena === "I").length;
    const drugaSmena = radniciUSektoru.filter(r => r.smjena === "II").length;
    const smjena = prvaSmena <= drugaSmena ? "I" : "II";
    const pauza = smjena === "I" 
      ? PAUZE_PRVA[prvaSmena % PAUZE_PRVA.length]
      : PAUZE_DRUGA[drugaSmena % PAUZE_DRUGA.length];
    
    const brojSlobodnihPoDanima = DANI.map((dan, index) => ({
      dan: index,
      broj: radniciUSektoru.filter(r => r.slobodniDan === index).length
    }));
    brojSlobodnihPoDanima.sort((a, b) => a.broj - b.broj);
    const slobodniDan = brojSlobodnihPoDanima[0].dan;
    
    radniciUSektoru.push({
      ime: "",
      smjena: smjena,
      pauza: pauza,
      slobodniDan: slobodniDan
    });
    setPodaci(noviPodaci);
  };

  const obrisiRadnika = (sektor, index) => {
    if (window.confirm("Sigurno želiš da obrišeš ovog radnika?")) {
      const noviPodaci = { ...podaci };
      noviPodaci[sektor].splice(index, 1);
      setPodaci(noviPodaci);
    }
  };

  const autoRasporedi = () => {
    const noviPodaci = { ...podaci };
    Object.keys(noviPodaci).forEach(sektor => {
      noviPodaci[sektor].forEach((radnik, index) => {
        radnik.slobodniDan = index % 7;
        const trenutniOffset = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 7;
        radnik.slobodniDan = (radnik.slobodniDan + trenutniOffset) % 7;
      });
    });
    setPodaci(noviPodaci);
  };

  const resetujPodatke = () => {
    if (window.confirm("Sigurno želiš da resetuješ SVE podatke na početne?")) {
      localStorage.removeItem('rasporedPodaci');
      setPodaci(POCETNI_PODACI);
    }
  };

  // Komponenta za prikaz tabele jednog sektora
  const TabelaSektora = ({ sektor, podaciSektora, naslov }) => {
    const radnici = generisiRaspored(podaciSektora);
    
    return (
      <div className="mb-6 print:mb-3 print:break-inside-avoid">
        <h2 className="text-lg font-bold mb-2 border-b-2 border-black pb-1 print:text-base">
          {naslov}
        </h2>
        <table className="w-full border-collapse text-xs print:text-[9px]">
          <thead>
            <tr>
              <th className="border border-gray-400 bg-gray-200 p-1 print:p-0.5 text-left min-w-[100px] print:min-w-[70px]">
                IME
              </th>
              <th className="border border-gray-400 bg-gray-200 p-1 print:p-0.5 text-center min-w-[45px] print:min-w-[35px]">
                SM
              </th>
              {DANI.map(dan => (
                <th key={dan} className="border border-gray-400 bg-gray-200 p-1 print:p-0.5 text-center min-w-[55px] print:min-w-[45px] text-[10px] print:text-[7px]">
                  {dan.substring(0, 3)}
                </th>
              ))}
              <th className="border border-gray-400 bg-yellow-300 p-1 print:p-0.5 text-center min-w-[90px] print:min-w-[70px] text-[10px] print:text-[7px]">
                PAUZA
              </th>
            </tr>
          </thead>
          <tbody>
            {radnici.map((radnik, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-1 print:p-0.5">
                  <input
                    value={radnik.ime}
                    onChange={(e) => azurirajIme(sektor, index, e.target.value)}
                    className="w-full p-0.5 outline-none bg-transparent text-xs print:text-[8px] font-medium"
                    placeholder="Ime..."
                  />
                </td>
                <td className="border border-gray-300 p-0.5 text-center">
                  <select
                    value={radnik.smjena}
                    onChange={(e) => azurirajSmjenu(sektor, index, e.target.value)}
                    className={`w-full p-0.5 text-center text-xs font-bold rounded print:text-[8px] ${
                      radnik.smjena === 'I' ? 'bg-blue-100' : 'bg-green-100'
                    }`}
                  >
                    <option value="I">I</option>
                    <option value="II">II</option>
                  </select>
                </td>
                {DANI.map(dan => (
                  <td key={dan} className="border border-gray-300 p-0.5 text-center">
                    <select
                      value={radnik.raspored[dan]}
                      onChange={(e) => azurirajDan(sektor, index, dan, e.target.value)}
                      className={`w-full p-0.5 text-center text-xs font-bold rounded print:text-[8px] ${
                        radnik.raspored[dan] === 'OFF' ? 'bg-red-100' :
                        radnik.raspored[dan] === 'I' ? 'bg-blue-100' : 'bg-green-100'
                      }`}
                    >
                      {SMJENE.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                ))}
                <td className="border border-gray-300 p-0.5 bg-yellow-50">
                  <select
                    value={radnik.pauza}
                    onChange={(e) => azurirajPauzu(sektor, index, e.target.value)}
                    className="w-full p-0.5 bg-yellow-50 text-xs print:text-[8px]"
                  >
                    {(radnik.smjena === "I" ? PAUZE_PRVA : PAUZE_DRUGA).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Header - ne štampa se */}
      <div className="bg-white shadow-lg mb-4 no-print">
        <div className="max-w-full mx-auto p-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">📋 RASPORED SMJENA</h1>
              <p className="text-sm text-gray-500">I smjena: 08:00-16:00 | II smjena: 16:00-00:00</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => dodajRadnika('KONOBARI')} className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700">
                + Konobar
              </button>
              <button onClick={() => dodajRadnika('KUHINJA')} className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700">
                + Kuvar
              </button>
              <button onClick={() => dodajRadnika('ŠANK')} className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700">
                + Šanker
              </button>
              <button onClick={autoRasporedi} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700">
                🔄 Auto
              </button>
              <button onClick={resetujPodatke} className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700">
                🔃 Reset
              </button>
              <button onClick={() => window.print()} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 font-bold">
                🖨️ Štampaj
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sadržaj za štampu - SVA 3 SEKTORA */}
      <div className="max-w-full mx-auto p-4 print:p-2">
        <div className="bg-white rounded-lg shadow print:shadow-none p-4 print:p-0">
          
          {/* Naslov - samo u štampi */}
          <div className="hidden print:block text-center mb-3 border-b-2 border-black pb-2">
            <h1 className="text-xl font-bold">RASPORED SMJENA</h1>
            <p className="text-sm">I smjena: 08:00-16:00 | II smjena: 16:00-00:00</p>
            <p className="text-xs text-gray-600">Sedmica: 29.12.2026 - 04.01.2027</p>
          </div>

          {/* Sva 3 sektora */}
          <TabelaSektora 
            sektor="KONOBARI" 
            podaciSektora={podaci.KONOBARI} 
            naslov="KONOBARI" 
          />
          
          <TabelaSektora 
            sektor="KUHINJA" 
            podaciSektora={podaci.KUHINJA} 
            naslov="KUHINJA" 
          />
          
          <TabelaSektora 
            sektor="ŠANK" 
            podaciSektora={podaci.ŠANK} 
            naslov="ŠANK" 
          />

          {/* Legenda - samo u štampi */}
          <div className="hidden print:block mt-3 pt-2 border-t border-gray-300 text-xs">
            <p><strong>I</strong> = Prva smjena (08:00-16:00) | <strong>II</strong> = Druga smjena (16:00-00:00) | <strong>OFF</strong> = Slobodan dan</p>
          </div>
        </div>
      </div>

      {/* Legenda na ekranu */}
      <div className="max-w-full mx-auto p-4 no-print">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold mb-2">📌 Legenda:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div><span className="inline-block w-4 h-4 bg-blue-100 border mr-2"></span>
              <strong>I</strong> = Prva smjena (08:00-16:00)</div>
            <div><span className="inline-block w-4 h-4 bg-green-100 border mr-2"></span>
              <strong>II</strong> = Druga smjena (16:00-00:00)</div>
            <div><span className="inline-block w-4 h-4 bg-red-100 border mr-2"></span>
              <strong>OFF</strong> = Slobodan dan</div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            💡 Klikni <strong>Štampaj</strong> za štampu svih sektora na A4 uspravno | Podaci se čuvaju automatski
          </p>
        </div>
      </div>

      {/* CSS za štampu */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          body {
            background: white !important;
            font-size: 9px;
          }
          .no-print {
            display: none !important;
          }
          table {
            font-size: 8px;
          }
          input, select {
            border: none !important;
            background: transparent !important;
            -webkit-appearance: none;
            -moz-appearance: none;
            font-size: 8px;
          }
          select {
            padding: 0 !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
