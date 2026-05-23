import { useState, useEffect, useCallback } from 'react'

const DANI = [
  "Ponedeljak", "Utorak", "Srijeda", "Četvrtak",
  "Petak", "Subota", "Nedelja"
];

const SMJENE = ["I", "II", "OFF"];
const SEKTORI = ["KONOBARI", "KUHINJA", "ŠANK"];

const PAUZE_PRVA = [
  "09:00-09:30", "09:30-10:00", "10:00-10:30",
  "10:30-11:00", "11:00-11:30", "11:30-12:00",
  "12:00-12:30", "12:30-13:00", "13:00-13:30",
  "13:30-14:00", "14:00-14:30", "14:30-15:00"
];

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

function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1 + (offset * 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) =>
    `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  return `${fmt(monday)} - ${fmt(sunday)}`;
}

const seedShuffle = (array, seed) => {
  const shuffled = [...array];
  let m = shuffled.length;
  const pseudoRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  while (m) {
    const i = Math.floor(pseudoRandom() * m--);
    [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
  }
  return shuffled;
};

const SektorTabela = ({ sektor, radnici, naslov, onAzurirajIme, onAzurirajSmjenu, onAzurirajDan, onAzurirajPauzu }) => {
  return (
    <div className="mb-3 print:mb-2">
      <h2 className="text-sm font-bold mb-1 pb-1 text-center uppercase tracking-wider"
          style={{ borderBottom: '2px solid black', fontSize: '14px', fontWeight: 'bold' }}>
        {naslov}
      </h2>
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-black bg-gray-200 p-1.5 text-left font-bold sticky left-0 z-10"
                  style={{ fontSize: '11px', minWidth: '100px' }}>IME</th>
              <th className="border border-black bg-gray-200 p-1.5 text-center font-bold"
                  style={{ fontSize: '11px', minWidth: '55px', width: '55px' }}>SMJENA</th>
              {DANI.map(dan => (
                <th key={dan} className="border border-black bg-gray-200 p-1.5 text-center font-bold"
                    style={{ fontSize: '10px', minWidth: '50px' }}>{dan.substring(0, 3)}</th>
              ))}
              <th className="border border-black bg-yellow-200 p-1.5 text-center font-bold"
                  style={{ fontSize: '10px', minWidth: '100px' }}>30 MIN PAUZA</th>
            </tr>
          </thead>
          <tbody>
            {radnici.map((radnik, index) => (
              <tr key={index}>
                <td className="border border-black p-1 bg-white sticky left-0 z-10">
                  <input
                    value={radnik.ime}
                    onChange={(e) => onAzurirajIme(sektor, index, e.target.value)}
                    className="w-full outline-none bg-transparent font-bold border-none"
                    placeholder="..."
                    style={{ fontSize: '11px', minHeight: '20px' }}
                  />
                </td>
                <td className="border border-black p-1 text-center align-middle"
                    style={{ backgroundColor: radnik.smjena === 'I' ? '#3B82F6' : '#22C55E', padding: '4px' }}>
                  <select
                    value={radnik.smjena}
                    onChange={(e) => onAzurirajSmjenu(sektor, index, e.target.value)}
                    className="w-full text-center font-bold border-none outline-none"
                    style={{ fontSize: '14px', fontWeight: 'bold', backgroundColor: 'transparent', color: 'white', cursor: 'pointer', textAlign: 'center', textAlignLast: 'center' }}
                  >
                    <option value="I" style={{color: 'black', backgroundColor: '#DBEAFE'}}>I</option>
                    <option value="II" style={{color: 'black', backgroundColor: '#DCFCE7'}}>II</option>
                  </select>
                </td>
                {DANI.map(dan => {
                  const val = radnik.raspored[dan];
                  let bg = '#FFFFFF';
                  let textColor = '#000000';
                  if (val === 'OFF') { bg = '#EF4444'; textColor = '#FFFFFF'; }
                  else if (val === 'I') { bg = '#3B82F6'; textColor = '#FFFFFF'; }
                  else if (val === 'II') { bg = '#22C55E'; textColor = '#FFFFFF'; }
                  return (
                    <td key={dan} className="border border-black p-1 text-center align-middle"
                        style={{ backgroundColor: bg, padding: '4px' }}>
                      <select
                        value={val}
                        onChange={(e) => onAzurirajDan(sektor, index, dan, e.target.value)}
                        className="w-full text-center font-bold border-none outline-none"
                        style={{ fontSize: '14px', fontWeight: 'bold', backgroundColor: 'transparent', color: textColor, cursor: 'pointer', textAlign: 'center', textAlignLast: 'center' }}
                      >
                        {SMJENE.map(s => (
                          <option key={s} value={s} style={{color: 'black', backgroundColor: 'white'}}>{s}</option>
                        ))}
                      </select>
                    </td>
                  );
                })}
                <td className="border border-black p-1 bg-yellow-50">
                  <select
                    value={radnik.pauza}
                    onChange={(e) => onAzurirajPauzu(sektor, index, e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-bold text-center"
                    style={{ fontSize: '10px', textAlignLast: 'center' }}
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
    </div>
  );
};

export default function RasporedApp() {
  const [podaci, setPodaci] = useState(() => {
    const saved = localStorage.getItem('rasporedPodaci');
    return saved ? JSON.parse(saved) : POCETNI_PODACI;
  });

  const [weekOffset, setWeekOffset] = useState(0);
  const [datumPrikaz, setDatumPrikaz] = useState(getWeekDates(0));

  useEffect(() => {
    localStorage.setItem('rasporedPodaci', JSON.stringify(podaci));
  }, [podaci]);

  const promeniSedmicu = (smer) => {
    const newOffset = weekOffset + smer;
    setWeekOffset(newOffset);
    setDatumPrikaz(getWeekDates(newOffset));
  };

  const generisiRaspored = useCallback((radnici) => {
    return radnici.map(radnik => {
      const raspored = {};
      DANI.forEach((dan, index) => {
        raspored[dan] = index === radnik.slobodniDan ? "OFF" : radnik.smjena;
      });
      return { ...radnik, raspored };
    });
  }, []);

  const azurirajIme = useCallback((sektor, index, ime) => {
    setPodaci(prev => {
      const novi = { ...prev };
      novi[sektor] = [...novi[sektor]];
      novi[sektor][index] = { ...novi[sektor][index], ime };
      return novi;
    });
  }, []);

  const azurirajSmjenu = useCallback((sektor, index, smjena) => {
    setPodaci(prev => {
      const novi = { ...prev };
      novi[sektor] = [...novi[sektor]];
      const radnik = { ...novi[sektor][index], smjena };
      radnik.pauza = smjena === "I"
        ? PAUZE_PRVA[index % PAUZE_PRVA.length]
        : PAUZE_DRUGA[index % PAUZE_DRUGA.length];
      novi[sektor][index] = radnik;
      return novi;
    });
  }, []);

  const azurirajDan = useCallback((sektor, index, dan, vrijednost) => {
    setPodaci(prev => {
      const novi = { ...prev };
      novi[sektor] = [...novi[sektor]];
      const radnik = { ...novi[sektor][index] };
      if (vrijednost === "OFF") {
        radnik.slobodniDan = DANI.indexOf(dan);
      } else {
        radnik.smjena = vrijednost;
      }
      novi[sektor][index] = radnik;
      return novi;
    });
  }, []);

  const azurirajPauzu = useCallback((sektor, index, pauza) => {
    setPodaci(prev => {
      const novi = { ...prev };
      novi[sektor] = [...novi[sektor]];
      novi[sektor][index] = { ...novi[sektor][index], pauza };
      return novi;
    });
  }, []);

  const dodajRadnika = (sektor) => {
    setPodaci(prev => {
      const novi = { ...prev };
      novi[sektor] = [...novi[sektor]];
      const radnici = novi[sektor];
      const prva = radnici.filter(r => r.smjena === "I").length;
      const druga = radnici.filter(r => r.smjena === "II").length;
      const smjena = prva <= druga ? "I" : "II";
      const pauza = smjena === "I"
        ? PAUZE_PRVA[prva % PAUZE_PRVA.length]
        : PAUZE_DRUGA[druga % PAUZE_DRUGA.length];
      const brojPoDanu = DANI.map((_, i) => radnici.filter(r => r.slobodniDan === i).length);
      const minDan = brojPoDanu.indexOf(Math.min(...brojPoDanu));
      radnici.push({ ime: "", smjena, pauza, slobodniDan: minDan });
      return novi;
    });
  };

  const obrisiRadnika = (sektor, index) => {
    if (window.confirm("Sigurno želiš da obrišeš ovog radnika?")) {
      setPodaci(prev => {
        const novi = { ...prev };
        novi[sektor] = novi[sektor].filter((_, i) => i !== index);
        return novi;
      });
    }
  };

  const autoRasporedi = () => {
  setPodaci(prev => {
    const novi = { ...prev };
    
    Object.keys(novi).forEach((sektor) => {
      const radnici = [...novi[sektor]];
      const ukupno = radnici.length;
      
      if (ukupno === 0) return;
      
      // ======================================================
      //  KORAK 1: Pravimo šablon za CEO SEKTOR
      //  Cilj: Svih 7 dana mora biti pokriveno što ravnomernije
      // ======================================================
      
      // Računamo koliko radnika po danu (idealno)
      const idealnoPoDanu = ukupno / 7;
      
      // Pravimo niz dana za sve radnike
      let sviDani = [];
      
      // Prvo dodeljujemo svaki dan bar 1 (ako ima 7+ radnika)
      if (ukupno >= 7) {
        // Svaki dan dobija bar 1 slobodnog
        for (let dan = 0; dan < 7; dan++) {
          sviDani.push(dan);
        }
        
        // Ostatak ravnomerno raspoređujemo
        const ostatak = ukupno - 7;
        for (let i = 0; i < ostatak; i++) {
          // Dodajemo dan koji trenutno ima najmanje slobodnih
          const brojPoDanu = new Array(7).fill(0);
          sviDani.forEach(d => brojPoDanu[d]++);
          const minBroj = Math.min(...brojPoDanu);
          const danSaNajmanje = brojPoDanu.indexOf(minBroj);
          sviDani.push(danSaNajmanje);
        }
      } else {
        // Manje od 7 radnika - biramo dane sa ravnomernim razmakom
        // npr. 6 radnika = dani 0,1,2,3,4,5 (nedelja prazna)
        //      5 radnika = dani 0,1,2,4,5 (sreda i subota prazne)
        //      3 radnika = dani 0,2,4 (razmak 2)
        
        const korak = 7 / ukupno;
        for (let i = 0; i < ukupno; i++) {
          const dan = Math.floor(i * korak);
          sviDani.push(dan % 7);
        }
        
        // Rotiramo za random offset da ne bude uvek isto
        const offset = Math.floor(Math.random() * 7);
        sviDani = sviDani.map(d => (d + offset) % 7);
      }
      
      // Mešamo dane
      sviDani = seedShuffle(sviDani, Math.floor(Math.random() * 1000));
      
      // ======================================================
      //  KORAK 2: Dodeljujemo dane radnicima
      //  Prvo I smena, pa II smena
      // ======================================================
      
      const prvaSmena = radnici.filter(r => r.smjena === "I");
      const drugaSmena = radnici.filter(r => r.smjena === "II");
      
      let indexDana = 0;
      
      // Dodeljujemo I smeni
      const prvaSaDanima = prvaSmena.map((radnik) => {
        let dan = sviDani[indexDana];
        if (radnik.slobodniDan === dan && ukupno > 1) {
          dan = (dan + 1) % 7;
        }
        indexDana++;
        return { ...radnik, slobodniDan: dan };
      });
      
      // Dodeljujemo II smeni
      const drugaSaDanima = drugaSmena.map((radnik) => {
        let dan = sviDani[indexDana];
        if (radnik.slobodniDan === dan && ukupno > 1) {
          dan = (dan + 1) % 7;
        }
        indexDana++;
        return { ...radnik, slobodniDan: dan };
      });
      
      novi[sektor] = [...prvaSaDanima, ...drugaSaDanima];
    });
    
    return novi;
  });
};
  const resetujPodatke = () => {
    if (window.confirm("Resetovati SVE podatke na početne?")) {
      localStorage.removeItem('rasporedPodaci');
      setPodaci(POCETNI_PODACI);
      setWeekOffset(0);
      setDatumPrikaz(getWeekDates(0));
    }
  };

  const konobariRaspored = generisiRaspored(podaci.KONOBARI);
  const kuhinjaRaspored = generisiRaspored(podaci.KUHINJA);
  const sankRaspored = generisiRaspored(podaci.ŠANK);

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 8mm; }
          body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
          .no-print { display: none !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border: 1px solid black !important; }
          input, select { border: none !important; background: transparent !important; -webkit-appearance: none; -moz-appearance: none; font-size: 11px !important; font-weight: bold !important; color: black !important; }
          th { font-size: 10px !important; font-weight: bold !important; background-color: #E5E5E5 !important; }
          h2 { font-size: 13px !important; font-weight: bold !important; border-bottom: 2px solid black !important; }
        }
      `}</style>

      <div className="bg-white shadow-lg mb-4 no-print">
        <div className="max-w-full mx-auto p-3 sm:p-4">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold">📋 RASPORED SMJENA</h1>
              <p className="text-xs sm:text-sm text-gray-500">I smjena: 08:00-16:00 | II smjena: 16:00-00:00</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button onClick={() => promeniSedmicu(-1)} className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700">◀ Prethodna</button>
            <div className="bg-white border-2 border-gray-300 px-3 py-1.5 rounded font-bold text-sm min-w-[200px] text-center">📅 {datumPrikaz}</div>
            <button onClick={() => promeniSedmicu(1)} className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-700">Sledeća ▶</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => dodajRadnika('KONOBARI')} className="bg-green-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm hover:bg-green-700">+ Konobar</button>
            <button onClick={() => dodajRadnika('KUHINJA')} className="bg-green-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm hover:bg-green-700">+ Kuvar</button>
            <button onClick={() => dodajRadnika('ŠANK')} className="bg-green-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm hover:bg-green-700">+ Šanker</button>
            <button onClick={autoRasporedi} className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm hover:bg-blue-700 font-bold">🔄 Auto Raspored</button>
            <button onClick={resetujPodatke} className="bg-gray-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm hover:bg-gray-700">🔃 Reset</button>
            <button onClick={() => window.print()} className="bg-black text-white px-4 py-1.5 rounded text-xs sm:text-sm font-bold hover:bg-gray-800">🖨️ Štampaj A4</button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-2 sm:px-4 print:px-0">
        <div className="bg-white rounded-lg shadow print:shadow-none p-2 sm:p-4 print:p-0">
          <div className="hidden print:block text-center mb-2">
            <h1 style={{fontSize: '16px', fontWeight: 'bold'}}>RASPORED SMJENA</h1>
            <p style={{fontSize: '12px', fontWeight: 'bold'}}>{datumPrikaz}</p>
          </div>

          <SektorTabela sektor="KONOBARI" radnici={konobariRaspored} naslov="KONOBARI"
            onAzurirajIme={azurirajIme} onAzurirajSmjenu={azurirajSmjenu}
            onAzurirajDan={azurirajDan} onAzurirajPauzu={azurirajPauzu} />
          
          <SektorTabela sektor="KUHINJA" radnici={kuhinjaRaspored} naslov="KUHINJA"
            onAzurirajIme={azurirajIme} onAzurirajSmjenu={azurirajSmjenu}
            onAzurirajDan={azurirajDan} onAzurirajPauzu={azurirajPauzu} />
          
          <SektorTabela sektor="ŠANK" radnici={sankRaspored} naslov="ŠANK"
            onAzurirajIme={azurirajIme} onAzurirajSmjenu={azurirajSmjenu}
            onAzurirajDan={azurirajDan} onAzurirajPauzu={azurirajPauzu} />

          <div className="hidden print:block mt-2 pt-1 border-t border-black text-xs font-bold">
            I = Prva smjena &nbsp;&nbsp;|&nbsp;&nbsp; II = Druga smjena &nbsp;&nbsp;|&nbsp;&nbsp; OFF = Slobodan dan
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-2 sm:px-4 mt-4 no-print">
        <div className="bg-white rounded-lg shadow p-3 text-sm">
          <h3 className="font-bold mb-2">📌 Legenda:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div><span className="inline-block w-4 h-4 mr-2" style={{backgroundColor: '#3B82F6', border: '1px solid black'}}></span><strong>I</strong> = Prva smjena (08:00-16:00)</div>
            <div><span className="inline-block w-4 h-4 mr-2" style={{backgroundColor: '#22C55E', border: '1px solid black'}}></span><strong>II</strong> = Druga smjena (16:00-00:00)</div>
            <div><span className="inline-block w-4 h-4 mr-2" style={{backgroundColor: '#EF4444', border: '1px solid black'}}></span><strong>OFF</strong> = Slobodan dan</div>
          </div>
          <p className="mt-2 text-xs text-gray-500">💾 Podaci se automatski čuvaju | 📱 Možeš instalirati kao aplikaciju | 🔄 Auto Raspored - svi dani ravnomerno</p>
        </div>
      </div>
    </div>
  );
}
