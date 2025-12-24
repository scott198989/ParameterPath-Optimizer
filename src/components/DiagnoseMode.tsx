import { useState } from 'react';
import type { MaterialType, DefectType, DiagnoseInputs, DiagnoseResult } from '../engine';
import { getAllMaterials, getMaterial, getAllDefects, getDefectDisplayName, diagnoseDefect } from '../engine';

export function DiagnoseMode() {
  const [inputs, setInputs] = useState<DiagnoseInputs>({
    material: 'LDPE',
    currentSettings: {
      meltTemp: 390,
      screwSpeed: 60,
      lineSpeed: 100,
      dieTemp: 400,
    },
    defect: 'melt_fracture',
  });

  const [results, setResults] = useState<DiagnoseResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const diagnosis = diagnoseDefect(inputs);
    setResults(diagnosis);
  };

  const updateMaterial = (material: MaterialType) => {
    const matProps = getMaterial(material);
    setInputs((prev) => ({
      ...prev,
      material,
      currentSettings: {
        ...prev.currentSettings,
        meltTemp: matProps.meltTempRange.min + (matProps.meltTempRange.max - matProps.meltTempRange.min) / 2,
        dieTemp: matProps.barrelTemperatures.die.recommended,
      },
    }));
    setResults(null);
  };

  const updateSetting = (field: keyof DiagnoseInputs['currentSettings'], value: number) => {
    setInputs((prev) => ({
      ...prev,
      currentSettings: { ...prev.currentSettings, [field]: value },
    }));
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Defect Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Material
            </label>
            <select
              value={inputs.material}
              onChange={(e) => updateMaterial(e.target.value as MaterialType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
            >
              {getAllMaterials().map((mat) => (
                <option key={mat} value={mat}>
                  {mat} - {getMaterial(mat).fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Observed Defect
            </label>
            <select
              value={inputs.defect}
              onChange={(e) => {
                setInputs((prev) => ({ ...prev, defect: e.target.value as DefectType }));
                setResults(null);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
            >
              {getAllDefects().map((defect) => (
                <option key={defect} value={defect}>
                  {getDefectDisplayName(defect)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-md font-medium text-slate-700 mb-3">Current Operating Settings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Melt Temp (°F)
              </label>
              <input
                type="number"
                value={inputs.currentSettings.meltTemp}
                onChange={(e) => updateSetting('meltTemp', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Screw Speed (RPM)
              </label>
              <input
                type="number"
                value={inputs.currentSettings.screwSpeed}
                onChange={(e) => updateSetting('screwSpeed', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Line Speed (ft/min)
              </label>
              <input
                type="number"
                value={inputs.currentSettings.lineSpeed}
                onChange={(e) => updateSetting('lineSpeed', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Die Temp (°F)
              </label>
              <input
                type="number"
                value={inputs.currentSettings.dieTemp}
                onChange={(e) => updateSetting('dieTemp', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md transition-colors shadow-sm"
        >
          Diagnose Defect
        </button>
      </form>

      {results && <DiagnosisDisplay results={results} />}
    </div>
  );
}

function DiagnosisDisplay({ results }: { results: DiagnoseResult }) {
  const probabilityColors = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-yellow-500 bg-yellow-50',
    low: 'border-l-slate-400 bg-slate-50',
  };

  const probabilityBadge = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-slate-100 text-slate-800',
  };

  return (
    <div className="space-y-4">
      {/* Defect Description */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{results.defectName}</h3>
        <p className="text-slate-600">{results.description}</p>
      </div>

      {/* Probable Causes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Probable Causes (Ranked by Likelihood)
        </h3>
        <div className="space-y-4">
          {results.causes.map((cause, idx) => (
            <div
              key={idx}
              className={`border-l-4 rounded-r-lg p-4 ${probabilityColors[cause.probability]}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-800">{cause.cause}</h4>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${probabilityBadge[cause.probability]}`}>
                  {cause.probability.toUpperCase()} probability
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{cause.explanation}</p>
              <div className="bg-white bg-opacity-50 rounded-md p-3">
                <h5 className="text-sm font-medium text-slate-700 mb-2">Recommended Adjustments:</h5>
                <ul className="space-y-1">
                  {cause.adjustments.map((adj, adjIdx) => (
                    <li key={adjIdx} className="flex items-start gap-2 text-sm text-slate-700">
                      <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {adj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General Recommendations */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          General Recommendations
        </h3>
        <ul className="space-y-2">
          {results.generalRecommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2 text-green-900">
              <span className="text-green-600 mt-1">•</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
