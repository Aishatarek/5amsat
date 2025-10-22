"use client";
import { useState, useContext } from "react";
import styles from "./magnetism.module.css";
import { LangContext } from "../../LangProvider";
import Header from "../../Header";

const tools = [
  { id: "paperClip", name: "Paper Clip", ar: "مشبك ورق", img: "/paperclip.svg", magnetic: true },
  { id: "coin", name: "Metal Coin", ar: "عملة معدنية", img: "/coin.svg", magnetic: true },
  { id: "wood", name: "Wood Piece", ar: "قطعة خشب", img: "/wood.svg", magnetic: false },
  { id: "paper", name: "Paper", ar: "ورقة", img: "/paper.svg", magnetic: false },
];

const feedbacks = {
  paperClip: {
    en: "The magnet attracts the paper clip! Paper clips are made of iron.",
    ar: "المغناطيس يجذب مشبك الورق! مشابك الورق مصنوعة من الحديد."
  },
  coin: {
    en: "The magnet attracts the metal coin! The coin contains magnetic metals.",
    ar: "المغناطيس يجذب العملة المعدنية! العملة تحتوي على معادن مغناطيسية."
  },
  wood: {
    en: "The magnet does not attract wood. Wood is not a magnetic material.",
    ar: "المغناطيس لا يجذب الخشب. الخشب ليس مادة مغناطيسية."
  },
  paper: {
    en: "The magnet does not attract paper. Paper is not a magnetic material.",
    ar: "المغناطيس لا يجذب الورقة. الورق ليس مادة مغناطيسية."
  }
};

const steps = {
  en: [
    "1. Bring the magnet close to each material one by one.",
    "2. Observe which materials are attracted to the magnet.",
    "3. Record your observations.",
    "4. Classify materials as magnetic or non-magnetic."
  ],
  ar: [
    "1. قرّب المغناطيس من كل مادة على حدة.",
    "2. لاحظ المواد التي ينجذب إليها المغناطيس.",
    "3. سجل ملاحظاتك.",
    "4. صنف المواد إلى مغناطيسية وغير مغناطيسية."
  ]
};

const observations = {
  en: [
    "• The magnet attracts the paper clip and coin.",
    "• The magnet does not attract wood or paper.",
    "• Magnetic attraction works through small distances.",
    "• Only certain metals are attracted to magnets."
  ],
  ar: [
    "• المغناطيس يجذب مشبك الورق والعملة.",
    "• المغناطيس لا يجذب الخشب أو الورقة.",
    "• الجذب المغناطيسي يعمل عبر مسافات صغيرة.",
    "• فقط بعض المعادن تنجذب للمغناطيس."
  ]
};

const conclusion = {
  en: "Only some materials (like iron) are attracted to magnets. Materials that contain iron, nickel, or cobalt are magnetic, while materials like wood, paper, plastic, and glass are non-magnetic.",
  ar: "بعض المواد فقط (مثل الحديد) تنجذب للمغناطيس. المواد التي تحتوي على الحديد أو النيكل أو الكوبالت مغناطيسية، بينما مواد مثل الخشب والورق والبلاستيك والزجاج غير مغناطيسية."
};

