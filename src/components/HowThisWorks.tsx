export function HowThisWorks() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        How This Works
      </h2>

      <div className="prose prose-slate max-w-none">
        <h3 className="text-lg font-medium text-slate-700 mt-4 mb-2">Expert System Approach</h3>
        <p className="text-slate-600 mb-4">
          This tool uses a <strong>rules-based expert system</strong> rather than machine learning.
          The recommendations are derived from established polymer processing fundamentals,
          material science principles, and decades of documented blown film extrusion best practices.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="bg-indigo-50 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 mb-2">Why Expert Systems?</h4>
            <ul className="text-sm text-indigo-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">✓</span>
                <span><strong>Explainable:</strong> Every recommendation can be traced to a specific engineering principle</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">✓</span>
                <span><strong>Predictable:</strong> Same inputs always produce same outputs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">✓</span>
                <span><strong>Auditable:</strong> Rules can be reviewed and validated by process engineers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">✓</span>
                <span><strong>Safe:</strong> No risk of a model hallucinating dangerous parameters</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Why Not Machine Learning?</h4>
            <ul className="text-sm text-slate-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-slate-400">✗</span>
                <span>ML requires large datasets that most processors don't have</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400">✗</span>
                <span>Black-box predictions can't be questioned or validated</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400">✗</span>
                <span>Models can extrapolate to dangerous operating regions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400">✗</span>
                <span>Physics and chemistry don't change - rules don't need retraining</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-medium text-slate-700 mt-6 mb-2">System Components</h3>

        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium text-slate-800">Material Database</h4>
            <p className="text-sm text-slate-600">
              Processing windows for HDPE, LDPE, LLDPE, and EVOH based on published data from
              resin manufacturers and plastics engineering references. Includes temperature ranges,
              pressure limits, and material-specific considerations.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium text-slate-800">Scaling Logic</h4>
            <p className="text-sm text-slate-600">
              Parameters are calculated using fundamental relationships: output rate vs. screw speed
              (specific output), dimensional requirements (blow-up ratio, layflat), and thermal requirements
              (melt pressure, cooling capacity). These relationships are well-established in extrusion science.
            </p>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-medium text-slate-800">Defect-Cause Matrix</h4>
            <p className="text-sm text-slate-600">
              A comprehensive troubleshooting database mapping defects to their most likely causes,
              ranked by probability. Each cause includes specific corrective actions based on
              process engineering principles and industry experience.
            </p>
          </div>
        </div>

        <h3 className="text-lg font-medium text-slate-700 mt-6 mb-2">Limitations</h3>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <ul className="text-sm text-amber-800 space-y-2">
            <li>• Recommendations are starting points - always verify with your specific equipment</li>
            <li>• Actual optimal settings depend on screw design, die geometry, and other equipment specifics</li>
            <li>• Material grades within the same polymer family may have different processing requirements</li>
            <li>• This tool does not replace the judgment of an experienced process engineer</li>
            <li>• Always follow your facility's safety procedures when adjusting parameters</li>
          </ul>
        </div>

        <h3 className="text-lg font-medium text-slate-700 mt-6 mb-2">Data Sources</h3>
        <p className="text-sm text-slate-600">
          Processing parameters are compiled from standard polymer processing references including
          SPE technical papers, resin supplier processing guides, and established blown film
          troubleshooting literature. Temperature ranges, pressure targets, and defect correlations
          reflect consensus values from multiple industry sources.
        </p>
      </div>
    </div>
  );
}
