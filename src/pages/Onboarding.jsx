import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const skinTypes = ["Normal", "Oily", "Dry", "Combination", "Sensitive"];
const skinTones = ["Fair", "Light", "Medium", "Tan", "Deep"];
const concerns = [
  "Acne",
  "Dark spots",
  "Dryness",
  "Redness",
  "Fine lines",
  "Uneven tone",
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    skinType: "",
    skinTone: "",
    concerns: [],
    goals: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("truetone_profile");
    if (stored) {
      setProfile((prev) => ({ ...prev, ...JSON.parse(stored) }));
    }
  }, []);

  const updateField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const toggleConcern = (concern) => {
    setProfile((current) => {
      const selected = current.concerns.includes(concern)
        ? current.concerns.filter((item) => item !== concern)
        : [...current.concerns, concern];
      return { ...current, concerns: selected };
    });
  };

  const saveProfile = (nextStep) => {
    localStorage.setItem("truetone_profile", JSON.stringify(profile));
    setStep(nextStep);
  };

  const completeOnboarding = () => {
    localStorage.setItem(
      "truetone_profile",
      JSON.stringify({ ...profile, onboardingComplete: true })
    );
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto w-full max-w-4xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Onboarding</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Tell us about your skin</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Complete a few quick questions so TrueTone can deliver the best skincare recommendations for you.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Step {step} of 3</p>
              <p className="mt-1 text-sm text-slate-600">
                {step === 1 && "Choose your skin type."}
                {step === 2 && "Select your top skin concerns."}
                {step === 3 && "Share your skin tone and goals."}
              </p>
            </div>
            <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              {step === 3 ? "Final step" : "Quick"}
            </div>
          </div>
        </div>

        <div className="mt-8">
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">Which skin type best describes you?</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {skinTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField("skinType", type)}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${
                      profile.skinType === type
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
                    }`}
                  >
                    <span className="text-base font-semibold">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">What are your top skin concerns? (select 1–3)</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {concerns.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleConcern(item)}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${
                      profile.concerns.includes(item)
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
                    }`}
                  >
                    <span className="text-base font-semibold">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-600">Select your skin tone</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {skinTones.map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => updateField("skinTone", tone)}
                      className={`rounded-3xl border px-5 py-4 text-left transition ${
                        profile.skinTone === tone
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-400"
                      }`}
                    >
                      <span className="text-base font-semibold">{tone}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-600">What is your main skincare goal?</p>
                <textarea
                  value={profile.goals}
                  onChange={(event) => updateField("goals", event.target.value)}
                  placeholder="For example: reduce oiliness, fade dark spots, or hydrate more"
                  className="mt-4 w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none"
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
            disabled={step === 1}
          >
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                saveProfile(step + 1);
              }}
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 hover:bg-emerald-700 transition"
              disabled={
                (step === 1 && !profile.skinType) ||
                (step === 2 && profile.concerns.length === 0)
              }
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={completeOnboarding}
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/40 hover:bg-emerald-700 transition"
              disabled={!profile.skinTone || !profile.goals}
            >
              Finish Onboarding
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
