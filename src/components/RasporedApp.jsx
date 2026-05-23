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

  const TabelaSektora = ({ sektor, podaciSektora, naslov }) => {
    const radnici = generisiRaspored(podaciSektora);
    
    return (
      <div className="mb-3 print:mb-2">
        {/* Naslov sekcije */}
        <h2 className="text-sm font-bold mb-1 pb-1 text-center uppercase tracking-wider"
            style={{
              borderBottom: '2px solid black',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
          {naslov}
        </h2>
        
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-black bg-gray-100 p-1.5 text-left font-bold"
                  style={{
                    border: '1px solid black',
                    backgroundColor: '#E5E5E5',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    padding: '4px 6px'
                  }}>
                IME
              </th>
              <th className="border border-black bg-gray-100 p-1.5 text-center font-bold"
                  style={{
                    border: '1px solid black',
                    backgroundColor: '#E5E5E5',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '4px 4px',
                    width: '40px'
                  }}>
                SM
              </th>
              {DANI.map(dan => (
                <th key={dan} 
                    className="border border-black bg-gray-100 p-1.5 text-center font-bold"
                    style={{
                      border: '1px solid black',
                      backgroundColor: '#E5E5E5',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '4px 4px'
                    }}>
                  {dan.substring(0, 3)}
                </th>
              ))}
              <th className="border border-black bg-yellow-200 p-1.5 text-center font-bold"
                  style={{
                    border: '1px solid black',
                    backgroundColor: '#FFF3CD',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    padding: '4px 6px'
                  }}>
                30 MIN PAUZA
              </th>
            </tr>
          </thead>
          <tbody>
            {radnici.map((radnik, index) => (
              <tr key={index}>
                <td className="border border-black p-1.5 bg-white"
                    style={{
                      border: '1px solid black',
                      padding: '3px 6px'
                    }}>
                  <input
                    value={radnik.ime}
                    onChange={(e) => azurirajIme(sektor, index, e.target.value)}
                    onClick={(e) => e.target.select()}
                    className="w-full outline-none bg-transparent font-bold border-none"
                    placeholder="..."
                    style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      minHeight: '18px'
                    }}
                  />
                </td>
                <td className="border border-black p-1 text-center bg-white"
                    style={{
                      border: '1px solid black',
                      padding: '2px'
                    }}>
                  <select
                    value={radnik.smjena}
                    onChange={(e) => azurirajSmjenu(sektor, index, e.target.value)}
                    className="w-full text-center font-bold border-none outline-none bg-transparent"
                    style={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: radnik.smjena === 'I' ? '#DBEAFE' : '#DCFCE7'
                    }}
                  >
                    <option value="I">I</option>
                    <option value="II">II</option>
                  </select>
                </td>
                {DANI.map(dan => {
                  const vrijednost = radnik.raspored[dan];
                  let bgColor = '#FFFFFF';
                  if (vrijednost === 'OFF') bgColor = '#FEE2E2';
                  else if (vrijednost === 'I') bgColor = '#DBEAFE';
                  else if (vrijednost === 'II') bgColor = '#DCFCE7';
                  
                  return (
                    <td key={dan} 
                        className="border border-black p-1 text-center"
                        style={{
                          border: '1px solid black',
                          padding: '2px',
                          backgroundColor: bgColor
                        }}>
                      <select
                        value={vrijednost}
                        onChange={(e) => azurirajDan(sektor, index, dan, e.target.value)}
                        className="w-full text-center font-bold border-none outline-none bg-transparent"
                        style={{
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}
                      >
                        {SMJENE.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  );
                })}
                <td className="border border-black p-1 bg-yellow-50"
                    style={{
                      border: '1px solid black',
                      padding: '2px 4px',
                      backgroundColor: '#FFFBEB'
                    }}>
                  <select
                    value={radnik.pauza}
                    onChange={(e) => azurirajPauzu(sektor, index, e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-bold"
                    style={{
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
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
      {/* STILOVI ZA ŠTAMPU */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          
          body {
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          
          /* SVI BORDERI CRNI */
          table, th, td {
            border: 1px solid black !important;
          }
          
          /* VEĆI FONT U ŠTAMPI */
          input, select {
            border: none !important;
            background: transparent !important;
            -webkit-appearance: none;
            -moz-appearance: none;
            font-size: 12px !important;
            font-weight: bold !important;
            color: black !important;
          }
          
          th {
            font-size: 11px !important;
            font-weight: bold !important;
            background-color: #E5E5E5 !important;
            color: black !important;
          }
          
          td {
            font-size: 11px !important;
            padding: 3px !important;
          }
          
          h2 {
            font-size: 14px !important;
            font-weight: bold !important;
            border-bottom: 2px solid black !important;
            margin-bottom: 4px !important;
            padding-bottom: 2px !important;
          }
          
          .print-title {
            font-size: 16px !important;
            font-weight: bold !important;
            margin-bottom: 4px !important;
          }
          
          .print-subtitle {
            font-size: 12px !important;
            font-weight: bold !important;
            margin-bottom: 2px !important;
          }
        }
      `}</style>

      {/* HEADER - NE ŠTAMPA SE */}
      <div className="bg-white shadow-lg mb-4 no-print">
        <div className="max-w-full mx-auto p-4">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">📋 RASPORED SMJENA</h1>
              <p className="text-sm text-gray-500">I smjena: 08:00-16:00 | II smjena: 16:00-00:00</p>
            </div>
          </div>
          
          {/* DATUM NAVIGACIJA */}
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
          </div>

          {/* DUGMAD */}
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
            <button onClick={() => window.print()} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 font-bold">
              🖨️ Štampaj A4
            </button>
          </div>
        </div>
      </div>

      {/* SADRŽAJ ZA ŠTAMPU */}
      <div className="max-w-full mx-auto p-4 print:p-0">
        <div className="bg-white rounded-lg shadow print:shadow-none p-4 print:p-0">
          
          {/* NASLOV U ŠTAMPI */}
          <div className="hidden print:block text-center mb-3">
            <h1 className="print-title" style={{fontSize: '16px', fontWeight: 'bold'}}>
              RASPORED SMJENA
            </h1>
            <p className="print-subtitle" style={{fontSize: '12px', fontWeight: 'bold'}}>
              {datumPrikaz}
            </p>
          </div>

          {/* SVA 3 SEKTORA */}
          <TabelaSektora sektor="KONOBARI" podaciSektora={podaci.KONOBARI} naslov="KONOBARI" />
          <TabelaSektora sektor="KUHINJA" podaciSektora={podaci.KUHINJA} naslov="KUHINJA" />
          <TabelaSektora sektor="ŠANK" podaciSektora={podaci.ŠANK} naslov="ŠANK" />

          {/* LEGENDA U ŠTAMPI - SAMO OSNOVNO */}
          <div className="hidden print:block mt-2 pt-1" 
               style={{
                 borderTop: '1px solid black',
                 fontSize: '11px',
                 fontWeight: 'bold'
               }}>
            <strong>I</strong> = Prva smjena &nbsp;&nbsp;|&nbsp;&nbsp; 
            <strong>II</strong> = Druga smjena &nbsp;&nbsp;|&nbsp;&nbsp; 
            <strong>OFF</strong> = Slobodan dan
          </div>
        </div>
      </div>

      {/* LEGENDA NA EKRANU */}
      <div className="max-w-full mx-auto p-4 no-print">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold mb-2">📌 Legenda:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="inline-block w-4 h-4 bg-blue-200 border border-black mr-2"></span>
              <strong>I</strong> = Prva smjena (08:00-16:00)
            </div>
            <div>
              <span className="inline-block w-4 h-4 bg-green-200 border border-black mr-2"></span>
              <strong>II</strong> = Druga smjena (16:00-00:00)
            </div>
            <div>
              <span className="inline-block w-4 h-4 bg-red-200 border border-black mr-2"></span>
              <strong>OFF</strong> = Slobodan dan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
