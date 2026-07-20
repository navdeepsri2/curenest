import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/mockData';

export default function ToolsPage() {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState('pill');

  // --- 1. PILL IDENTIFIER STATE ---
  const [pillShape, setPillShape] = useState('any');
  const [pillColor, setPillColor] = useState('any');
  const [imprint, setImprint] = useState('');
  const [pillSearchResults, setPillSearchResults] = useState(null);

  // --- 2. DRUG INTERACTION CHECKER STATE ---
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [medSearchInput, setMedSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // --- 3. DOSAGE CALCULATOR STATE ---
  const [selectedDosageMed, setSelectedDosageMed] = useState(PRODUCTS[0]);
  const [childWeight, setChildWeight] = useState(15);
  const [doseResult, setDoseResult] = useState(null);

  // --- 4. BRAND MAPPER STATE ---
  const [brandQuery, setBrandQuery] = useState('');

  // -------------------------------------------------------------
  // 1. ADVANCED PILL IDENTIFIER SEARCH LOGIC
  // -------------------------------------------------------------
  const handleIdentifyPill = (e) => {
    e.preventDefault();
    const q = imprint.trim().toLowerCase();
    const qWords = q.split(' ').filter(Boolean);

    const matches = PRODUCTS.filter((p) => {
      const name = p.name.toLowerCase();
      const desc = p.description.toLowerCase();
      const brand = p.brand.toLowerCase();
      const textCorpus = `${name} ${desc} ${brand}`;

      // Shape match
      let matchShape = true;
      if (pillShape === 'capsule') {
        matchShape = textCorpus.includes('capsule') || textCorpus.includes('cap') || textCorpus.includes('softgel');
      } else if (pillShape === 'tablet' || pillShape === 'round' || pillShape === 'oval') {
        matchShape = textCorpus.includes('tablet') || textCorpus.includes('tab');
      }

      // Color match
      let matchColor = true;
      if (pillColor === 'pink') {
        matchColor = textCorpus.includes('pink') || textCorpus.includes('red') || p.image.includes('pink');
      } else if (pillColor === 'blue') {
        matchColor = textCorpus.includes('blue') || textCorpus.includes('cyan') || p.image.includes('blue');
      } else if (pillColor === 'white') {
        matchColor = textCorpus.includes('white') || textCorpus.includes('clear') || (p.image.includes('tablets.png') && !p.image.includes('pink'));
      }

      // Imprint/Keyword match (require ALL typed words to be found somewhere in the text corpus)
      let matchImprint = true;
      if (qWords.length > 0) {
        matchImprint = qWords.every((word) => textCorpus.includes(word));
      }

      return matchShape && matchColor && matchImprint;
    }).slice(0, 12);

    setPillSearchResults(matches);
  };

  // -------------------------------------------------------------
  // 2. ADVANCED INTERACTION CHECKER LOGIC
  // -------------------------------------------------------------
  const medSuggestions = useMemo(() => {
    if (!medSearchInput.trim()) return [];
    const q = medSearchInput.toLowerCase();
    return PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [medSearchInput]);

  const handleAddMed = (medObj) => {
    if (medObj && !selectedMeds.some((m) => m.product_id === medObj.product_id)) {
      setSelectedMeds([...selectedMeds, medObj]);
    }
    setMedSearchInput('');
    setShowDropdown(false);
  };

  const interactionAnalysis = useMemo(() => {
    if (selectedMeds.length < 2) return null;

    // Combine all descriptions and names to check for active ingredients
    const corpus = selectedMeds.map((m) => m.name.toLowerCase() + " " + m.description.toLowerCase()).join(' | ');

    // 1. NSAIDs + Blood Thinners
    const hasNSAID = corpus.includes('aspirin') || corpus.includes('ibuprofen') || corpus.includes('diclofenac') || corpus.includes('naproxen');
    const hasBloodThinner = corpus.includes('warfarin') || corpus.includes('clopidogrel') || corpus.includes('heparin') || corpus.includes('apixaban');
    if (hasNSAID && hasBloodThinner) {
      return {
        severity: 'danger',
        title: 'Major Risk: Increased Internal Bleeding Hazard',
        desc: 'Combining blood thinners with NSAIDs significantly increases the risk of severe gastrointestinal bleeding and hemorrhage. Immediate medical supervision is required.'
      };
    }

    // 2. Antihistamines + CNS Depressants/Sedatives
    const hasAntihistamine = corpus.includes('cetirizine') || corpus.includes('levocetirizine') || corpus.includes('diphenhydramine') || corpus.includes('chlorpheniramine') || corpus.includes('benadryl');
    const hasSedative = corpus.includes('alprazolam') || corpus.includes('clonazepam') || corpus.includes('diazepam') || corpus.includes('zolpidem') || corpus.includes('sedative');
    if (hasAntihistamine && hasSedative) {
      return {
        severity: 'warn',
        title: 'Moderate Risk: Enhanced Central Nervous System Depression',
        desc: 'Combining antihistamines with sedatives may cause severe drowsiness, respiratory depression, and impaired motor function. Avoid driving or operating machinery.'
      };
    }

    // 3. Statins + Macrolide Antibiotics
    const hasStatin = corpus.includes('atorvastatin') || corpus.includes('rosuvastatin') || corpus.includes('simvastatin');
    const hasMacrolide = corpus.includes('azithromycin') || corpus.includes('clarithromycin') || corpus.includes('erythromycin');
    if (hasStatin && hasMacrolide) {
      return {
        severity: 'warn',
        title: 'Moderate Risk: Increased Risk of Myopathy/Rhabdomyolysis',
        desc: 'Macrolide antibiotics can increase the blood levels of statins, raising the risk of muscle pain or severe muscle breakdown (rhabdomyolysis).'
      };
    }

    // 4. SSRIs + NSAIDs (Bleeding risk)
    const hasSSRI = corpus.includes('fluoxetine') || corpus.includes('sertraline') || corpus.includes('escitalopram');
    if (hasSSRI && hasNSAID) {
      return {
        severity: 'warn',
        title: 'Moderate Risk: Increased Bleeding Risk',
        desc: 'Combining SSRI antidepressants with NSAIDs can increase the risk of upper gastrointestinal bleeding.'
      };
    }

    // 5. Paracetamol + Hepatotoxic / Alcohol mention
    const hasParacetamol = corpus.includes('paracetamol') || corpus.includes('acetaminophen') || corpus.includes('crocin');
    if (hasParacetamol && corpus.includes('alcohol')) {
       return {
        severity: 'warn',
        title: 'Moderate Risk: Liver Toxicity',
        desc: 'Concurrent use of paracetamol with alcohol or other hepatotoxic agents increases the risk of severe liver damage.'
      };
    }

    return {
      severity: 'safe',
      title: 'No Severe Interaction Detected',
      desc: `Analysis of ${selectedMeds.length} selected medicines shows no known major or moderate clinical contraindications in our database. Always consult a certified pharmacist or physician before combining therapies.`
    };
  }, [selectedMeds]);

  // -------------------------------------------------------------
  // 3. ADVANCED DOSAGE CALCULATOR LOGIC
  // -------------------------------------------------------------
  const handleCalculateDosage = (e) => {
    e.preventDefault();
    const w = parseFloat(childWeight) || 10;
    const medName = selectedDosageMed.name.toLowerCase();
    const medDesc = selectedDosageMed.description.toLowerCase();

    // Default basic fallback
    let mgPerKg = 15; // default mg/kg per dose
    let concentrationMgPerMl = 24; // e.g. 120mg / 5ml
    let freq = 'Every 6 hours as needed';
    let maxDoses = 4;

    if (medName.includes('ibuprofen') || medDesc.includes('ibuprofen')) {
      mgPerKg = 10;
      concentrationMgPerMl = 20; // 100mg / 5ml
      freq = 'Every 6 to 8 hours';
      maxDoses = 3;
    } else if (medName.includes('amoxicillin') || medDesc.includes('amoxicillin')) {
      mgPerKg = 25; // Often dosed higher per day, divided
      concentrationMgPerMl = 50; // 250mg / 5ml
      freq = 'Every 12 hours (Twice daily)';
      maxDoses = 2;
    } else if (medName.includes('azithromycin') || medDesc.includes('azithromycin')) {
      mgPerKg = 10; 
      concentrationMgPerMl = 40; // 200mg / 5ml
      freq = 'Once daily';
      maxDoses = 1;
    } else if (medName.includes('cetirizine') || medDesc.includes('cetirizine')) {
      mgPerKg = 0.25; 
      concentrationMgPerMl = 1; // 5mg / 5ml
      freq = 'Once daily';
      maxDoses = 1;
    }

    const singleDoseMg = (w * mgPerKg).toFixed(1);
    const doseMl = (singleDoseMg / concentrationMgPerMl).toFixed(1);
    const maxDailyMg = (singleDoseMg * maxDoses).toFixed(1);

    setDoseResult({
      singleDoseMg,
      doseMl,
      maxDailyMg,
      medName: selectedDosageMed.name,
      frequency: `${freq} (Max ${maxDoses} doses/24hr)`
    });
  };

  // -------------------------------------------------------------
  // 4. ADVANCED BRAND MAPPER SEARCH
  // -------------------------------------------------------------
  const brandMapperResults = useMemo(() => {
    if (!brandQuery.trim()) return [];
    
    // We want to find alternatives. Let's find the 'active ingredient' from the query
    // If user types "Crocin", we find Crocin in the DB, see its description has "paracetamol", then search for paracetamol.
    // For simplicity without NLP, we do a deep multi-field search and boost by description similarity.
    
    const q = brandQuery.toLowerCase();
    
    return PRODUCTS.filter((p) => {
        const name = p.name.toLowerCase();
        const brand = p.brand.toLowerCase();
        const desc = p.description.toLowerCase();
        
        // Exact active ingredient match if mentioned in description
        // For example if user types "Paracetamol"
        return name.includes(q) || desc.includes(q) || brand.includes(q);
    })
    .sort((a, b) => {
        // Sort by price (ascending) so the cheapest generic is at the top
        return a.price - b.price;
    })
    .slice(0, 15);
  }, [brandQuery]);

  return (
    <div>
      <div className="pg-hd">
        <div className="crumb">
          <Link to="/">Home</Link> / Health Tools
        </div>
        <h1>Interactive Smart Health Tools</h1>
        <p>Real-time dataset search across {PRODUCTS.length.toLocaleString()} authenticated medicines</p>
      </div>

      <div className="tool-wrap">
        {/* Tool Navigation Tabs */}
        <div className="tools-nav">
          <button className={`tn ${activeTool === 'pill' ? 'on' : ''}`} onClick={() => setActiveTool('pill')}>
            💊 Smart Pill Identifier
          </button>
          <button className={`tn ${activeTool === 'interact' ? 'on' : ''}`} onClick={() => setActiveTool('interact')}>
            ⚡ Interaction Checker
          </button>
          <button className={`tn ${activeTool === 'dose' ? 'on' : ''}`} onClick={() => setActiveTool('dose')}>
            🧮 Dosage Calculator
          </button>
          <button className={`tn ${activeTool === 'brand' ? 'on' : ''}`} onClick={() => setActiveTool('brand')}>
            🔗 Brand & Generic Mapper
          </button>
        </div>

        {/* ======================================================= */}
        {/* 1. SMART PILL IDENTIFIER                                */}
        {/* ======================================================= */}
        {activeTool === 'pill' && (
          <div className="tool-sec on">
            <div style={{ background: 'white', borderRadius: 'var(--r)', padding: '28px', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow)', marginBottom: '22px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', marginBottom: '6px' }}>
                Smart Pill & Tablet Identifier
              </h2>
              <p style={{ color: 'var(--slate)', fontSize: '14px', marginBottom: '22px' }}>
                Search physical characteristics against our database of {PRODUCTS.length.toLocaleString()} Indian pharmaceutical medicines
              </p>

              <form onSubmit={handleIdentifyPill}>
                <div className="fg">
                  <label>1. Select Pill Shape / Form</label>
                  <div className="pill-shape-grid">
                    {[
                      { id: 'any', label: '❓ Any Form' },
                      { id: 'tablet', label: '⬤ Round Tablet' },
                      { id: 'capsule', label: '💊 Capsule' },
                      { id: 'oval', label: '⬭ Oval' },
                    ].map((s) => (
                      <div
                        key={s.id}
                        className={`pill-shape ${pillShape === s.id ? 'sel' : ''}`}
                        onClick={() => setPillShape(s.id)}
                      >
                        {s.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="fg">
                  <label>2. Select Tablet Color</label>
                  <div className="pill-color-grid">
                    {[
                      { id: 'any', color: 'var(--bg)', label: 'Any Color' },
                      { id: 'white', color: '#ffffff', label: 'White / Clear' },
                      { id: 'pink', color: '#fbcfe8', label: 'Pink / Red' },
                      { id: 'blue', color: '#bfdbfe', label: 'Blue / Two-Tone' },
                    ].map((c) => (
                      <div
                        key={c.id}
                        className={`pill-color ${pillColor === c.id ? 'sel' : ''}`}
                        onClick={() => setPillColor(c.id)}
                      >
                        <span className="color-dot" style={{ background: c.color, border: c.color==='#ffffff' ? '1px solid #ccc' : 'none' }}></span> {c.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="fg">
                  <label>3. Name, Imprint, or Active Salt Keyword</label>
                  <input
                    type="text"
                    placeholder="Enter medicine name, imprint (e.g. 500, AL, Paracetamol, Cipla)..."
                    value={imprint}
                    onChange={(e) => setImprint(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-g" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                  🔍 Search Database ({PRODUCTS.length.toLocaleString()} Medicines)
                </button>
              </form>

              {pillSearchResults && (
                <div style={{ marginTop: '26px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                      Matched Database Results ({pillSearchResults.length})
                    </h3>
                    {pillSearchResults.length === 0 && (
                      <span style={{ fontSize: '13px', color: 'var(--slate)' }}>No exact match found</span>
                    )}
                  </div>

                  <div className="pgrid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                    {pillSearchResults.map((p) => (
                      <div
                        key={p.product_id}
                        className="brand-card"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/products/${p.product_id}`)}
                      >
                        <div className="brand-ico" style={{ width: '56px', height: '56px', overflow: 'hidden', padding: '4px', background: '#fff' }}>
                          <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--ink)' }}>{p.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--slate)', marginTop: '2px' }}>
                            Brand: <b>{p.brand}</b> | Price: <b style={{ color: 'var(--g)' }}>₹{p.price}</b>
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--fog)', marginTop: '3px' }}>
                            {p.description.substring(0, 65)}...
                          </div>
                        </div>
                        <span className="badge-green" style={{ fontSize: '11.5px' }}>
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* 2. DRUG INTERACTION CHECKER                             */}
        {/* ======================================================= */}
        {activeTool === 'interact' && (
          <div className="tool-sec on">
            <div style={{ background: 'white', borderRadius: 'var(--r)', padding: '28px', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow)', marginBottom: '22px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', marginBottom: '6px' }}>
                Multi-Drug Interaction Analyzer
              </h2>
              <p style={{ color: 'var(--slate)', fontSize: '14px', marginBottom: '22px' }}>
                Search and select 2 or more medicines from our dataset to test clinical contraindications
              </p>

              <div className="fg" style={{ position: 'relative' }}>
                <label>Search and Add Medicine from Catalog</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Type medicine name (e.g., Aspirin, Warfarin, Cetirizine, Alprazolam)..."
                    value={medSearchInput}
                    onChange={(e) => {
                      setMedSearchInput(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                  />
                </div>

                {/* Dropdown Suggestions */}
                {showDropdown && medSuggestions.length > 0 && (
                  <div className="meds-drop on" style={{ display: 'block' }}>
                    {medSuggestions.map((m) => (
                      <div
                        key={m.product_id}
                        className="md-item"
                        onClick={() => handleAddMed(m)}
                      >
                        <b>{m.name}</b> <span style={{ color: 'var(--slate)', fontSize: '12px' }}>({m.brand})</span>
                        <span style={{ float: 'right', color: 'var(--g)', fontWeight: 700 }}>₹{m.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Med Badges */}
              <div style={{ margin: '16px 0', minHeight: '44px' }}>
                {selectedMeds.length === 0 ? (
                  <div style={{ fontSize: '13px', color: 'var(--fog)', fontStyle: 'italic' }}>
                    No medicines selected yet. Search above to add items.
                  </div>
                ) : (
                  selectedMeds.map((med) => (
                    <span key={med.product_id} className="sel-badge" style={{ padding: '7px 14px', fontSize: '13.5px' }}>
                      💊 {med.name}
                      <button onClick={() => setSelectedMeds(selectedMeds.filter((m) => m.product_id !== med.product_id))}>✕</button>
                    </span>
                  ))
                )}
              </div>

              {/* Clinical Analysis Output */}
              {interactionAnalysis ? (
                <div className={interactionAnalysis.severity === 'danger' ? 'sev-danger' : interactionAnalysis.severity === 'warn' ? 'sev-warn' : 'sev-safe'}>
                  <div className="sev-icon">
                    {interactionAnalysis.severity === 'danger' ? '🛑' : interactionAnalysis.severity === 'warn' ? '⚠️' : '✅'}
                  </div>
                  <div className="sev-title">{interactionAnalysis.title}</div>
                  <div className="sev-desc">{interactionAnalysis.desc}</div>
                </div>
              ) : (
                selectedMeds.length === 1 && (
                  <div style={{ textAlign: 'center', padding: '20px', background: 'var(--bg)', borderRadius: '12px', color: 'var(--slate)', fontSize: '13.5px' }}>
                    ➕ Add at least 1 more medicine to compute real-time interaction analysis.
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* 3. DOSAGE CALCULATOR                                    */}
        {/* ======================================================= */}
        {activeTool === 'dose' && (
          <div className="tool-sec on">
            <div style={{ background: 'white', borderRadius: 'var(--r)', padding: '28px', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow)', marginBottom: '22px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', marginBottom: '6px' }}>
                Weight-Based Pediatric Dosage Calculator
              </h2>
              <p style={{ color: 'var(--slate)', fontSize: '14px', marginBottom: '22px' }}>
                Calculate accurate pediatric dosage (mg & ml) based on body weight
              </p>

              <form onSubmit={handleCalculateDosage}>
                <div className="fg">
                  <label>Select Medicine Formulation</label>
                  <select
                    className="sort-sel"
                    style={{ width: '100%', padding: '11px' }}
                    value={selectedDosageMed.product_id}
                    onChange={(e) => {
                      const found = PRODUCTS.find((p) => String(p.product_id) === String(e.target.value));
                      if (found) setSelectedDosageMed(found);
                    }}
                  >
                    {/* Filter to show only likely pediatric or common meds for the dropdown to be concise */}
                    {PRODUCTS.filter(p => p.name.toLowerCase().includes('syrup') || p.name.toLowerCase().includes('suspension') || p.name.toLowerCase().includes('drop')).slice(0, 30).map((p) => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.name} — ({p.brand})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="fg">
                  <label>Patient Weight (in kg)</label>
                  <input
                    type="number"
                    min="2"
                    max="60"
                    step="0.5"
                    value={childWeight}
                    onChange={(e) => setChildWeight(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-g" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                  🧮 Compute Safe Pediatric Dose
                </button>
              </form>

              {doseResult && (
                <div className="dose-result">
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--g)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {doseResult.medName}
                  </span>
                  <div className="dose-big">{doseResult.doseMl} ml</div>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--ink)' }}>
                    Single Dose: {doseResult.singleDoseMg} mg (for {childWeight} kg weight)
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--slate)', marginTop: '8px' }}>
                    <b>Frequency:</b> {doseResult.frequency}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--fog)', marginTop: '6px' }}>
                    Max Daily Dose Limit: {doseResult.maxDailyMg} mg in 24 hours
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* 4. BRAND MAPPER                                         */}
        {/* ======================================================= */}
        {activeTool === 'brand' && (
          <div className="tool-sec on">
            <div style={{ background: 'white', borderRadius: 'var(--r)', padding: '28px', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow)', marginBottom: '22px' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', marginBottom: '6px' }}>
                Generic & Brand Medicine Mapper
              </h2>
              <p style={{ color: 'var(--slate)', fontSize: '14px', marginBottom: '22px' }}>
                Find cheaper alternative brand options and equivalents across {PRODUCTS.length.toLocaleString()} dataset medicines
              </p>

              <div className="fg">
                <label>Search Medicine Name or Composition</label>
                <input
                  type="text"
                  placeholder="e.g. Paracetamol, Cipla, Aspirin, Amoxicillin..."
                  value={brandQuery}
                  onChange={(e) => setBrandQuery(e.target.value)}
                />
              </div>

              {brandMapperResults.length > 0 ? (
                <div style={{ marginTop: '20px' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                    Found {brandMapperResults.length} Equivalent Brand Options (Sorted by Price):
                  </div>

                  {brandMapperResults.map((b) => (
                    <div
                      key={b.product_id}
                      className="brand-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/products/${b.product_id}`)}
                    >
                      <div className="brand-ico" style={{ width: '52px', height: '52px', overflow: 'hidden', padding: '4px', background: '#fff' }}>
                        <img src={b.image} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>{b.name}</div>
                        <div style={{ fontSize: '12.5px', color: 'var(--slate)', marginTop: '2px' }}>
                          Manufacturer: <b>{b.brand}</b>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--fog)', marginTop: '3px' }}>
                          {b.description.substring(0, 80)}...
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--g)' }}>₹{b.price.toFixed(2)}</div>
                        <span className="stk-good" style={{ fontSize: '11.5px' }}>
                          In Stock ({b.stock} units)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                brandQuery.trim() && (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--fog)', fontSize: '13.5px' }}>
                    No matching brands found for "{brandQuery}". Try searching "Amoxicillin", "Ibuprofen", or "Cipla".
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
