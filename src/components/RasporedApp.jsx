import { useState, useEffect, useCallback } from 'react'

const DANI = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];
const SMJENE = ["I", "II", "OFF"];

const PAUZE_PRVA = [
  "09:00-09:30", "09:30-10:00", "10:00-10:30", "10:30-11:00",
  "11:00-11:30", "11:30-12:00", "12:00-12:30", "12:30-13:00"
];

const PAUZE_DRUGA = [
  "17:00-17:30", "17:30-18:00", "18:00-18:30", "18:30-19:00",
  "19:00-19:30", "19:30-20:00", "20:00-20:30", "20:30-21:00",
  "21:00-21:30", "21:30-22:00", "22:00-22:30"
];

const POCETNI_PODACI = {
  KONOBARI: [
    { ime: "Aleksa", smjena: "I", pauza: "09:30-10:00", slobodniDan: 2 },
    { ime: "Goran.S", smjena: "I", pauza: "11:30-12:00", slobodniDan: 3 },
    { ime: "Novo.O", smjena: "I", pauza: "12:00-12:30", slobodniDan: 4 },
    { ime: "Slobo", smjena: "I", pauza: "10:30-11:00", slobodniDan: 5 },
    { ime: "Janko.J", smjena: "I", pauza: "09:00-09:30", slobodniDan: 6 },
    { ime: "Jašović G", smjena: "I", pauza: "11:00-11:30", slobodniDan: 7 },
    { ime: "Balša", smjena: "I", pauza: "10:00-10:30", slobodniDan: 1 },
    { ime: "Jovan", smjena: "II", pauza: "17:00-17:30", slobodniDan: 4 },
    { ime: "Miloš Z", smjena: "II", pauza: "17:30-18:00", slobodniDan: 5 },
    { ime: "Marko P", smjena: "II", pauza: "18:00-18:30", slobodniDan: 6 },
    { ime: "Sreten", smjena: "II", pauza: "18:30-19:00", slobodniDan: 7 },
    { ime: "Ranko", smjena: "II", pauza: "19:00-19:30", slobodniDan: 1 },
    { ime: "Božo.B", smjena: "II", pauza: "19:30-20:00", slobodniDan: 2 },
    { ime: "Deni.P", smjena: "II", pauza: "20:00-20:30", slobodniDan: 3 },
  ],
  KUHINJA: [
    { ime: "Mira", smjena: "I", pauza: "09:00-09:30", slobodniDan: 2 },
    { ime: "Miroslav", smjena: "I", pauza: "09:30-10:00", slobodniDan: 6 },
    { ime: "Slavica.A", smjena: "I", pauza: "10:00-10:30", slobodniDan: 7 },
    { ime: "Lidija", smjena: "I", pauza: "10:30-11:00", slobodniDan: 1 },
    { ime: "Dragan", smjena: "I", pauza: "11:00-11:30", slobodniDan: 3 },
    { ime: "Aziz", smjena: "I", pauza: "11:30-12:00", slobodniDan: 4 },
    { ime: "Gavrilo.M", smjena: "I", pauza: "12:00-12:30", slobodniDan: 5 },
    { ime: "Alik", smjena: "I", pauza: "12:30-13:00", slobodniDan: 6 },
    { ime: "Nataša", smjena: "II", pauza: "21:00-21:30", slobodniDan: 1 },
    { ime: "Zoja.V", smjena: "II", pauza: "19:00-19:30", slobodniDan: 2 },
    { ime: "Mia.V", smjena: "II", pauza: "22:00-22:30", slobodniDan: 3 },
    { ime: "Ivana.M", smjena: "II", pauza: "19:30-20:00", slobodniDan: 4 },
    { ime: "Kristina.V", smjena: "II", pauza: "17:00-17:30", slobodniDan: 5 },
    { ime: "Jovana.N", smjena: "II", pauza: "20:00-20:30", slobodniDan: 7 },
    { ime: "Vesna I", smjena: "II", pauza: "18:00-18:30", slobodniDan: 1 },
    { ime: "Nevena", smjena: "II", pauza: "20:30-21:00", slobodniDan: 2 },
  ],
  ŠANK: [
    { ime: "Nikola.D", smjena: "I", pauza: "10:00-10:30", slobodniDan: 5 },
    { ime: "Nikola.M", smjena: "I", pauza: "09:30-10:00", slobodniDan: 7 },
    { ime: "Radovan", smjena: "I", pauza: "09:00-09:30", slobodniDan: 6 },
    { ime: "Nikola.P", smjena: "I", pauza: "10:30-11:00", slobodniDan: 4 },
    { ime: "Aco.K", smjena: "II", pauza: "17:30-18:00", slobodniDan: 3 },
    { ime: "Bojan.N", smjena: "II", pauza: "18:00-18:30", slobodniDan: 2 },
    { ime: "Radoš.K", smjena: "II", pauza: "18:00-18:30", slobodniDan: 1 },
    { ime: "Ratko.K", smjena: "II", pauza: "18:30-19:00", slobodniDan: 1 },
  ]
};

