// Tweaks panel for ElevAIte Labs
const { useState, useEffect } = React;

function ElevTweaksApp() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    applyTweaks(tweaks);
  }, [tweaks]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Brand">
        <TweakColor
          label="Accent color"
          value={tweaks.accent}
          onChange={(v) => setTweak("accent", v)}
        />
        <TweakSelect
          label="Display font"
          value={tweaks.displayFont}
          options={["Fraunces", "Playfair Display", "DM Serif Display", "Instrument Serif"]}
          onChange={(v) => setTweak("displayFont", v)}
        />
      </TweakSection>

      <TweakSection title="Layout">
        <TweakRadio
          label="Hero layout"
          value={tweaks.heroLayout}
          options={[
            { label: "Split", value: "split" },
            { label: "Editorial", value: "editorial" },
            { label: "Centered", value: "centered" },
          ]}
          onChange={(v) => setTweak("heroLayout", v)}
        />
        <TweakRadio
          label="Services layout"
          value={tweaks.servicesLayout}
          options={[
            { label: "List", value: "list" },
            { label: "Grid", value: "grid" },
            { label: "Minimal", value: "minimal" },
          ]}
          onChange={(v) => setTweak("servicesLayout", v)}
        />
      </TweakSection>

      <TweakSection title="Imagery">
        <TweakRadio
          label="Placeholder style"
          value={tweaks.imageryStyle}
          options={[
            { label: "Stripes", value: "stripes" },
            { label: "Solid", value: "solid" },
            { label: "Geometric", value: "geometric" },
          ]}
          onChange={(v) => setTweak("imageryStyle", v)}
        />
      </TweakSection>

      <TweakSection title="Quick demo">
        <TweakButton onClick={() => window.openQuiz && window.openQuiz()}>
          Open AI Readiness Quiz
        </TweakButton>
      </TweakSection>
    </TweaksPanel>
  );
}

const tweaksRoot = document.getElementById("tweaks-root");
if (tweaksRoot) {
  ReactDOM.createRoot(tweaksRoot).render(<ElevTweaksApp />);
}
