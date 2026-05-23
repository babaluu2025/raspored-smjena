import { useState, useEffect, useRef } from 'react'

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
  
  const format = (d) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };
  
  return `${format(monday)} - ${format(sunday)}`;
}

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
    noviPodaci[sektor] = [...noviPodaci[sektor]];
    const radnik = { ...noviPodaci[sektor][index] };
    
    if (vrijednost === "OFF") {
      radnik.slobodniDan = DANI.indexOf(dan);
    } else {
      radnik.smjena = vrijednost;
    }
    
    noviPodaci[sektor][index] = radnik;
    setPodaci(noviPodaci);
  };

  const azurirajIme = (sektor, index, ime) => {
    const noviPodaci = { ...podaci };
    noviPodaci[sektor] = [...noviPodaci[sektor]];
    noviPodaci[sektor][index] = { ...noviPodaci[sektor][index], ime };
    setPodaci(noviPodaci);
  };

  const azurirajPauzu = (sektor, index, pauza) => {
    const noviPodaci = { ...podaci };
    noviPodaci[sektor] = [...noviPodaci[sektor]];
    noviPodaci[sektor][index] = { ...noviPodaci[sektor][index], pauza };
    setPodaci(noviPodaci);
  };

  const azurirajSmjenu = (sektor, index, smjena) => {
    const noviPodaci = { ...podaci };
    noviPodaci[sektor] = [...noviPodaci[sektor]];
    const radnik = { ...noviPodaci[sektor][index], smjena };
    
    if (smjena === "I") {
      radnik.pauza = PAUZE_PRVA[index % PAUZE_PRVA.length];
    } else {
      radnik.pauza = PAUZE_DRUGA[index % PAUZE_DRUGA.length];
    }
    
    noviPodaci[sektor][index] = radnik;
    setPodaci(noviPodaci);
  };

  const dodajRadnika = (sektor) => {
    const noviPodaci = { ...podaci };
    noviPodaci[sektor] = [...noviPodaci[sektor]];
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
    
    noviPodaci[sektor].push({
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
      noviPodaci[sektor] = noviPodaci[sektor].filter((_, i) => i !== index);
      setPodaci(noviPodaci);
    }
  };

  const autoRasporedi = () => {
    const noviPodaci = { ...podaci };
    Object.keys(noviPodaci).forEach(sektor => {
      noviPodaci[sektor] = noviPodaci[sektor].map((radnik, index) => ({
        ...radnik,
        slobodniDan: (index + weekOffset + 100) % 7
      }));
    });
    setPodaci(noviPodaci);
  };

  const resetujPodatke = () => {
    if (window.confirm("Sigurno želiš da resetuješ SVE podatke na početne?")) {
      localStorage.removeItem('rasporedPodaci');
      setPodaci(POCETNI_PODACI);
      setWeekOffset(0);
      setDatumPrikaz(getWeekDates(0));
    }
  };

  // Komponenta za tabelu - KORISTIMO useRef za inpute
  const TabelaSektora = ({ sektor, podaciSektora, naslov }) => {
    const radnici = generisiRaspored(podaciSektora);
    const inputRefs = useRef({});
    
    return (
      <div className="mb-4 print:mb-1">
        <h2 className="text-base font-bold mb-1 border-b-2 border-orange-800 pb-1 print:text-xs print:mb-0.5" 
            style={{color: '#8B4513'}}>
          {naslov}
        </h2>
        <table className="w-full border-collapse text-xs print:text-[8px]">
          <thead>
            <tr>
              <th className="border-2 border-orange-800 bg-orange-100 p-1.5 print:p-0.5 text-left min-w-[110px] print:min-w-[60px] font-bold"
                  style={{backgroundColor: '#F5DEB3', color: '#8B4513'}}>
                IME
              </th>
              <th className="border-2 border-orange-800 bg-orange-100 p-1.5 print:p-0.5 text-center min-w-[40px] print:min-w-[30px] font-bold"
                  style={{backgroundColor: '#F5DEB3', color: '#8B4513'}}>
                SM
              </th>
              {DANI.map(dan => (
                <th key={dan} 
                    className="border-2 border-orange-800 bg-orange-100 p-1.5 print:p-0.5 text-center min-w-[60px] print:min-w-[40px] font-bold text-[10px] print:text-[7px]"
                    style={{backgroundColor: '#F5DEB3', color: '#8B4513'}}>
                  {dan.substring(0, 3)}
                </th>
              ))}
              <th className="border-2 border-orange-800 bg-yellow-200 p-1.5 print:p-0.5 text-center min-w-[100px] print:min-w-[65px] font-bold text-[10px] print:text-[7px]"
                  style={{backgroundColor: '#FFD700', color: '#8B4513'}}>
                30 MIN PAUZA
              </th>
            </tr>
          </thead>
          <tbody>
            {radnici.map((radnik, index) => (
              <tr key={index}>
                <td className="border-2 border-orange-800 p-1 print:p-0.5 bg-white">
                  <input
                    ref={el => inputRefs.current[`${sektor}-${index}`] = el}
                    value={radnik.ime}
                    onChange={(e) => azurirajIme(sektor, index, e.target.value)}
                    onClick={(e) => e.target.select()}
                    className="w-full p-1 print:p-0.5 outline-none bg-transparent text-xs print:text-[7px] font-medium border-none"
                    placeholder="..."
                    style={{minHeight: '20px'}}
                  />
                </td>
                <td className="border-2 border-orange-800 p-0.5 text-center bg-white">
                  <select
                    value={radnik.smjena}
                    onChange={(e) => azurirajSmjenu(sektor, index, e.target.value)}
                    className="w-full p-1 print:p-0 text-center text-xs font-bold border-none outline-none bg-transparent print:text-[7px]"
                    style={{backgroundColor: radnik.smjena === 'I' ? '#E3F2FD' : '#E8F5E9'}}
                  >
                    <option value="I">I</option>
                    <option value="II">II</option>
                  </select>
                </td>
                {DANI.map(dan => {
                  const vrijednost = radnik.raspored[dan];
                  let bgColor = '#FFFFFF';
                  if (vrijednost === 'OFF') bgColor = '#FFE0E0';
                  else if (vrijednost === 'I') bgColor = '#E3F2FD';
                  else if (vrijednost === 'II') bgColor = '#E8F5E9';
                  
                  return (
                    <td key={dan} className="border-2 border-orange-800 p-0.5 text-center" 
                        style={{backgroundColor: bgColor}}>
                      <select
                        value={vrijednost}
                        onChange={(e) => azurirajDan(sektor, index, dan, e.target.value)}
                        className="w-full p-1 print:p-0 text-center text-xs font-bold border-none outline-none bg-transparent print:text-[7px]"
                      >
                        {SMJENE.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  );
                })}
                <td className="border-2 border-orange-800 p-0.5 bg-yellow-50">
                  <select
                    value={radnik.pauza}
                    onChange={(e) => azurirajPauzu(sektor, index, e.target.value)}
                    className="w-full p-1 print:p-0 bg-transparent text-xs print:text-[7px] border-none outline-none"
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
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          table {
            width: 100% !important;
            page-break-inside: avoid;
          }
          input, select {
            border: none !important;
            background: transparent !important;
            -webkit-appearance: none;
            -moz-appearance: none;
            font-size: 7px !important;
          }
          .border-2 {
            border-width: 2px !important;
          }
        }
      `}</style>

      {/* Header - ne štampa se */}
      <div className="bg-white shadow-lg mb-4 no-print">
        <div className="max-w-full mx-auto p-4">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">📋 RASPORED SMJENA</h1>
              <p className="text-sm text-gray-500">I smjena: 08:00-16:00 | II smjena: 16:00-00:00</p>
            </div>
          </div>
          
          {/* Datum navigacija */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <button 
              onClick={() => promeniSedmicu(-1)}
              className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700"
            >
              ◀ Prethodna
            </button>
            <div className="bg-white border-2 border-gray-300 px-4 py-2 rounded-lg font-bold text-sm min-w-[200px] text-center">
              📅 {datumPrikaz}
            </div>
            <button 
              onClick={() => promeniSedmicu(1)}
              className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700"
            >
              Sledeća ▶
            </button>
            <span className="text-xs text-gray-500 ml-2">
              (možeš kliknuti i direktno unositi datume)
            </span>
          </div>

          {/* Dugmad */}
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
              🔄 Auto Raspored
            </button>
            <button onClick={resetujPodatke} className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700">
              🔃 Reset
            </button>
            <button onClick={() => window.print()} className="bg-orange-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-900 font-bold">
              🖨️ Štampaj A4
            </button>
          </div>
        </div>
      </div>

      {/* Sadržaj za štampu - SVA 3 SEKTORA */}
      <div className="max-w-full mx-auto p-4 print:p-0">
        <div className="bg-white rounded-lg shadow print:shadow-none p-4 print:p-1">
          
          {/* Naslov u štampi */}
          <div className="hidden print:block text-center mb-2 border-b-2 border-orange-800 pb-1">
            <h1 className="text-base font-bold" style={{color: '#8B4513'}}>RASPORED SMJENA</h1>
            <p className="text-xs">I smjena: 08:00-16:00 | II smjena: 16:00-00:00</p>
            <p className="text-xs font-bold">{datumPrikaz}</p>
          </div>

          {/* Sva 3 sektora */}
          <TabelaSektora sektor="KONOBARI" podaciSektora={podaci.KONOBARI} naslov="KONOBARI" />
          <TabelaSektora sektor="KUHINJA" podaciSektora={podaci.KUHINJA} naslov="KUHINJA" />
          <TabelaSektora sektor="ŠANK" podaciSektora={podaci.ŠANK} naslov="ŠANK" />

          {/* Legenda u štampi */}
          <div className="hidden print:block mt-2 pt-1 border-t-2 border-orange-800 text-[7px]">
            <strong>I</strong> = Prva smjena (08:00-16:00) | <strong>II</strong> = Druga smjena (16:00-00:00) | <strong>OFF</strong> = Slobodan dan
          </div>
        </div>
      </div>

      {/* Legenda na ekranu */}
      <div className="max-w-full mx-auto p-4 no-print">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold mb-2">📌 Legenda:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div><span className="inline-block w-4 h-4 bg-blue-100 border-2 border-orange-800 mr-2"></span>
              <strong>I</strong> = Prva smjena (08:00-16:00)</div>
            <div><span className="inline-block w-4 h-4 bg-green-100 border-2 border-orange-800 mr-2"></span>
              <strong>II</strong> = Druga smjena (16:00-00:00)</div>
            <div><span className="inline-block w-4 h-4 bg-red-100 border-2 border-orange-800 mr-2"></span>
              <strong>OFF</strong> = Slobodan dan</div>
          </div>
        </div>
      </div>
    </div>
  );
}
