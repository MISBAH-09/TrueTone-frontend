import { useState } from "react";
import { Camera, Search, CheckCircle2, Layers } from "lucide-react";

const mockResults = {
  skinType: "Dry & Sensitive",
  skinTone: "Medium Warm",
  score: 78,
  conditions: [
    { name: "Mild Dryness", severity: "Moderate" },
    { name: "Sun Damage", severity: "Low" },
    { name: "Fine Lines", severity: "Minimal" },
  ],
  recommendations: [
    "Use gentle cleanser",
    "Apply SPF daily",
    "Support hydration with serum",
    "Avoid alcohol-based products",
  ],
};

const SkinAnalysis = () => {
  const [stage, setStage] = useState("idle");
  const [results, setResults] = useState(null);

  const handleUpload = () => {
    setStage("loading");
    setTimeout(() => {
      setResults(mockResults);
      setStage("done");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm text-slate-500">Skin Analysis</p>
          <h1 className="text-3xl font-bold">Upload a Skin Photo</h1>
          <p className="mt-2 text-slate-600">Let TrueTone analyze your skin type and concerns using AI.</p>
        </div>

        {stage === "idle" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
              <Camera className="w-8 h-8" />
            </div>
            <p className="text-slate-700">Upload a clear, well-lit photo of your face without makeup.</p>
            <button onClick={handleUpload} className="mt-8 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition">
              Upload Photo
            </button>
          </div>
        )}

        {stage === "loading" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 animate-pulse">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-slate-700">Analyzing your skin… this may take a moment.</p>
          </div>
        )}

        {stage === "done" && results && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Detected Skin Type</p>
                  <h2 className="text-2xl font-semibold text-slate-900">{results.skinType}</h2>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Skin Tone</p>
                  <p className="text-lg font-medium text-slate-900">{results.skinTone}</p>
                </div>
                <div className="rounded-3xl bg-emerald-50 px-5 py-3 text-emerald-700">
                  <p className="text-sm">Score</p>
                  <p className="text-2xl font-bold">{results.score}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4">Detected Conditions</h3>
                <div className="space-y-3">
                  {results.conditions.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">Severity: {item.severity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4">AI Recommendations</h3>
                <ul className="space-y-3">
                  {results.recommendations.map((item) => (
                    <li key={item} className="rounded-2xl bg-slate-50 p-4 text-slate-700">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinAnalysis;