function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1 + (offset * 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  return `${fmt(monday)} - ${fmt(sunday)}`;
}

const SektorTabela = ({ radnici, naslov, onAzurirajIme, onAzurirajSmjenu, onAzurirajDan, onAzurirajPauzu, onObrisi, onDodaj, sektor }) => {
  return (
    <div className="mb-1 print:mb-0.5">
      <div className="flex justify-between items-center mb-0.5">
        <span className="font-bold uppercase" style={{fontSize:'9px'}}>{naslov} ({radnici.length})</span>
        <button onClick={() => onDodaj(sektor)} className="no-print bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] leading-none">+</button>
      </div>
      <table className="w-full border-collapse" style={{fontSize:'7px'}}>
        <thead>
          <tr>
            <th className="border border-black bg-gray-200 p-0.5 text-left font-bold" style={{fontSize:'7px', minWidth:'55px'}}>IME</th>
            <th className="border border-black bg-gray-200 p-0.5 text-center font-bold" style={{fontSize:'7px', width:'22px'}}>SM</th>
            {DANI.map(dan => (
              <th key={dan} className="border border-black bg-gray-200 p-0.5 text-center font-bold" style={{fontSize:'7px', width:'28px'}}>{dan}</th>
            ))}
            <th className="border border-black bg-yellow-200 p-0.5 text-center font-bold" style={{fontSize:'7px', minWidth:'65px'}}>PAUZA</th>
            <th className="border border-black bg-gray-200 p-0.5 text-center no-print" style={{fontSize:'7px', width:'16px'}}></th>
          </tr>
        </thead>
        <tbody>
          {radnici.map((radnik, index) => (
            <tr key={index}>
              <td className="border border-black p-0.5 bg-white">
                <input value={radnik.ime} onChange={(e) => onAzurirajIme(sektor, index, e.target.value)}
                  className="w-full outline-none bg-transparent font-bold border-none" placeholder="..." style={{fontSize:'7px', minHeight:'14px'}} />
              </td>
              <td className="border border-black p-0 text-center" style={{backgroundColor: radnik.smjena === 'I' ? '#3B82F6' : '#22C55E'}}>
                <select value={radnik.smjena} onChange={(e) => onAzurirajSmjenu(sektor, index, e.target.value)}
                  className="w-full text-center font-bold border-none outline-none" style={{fontSize:'7px', backgroundColor:'transparent', color:'white'}}>
                  <option value="I" style={{color:'black'}}>I</option>
                  <option value="II" style={{color:'black'}}>II</option>
                </select>
              </td>
              {DANI.map(dan => {
                const val = radnik.raspored[dan];
                let bg = '#FFFFFF', tc = '#000000';
                if (val === 'OFF') { bg = '#EF4444'; tc = '#FFFFFF'; }
                else if (val === 'I') { bg = '#3B82F6'; tc = '#FFFFFF'; }
                else if (val === 'II') { bg = '#22C55E'; tc = '#FFFFFF'; }
                return (
                  <td key={dan} className="border border-black p-0 text-center" style={{backgroundColor: bg}}>
                    <select value={val} onChange={(e) => onAzurirajDan(sektor, index, dan, e.target.value)}
                      className="w-full text-center font-bold border-none outline-none" style={{fontSize:'7px', backgroundColor:'transparent', color: tc}}>
                      {SMJENE.map(s => <option key={s} value={s} style={{color:'black'}}>{s}</option>)}
                    </select>
                  </td>
                );
              })}
              <td className="border border-black p-0.5 bg-yellow-50">
                <select value={radnik.pauza} onChange={(e) => onAzurirajPauzu(sektor, index, e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-bold" style={{fontSize:'6px', textAlignLast:'center'}}>
                  {(radnik.smjena === "I" ? PAUZE_PRVA : PAUZE_DRUGA).map(p => <option key={p} value={p} style={{fontSize:'6px'}}>{p}</option>)}
                </select>
              </td>
              <td className="border border-black p-0 text-center no-print">
                <button onClick={() => onObrisi(sektor, index)} className="text-red-500 font-bold" style={{fontSize:'8px'}}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      radnik.pauza = smjena === "I" ? PAUZE_PRVA[index % PAUZE_PRVA.length] : PAUZE_DRUGA[index % PAUZE_DRUGA.length];
      novi[sektor][index] = radnik;
      return novi;
    });
  }, []);

  const azurirajDan = useCallback((sektor, index, dan, vrijednost) => {
    setPodaci(prev => {
      const novi = { ...prev };
      novi[sektor] = [...novi[sektor]];
      const radnik = { ...novi[sektor][index] };
      if (vrijednost === "OFF") radnik.slobodniDan = DANI.indexOf(dan);
      else radnik.smjena = vrijednost;
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
      const prva = novi[sektor].filter(r => r.smjena === "I").length;
      const druga = novi[sektor].filter(r => r.smjena === "II").length;
      const smjena = prva <= druga ? "I" : "II";
      const pauza = smjena === "I" ? PAUZE_PRVA[prva % PAUZE_PRVA.length] : PAUZE_DRUGA[druga % PAUZE_DRUGA.length];
      novi[sektor].push({ ime: "", smjena, pauza, slobodniDan: novi[sektor].length % 7 });
      return novi;
    });
  };

  const obrisiRadnika = (sektor, index) => {
    if (window.confirm("Obrisati?")) {
      setPodaci(prev => {
        const novi = { ...prev };
        novi[sektor] = novi[sektor].filter((_, i) => i !== index);
        return novi;
      });
    }
  };

  const resetujPodatke = () => {
    if (window.confirm("Resetovati SVE?")) {
      localStorage.removeItem('rasporedPodaci');
      setPodaci(POCETNI_PODACI);
    }
  };

  const konobariRaspored = generisiRaspored(podaci.KONOBARI);
  const kuhinjaRaspored = generisiRaspored(podaci.KUHINJA);
  const sankRaspored = generisiRaspored(podaci.ŠANK);

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 5mm; }
          body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          table { border-collapse: collapse !important; width: 100% !important; }
          th, td { border: 1px solid black !important; padding: 1px !important; }
          input, select { border: none !important; background: transparent !important; -webkit-appearance: none; font-size: 6px !important; font-weight: bold !important; }
          th { font-size: 7px !important; background-color: #E5E5E5 !important; }
        }
      `}</style>

      <div className="bg-white shadow mb-2 no-print">
        <div className="max-w-full mx-auto p-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold">📋 Raspored</h1>
            <button onClick={() => promeniSedmicu(-1)} className="bg-gray-600 text-white px-2 py-1 rounded text-xs">◀</button>
            <span className="font-bold text-xs">{datumPrikaz}</span>
            <button onClick={() => promeniSedmicu(1)} className="bg-gray-600 text-white px-2 py-1 rounded text-xs">▶</button>
            <button onClick={resetujPodatke} className="bg-gray-500 text-white px-2 py-1 rounded text-xs">Reset</button>
            <button onClick={() => window.print()} className="bg-black text-white px-3 py-1 rounded text-xs font-bold">🖨️ Štampaj</button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-1 print:px-0">
        <div className="bg-white rounded shadow print:shadow-none p-1 print:p-0">
          <div className="hidden print:block text-center mb-1">
            <span style={{fontSize:'10px', fontWeight:'bold'}}>RASPORED SMJENA - {datumPrikaz}</span>
          </div>

          <SektorTabela sektor="KONOBARI" radnici={konobariRaspored} naslov="KONOBARI"
            onAzurirajIme={azurirajIme} onAzurirajSmjenu={azurirajSmjenu}
            onAzurirajDan={azurirajDan} onAzurirajPauzu={azurirajPauzu} onObrisi={obrisiRadnika} onDodaj={dodajRadnika} />
          
          <SektorTabela sektor="KUHINJA" radnici={kuhinjaRaspored} naslov="KUHINJA"
            onAzurirajIme={azurirajIme} onAzurirajSmjenu={azurirajSmjenu}
            onAzurirajDan={azurirajDan} onAzurirajPauzu={azurirajPauzu} onObrisi={obrisiRadnika} onDodaj={dodajRadnika} />
          
          <SektorTabela sektor="ŠANK" radnici={sankRaspored} naslov="ŠANK"
            onAzurirajIme={azurirajIme} onAzurirajSmjenu={azurirajSmjenu}
            onAzurirajDan={azurirajDan} onAzurirajPauzu={azurirajPauzu} onObrisi={obrisiRadnika} onDodaj={dodajRadnika} />

          <div className="hidden print:block text-center mt-1" style={{fontSize:'7px', fontWeight:'bold'}}>
            I = Prva smjena (08-16h) | II = Druga smjena (16-00h) | OFF = Slobodan dan
          </div>
        </div>
      </div>
    </div>
  );
}
