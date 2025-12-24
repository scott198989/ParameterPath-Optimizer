import { useState } from 'react';
import type { MaterialType, OptimizeInputs, RecommendedSettings } from '../engine';
import { getAllMaterials, getMaterial, optimizeParameters } from '../engine';

export function OptimizeMode() {
  const [inputs, setInputs] = useState<OptimizeInputs>({
    material: 'LDPE',
    targetOD: 20,
    targetGauge: 1.5,
    productionRate: 200,
  });

  const [results, setResults] = useState<RecommendedSettings | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const optimized = optimizeParameters(inputs);
    setResults(optimized);
  };

  const handleInputChange = (field: keyof OptimizeInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Process Inputs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Material
            </label>
            <select
              value={inputs.material}
              onChange={(e) => handleInputChange('material', e.target.value as MaterialType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
              Target OD (inches)
            </label>
            <input
              type="number"
              value={inputs.targetOD}
              onChange={(e) => handleInputChange('targetOD', parseFloat(e.target.value) || 0)}
              min={1}
              max={100}
              step={0.5}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">Bubble diameter</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Target Gauge (mils)
            </label>
            <input
              type="number"
              value={inputs.targetGauge}
              onChange={(e) => handleInputChange('targetGauge', parseFloat(e.target.value) || 0)}
              min={0.25}
              max={20}
              step={0.25}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">Film thickness (1 mil = 0.001")</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Production Rate (lbs/hr)
            </label>
            <input
              type="number"
              value={inputs.productionRate}
              onChange={(e) => handleInputChange('productionRate', parseFloat(e.target.value) || 0)}
              min={20}
              max={1000}
              step={10}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors shadow-sm"
        >
          Calculate Optimal Parameters
        </button>
      </form>

      {results && <ResultsDisplay results={results} material={inputs.material} />}
    </div>
  );
}

function ResultsDisplay({ results, material }: { results: RecommendedSettings; material: MaterialType }) {
  const confidenceColors = {
    high: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="space-y-4">
      {/* Confidence Indicator */}
      <div className={`rounded-lg border p-4 ${confidenceColors[results.confidence]}`}>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Confidence Level:</span>
          <span className="capitalize font-bold">{results.confidence}</span>
        </div>
      </div>

      {/* Barrel Temperatures */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
          Barrel Zone Temperatures (°F)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(results.barrelTemps).map(([zone, temp]) => (
            <div key={zone} className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-sm text-slate-600 capitalize">{zone}</div>
              <div className="text-2xl font-bold text-orange-600">{temp}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* Operating Parameters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Operating Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ParameterCard
            label="Screw Speed"
            value={`${results.screwSpeed.recommended} RPM`}
            range={`${results.screwSpeed.min} - ${results.screwSpeed.max}`}
          />
          <ParameterCard
            label="Line Speed"
            value={`${results.lineSpeed.recommended} ft/min`}
            range={`${results.lineSpeed.min} - ${results.lineSpeed.max}`}
          />
          <ParameterCard
            label="Melt Pressure Target"
            value={`${results.meltPressure.target} PSI`}
            range={`${results.meltPressure.min} - ${results.meltPressure.max}`}
          />
          <ParameterCard
            label="Blow-Up Ratio"
            value={results.blowUpRatio.toFixed(2)}
            range="Calculated from OD/Die"
          />
        </div>
      </div>

      {/* Air Ring Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          Air Ring Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600">Lip Gap</div>
            <div className="text-lg font-semibold text-slate-800">{results.airRing.lipGap}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600">Air Velocity</div>
            <div className="text-lg font-semibold text-slate-800">{results.airRing.airVelocity}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm text-slate-600">Cooling Capacity</div>
            <div className="text-lg font-semibold text-slate-800">{results.airRing.coolingCapacity}</div>
          </div>
        </div>
      </div>

      {/* Critical Parameters */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Critical Parameters to Monitor
        </h3>
        <ul className="space-y-2">
          {results.criticalParameters.map((param, idx) => (
            <li key={idx} className="flex items-start gap-2 text-amber-900">
              <span className="text-amber-600 mt-1">•</span>
              {param}
            </li>
          ))}
        </ul>
      </div>

      {/* Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Notes for {material}
        </h3>
        <ul className="space-y-2">
          {results.notes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-2 text-blue-900">
              <span className="text-blue-600 mt-1">•</span>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ParameterCard({ label, value, range }: { label: string; value: string; range: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500 mt-1">Range: {range}</div>
    </div>
  );
}
