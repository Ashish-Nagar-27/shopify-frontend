// import React, { useState, useEffect } from 'react';
// import './pumalyze.css';
// import { TopBar, Icon } from './components';
// import { Insights } from './insights';
// import { AttributeReport } from './report';
// import { useTweaks, TweaksPanel, TweakSection, TweakRadio } from './tweaks-panel';

// const KPIS = {
//   aov: "591.04",
//   rev: "745,301",
//   sales: "1,261",
//   roi: "180.29",
// };

// const TWEAK_DEFAULTS = {
//   "accent": "cyan",
//   "density": "regular",
//   "showSparklines": false,
//   "tableStripes": false
// };

// const ACCENT_PRESETS = {
//   cyan: { primary: "oklch(0.82 0.14 200)", deep: "oklch(0.68 0.16 210)", soft: "oklch(0.82 0.14 200 / 0.16)", magenta: "oklch(0.72 0.20 340)" },
//   emerald: { primary: "oklch(0.80 0.17 160)", deep: "oklch(0.65 0.17 160)", soft: "oklch(0.80 0.17 160 / 0.16)", magenta: "oklch(0.78 0.16 80)" },
//   violet: { primary: "oklch(0.78 0.16 295)", deep: "oklch(0.62 0.18 295)", soft: "oklch(0.78 0.16 295 / 0.16)", magenta: "oklch(0.80 0.14 200)" },
//   amber: { primary: "oklch(0.82 0.16 75)", deep: "oklch(0.68 0.16 65)", soft: "oklch(0.82 0.16 75 / 0.16)", magenta: "oklch(0.78 0.16 25)" },
// };

// export default function PumalyzeReport({ logoUrl }) {
//   const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

//   useEffect(() => {
//     const p = ACCENT_PRESETS[t.accent] || ACCENT_PRESETS.cyan;
//     const r = document.documentElement;
//     r.style.setProperty("--cyan", p.primary);
//     r.style.setProperty("--cyan-deep", p.deep);
//     r.style.setProperty("--cyan-soft", p.soft);
//     r.style.setProperty("--magenta", p.magenta);
//     r.style.setProperty("--magenta-soft", p.magenta.replace(")", " / 0.16)").replace("oklch(", "oklch("));
//   }, [t.accent]);

//   useEffect(() => {
//     document.body.dataset.density = t.density;
//     const pad = t.density === "compact" ? "10px" : t.density === "comfy" ? "18px" : "14px";
//     document.documentElement.style.setProperty("--row-pad", pad);
//     let style = document.getElementById("__density_style");
//     if (!style) {
//       style = document.createElement("style");
//       style.id = "__density_style";
//       document.head.appendChild(style);
//     }
//     style.textContent = `.tbl tbody td { padding-top: ${pad}; padding-bottom: ${pad}; }`;
//   }, [t.density]);

//   return (
//     <div className="pumalyze-container">
//       <div className="app" data-screen-label="Performance · Attribute Report">
//         <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>

//           <main className="main">
//             <Insights />
//             <section>
//               <AttributeReport />
//             </section>
//           </main>
//         </div>

//         {/* Floating AI assist */}
//         <button className="assist-fab" title="Pumalyze AI">
//           <Icon.sparkle width="20" height="20" />
//         </button>

//         {/* Tweaks panel */}
//         <TweaksPanel>
//           <TweakSection label="Theme accent" />
//           <TweakRadio label="Accent"
//             value={t.accent}
//             options={["cyan", "emerald", "violet", "amber"]}
//             onChange={(v) => setTweak("accent", v)} />

//           <TweakSection label="Table density" />
//           <TweakRadio label="Density"
//             value={t.density}
//             options={["compact", "regular", "comfy"]}
//             onChange={(v) => setTweak("density", v)} />
//         </TweaksPanel>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';


import { Insights } from '../insights/Insights';
// import { AttributeReport } from './report';
// import { useTweaks, } from './tweaks-panel';
import { AttributeReport } from '../report/AttributeReport';

export default function PumalyzeReport({ logoUrl }) {




  return (
    <main className="px-7 pt-6 pb-12 flex flex-col gap-[22px]">
      <Insights />
      <section>
        <AttributeReport />
      </section>
    </main>


  );
}