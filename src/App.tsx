import { useState } from 'react';
import { OptimizeMode, DiagnoseMode, HowThisWorks } from './components';

type Mode = 'optimize' | 'diagnose';

function App() {
  const [mode, setMode] = useState<Mode>('optimize');

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-slate-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ParameterPath</h1>
              <p className="text-slate-400 text-sm">Film Extrusion Parameter Optimization</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Mode Toggle */}
        <div className="bg-white rounded-lg shadow-md p-2 mb-8 inline-flex">
          <button
            onClick={() => setMode('optimize')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              mode === 'optimize'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Optimize Parameters
            </span>
          </button>
          <button
            onClick={() => setMode('diagnose')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              mode === 'diagnose'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Diagnose Defect
            </span>
          </button>
        </div>

        {/* Mode Description */}
        <div className="mb-6">
          {mode === 'optimize' ? (
            <p className="text-slate-600">
              Enter your target specifications to get recommended processing parameters based on
              polymer processing fundamentals and material properties.
            </p>
          ) : (
            <p className="text-slate-600">
              Select an observed defect and current operating conditions to get ranked probable
              causes and recommended corrective actions.
            </p>
          )}
        </div>

        {/* Active Mode Component */}
        {mode === 'optimize' ? <OptimizeMode /> : <DiagnoseMode />}

        {/* How This Works Section */}
        <HowThisWorks />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>ParameterPath - Expert System for Blown Film Extrusion</p>
          <p className="mt-1">
            Recommendations based on polymer processing fundamentals.
            Always verify with your specific equipment and safety procedures.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