export default function Magnetism() {
  const { lang } = useContext(LangContext);
  const [workspace, setWorkspace] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [testedMaterials, setTestedMaterials] = useState<Set<string>>(new Set());
  const [magnetPosition, setMagnetPosition] = useState({ x: 0, y: 0 });
  const [isDraggingMagnet, setIsDraggingMagnet] = useState(false);

  function onDrop(e: React.DragEvent) {
    const id = e.dataTransfer.getData("tool");
    if (!workspace.includes(id)) {
      const newWorkspace = [...workspace, id];
      setWorkspace(newWorkspace);
      setTestedMaterials(prev => new Set([...prev, id]));
      setFeedback(lang === 'ar' ? feedbacks[id as keyof typeof feedbacks].ar : feedbacks[id as keyof typeof feedbacks].en);
    }
  }

  function onDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("tool", id);
  }

  function handleMagnetDrag(e: React.MouseEvent) {
    if (isDraggingMagnet) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMagnetPosition({
        x: e.clientX - rect.left - 50,
        y: e.clientY - rect.top - 50
      });
    }
  }

  function startMagnetDrag() {
    setIsDraggingMagnet(true);
  }

  function stopMagnetDrag() {
    setIsDraggingMagnet(false);
  }

  function reset() {
    setWorkspace([]);
    setFeedback("");
    setTestedMaterials(new Set());
    setMagnetPosition({ x: 0, y: 0 });
    setIsDraggingMagnet(false);
  }

  const magneticItems = workspace.filter(id => tools.find(t => t.id === id)?.magnetic);
  const nonMagneticItems = workspace.filter(id => !tools.find(t => t.id === id)?.magnetic);

  return (
    <>
      <Header />
      <div className={styles.container} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className={styles.header}>
          <h1>{lang === 'ar' ? 'تجربة المواد المغناطيسية' : 'Magnetic Materials Experiment'}</h1>
        </div>
        
        <div className={styles.labWorkspace}>
          <div className={styles.experimentHeader}>
            <div>
              <h2>🧲 {lang === 'ar' ? 'اختبر المواد مع المغناطيس' : 'Test Materials with Magnet'}</h2>
              <p>{lang === 'ar' ? 'اسحب المواد إلى منطقة التجربة واستخدم المغناطيس لاختبارها' : 'Drag materials to the experiment area and use the magnet to test them'}</p>
            </div>
            <button className={styles.resetBtn} onClick={reset}>
              {lang === 'ar' ? 'إعادة التجربة' : 'Reset'}
            </button>
          </div>

          <div className={styles.experimentArea}>
            <div className={styles.toolsSection}>
              <h3>🔧 {lang === 'ar' ? 'أدوات التجربة' : 'Experiment Tools'}</h3>
              <div className={styles.toolsContainer}>
                {tools.map(tool => (
                  <div
                    key={tool.id}
                    className={styles.toolItem}
                    draggable
                    onDragStart={e => onDragStart(e, tool.id)}
                  >
                    <div className={styles.toolImg}>
                      <img src={tool.img} alt={tool.name} />
                    </div>
                    <h4>{lang === 'ar' ? tool.ar : tool.name}</h4>
                    <small className={styles.magneticLabel}>
                      {tool.magnetic 
                        ? (lang === 'ar' ? 'مغناطيسي' : 'Magnetic')
                        : (lang === 'ar' ? 'غير مغناطيسي' : 'Non-magnetic')
                      }
                    </small>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.workspaceSection}>
              <h3>🔬 {lang === 'ar' ? 'منطقة التجربة' : 'Experiment Area'}</h3>
              <div
                className={styles.experimentZone}
                onDragOver={e => e.preventDefault()}
                onDrop={onDrop}
                onMouseMove={handleMagnetDrag}
                onMouseUp={stopMagnetDrag}
              >
                {/* Magnet */}
                <div 
                  className={`${styles.magnet} ${isDraggingMagnet ? styles.dragging : ''}`}
                  style={{ 
                    left: `${magnetPosition.x}px`, 
                    top: `${magnetPosition.y}px` 
                  }}
                  onMouseDown={startMagnetDrag}
                >
                  🧲
                  {/* Magnetic field visualization */}
                  <div className={styles.magneticField}></div>
                </div>

                {/* Dropped materials */}
                {workspace.map((materialId, index) => {
                  const tool = tools.find(t => t.id === materialId);
                  const isMagnetic = tool?.magnetic;
                  return (
                    <div
                      key={`${materialId}-${index}`}
                      className={`${styles.droppedMaterial} ${isMagnetic ? styles.magnetic : styles.nonMagnetic}`}
                      style={{
                        left: `${150 + index * 80}px`,
                        top: `${200 + (index % 2) * 60}px`
                      }}
                    >
                      <img src={tool?.img} alt={tool?.name} />
                      {isMagnetic && <div className={styles.attractionEffect}></div>}
                    </div>
                  );
                })}

                {/* Instructions */}
                {workspace.length === 0 && (
                  <div className={styles.instructions}>
                    {lang === 'ar' 
                      ? 'اسحب المواد هنا واستخدم المغناطيس لاختبارها'
                      : 'Drag materials here and use the magnet to test them'
                    }
                  </div>
                )}
              </div>
              
              <div className={styles.feedbackBox}>
                {feedback || (lang === 'ar' 
                  ? 'اسحب مادة إلى منطقة التجربة وحرك المغناطيس بالقرب منها.'
                  : 'Drag a material to the experiment area and move the magnet near it.'
                )}
              </div>
            </div>
          </div>

          {/* Steps Section */}
          <div className={styles.stepsSection}>
            <h3>📋 {lang === 'ar' ? 'خطوات التجربة' : 'Experiment Steps'}</h3>
            <div className={styles.stepsList}>
              {steps[lang].map((step, index) => (
                <div key={index} className={styles.stepItem}>
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Results Section */}
          {testedMaterials.size > 0 && (
            <div className={styles.resultsSection}>
              <h3>📊 {lang === 'ar' ? 'النتائج' : 'Results'}</h3>
              <div className={styles.resultsGrid}>
                <div className={styles.magneticGroup}>
                  <h4>{lang === 'ar' ? 'مواد مغناطيسية' : 'Magnetic Materials'}</h4>
                  <div className={styles.materialsList}>
                    {magneticItems.map(id => {
                      const tool = tools.find(t => t.id === id);
                      return (
                        <div key={id} className={styles.resultItem}>
                          <img src={tool?.img} alt={tool?.name} />
                          <span>{lang === 'ar' ? tool?.ar : tool?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.nonMagneticGroup}>
                  <h4>{lang === 'ar' ? 'مواد غير مغناطيسية' : 'Non-magnetic Materials'}</h4>
                  <div className={styles.materialsList}>
                    {nonMagneticItems.map(id => {
                      const tool = tools.find(t => t.id === id);
                      return (
                        <div key={id} className={styles.resultItem}>
                          <img src={tool?.img} alt={tool?.name} />
                          <span>{lang === 'ar' ? tool?.ar : tool?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Observations Section */}
          <div className={styles.observationsSection}>
            <h3>👁️ {lang === 'ar' ? 'الملاحظات' : 'Observations'}</h3>
            <div className={styles.observationsList}>
              {observations[lang].map((obs, index) => (
                <div key={index} className={styles.observationItem}>
                  {obs}
                </div>
              ))}
            </div>
          </div>

          {/* Conclusion Section */}
          <div className={styles.conclusionSection}>
            <h3>🎯 {lang === 'ar' ? 'الاستنتاج' : 'Conclusion'}</h3>
            <div className={styles.conclusionBox}>
              {conclusion[lang]}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}