import type { DiagnoseInputs, DiagnoseResult, DefectCause } from './types';
import { getDefectInfo } from './defects';
import { getMaterial } from './materials';

// Analyze current settings to prioritize causes
function analyzeCauses(inputs: DiagnoseInputs): DefectCause[] {
  const defectInfo = getDefectInfo(inputs.defect);
  const materialProps = getMaterial(inputs.material);
  const causes = [...defectInfo.causes];

  // Adjust probabilities based on current settings
  const { meltTemp, screwSpeed, dieTemp } = inputs.currentSettings;

  // Check if settings are outside normal ranges
  const dieTempLow = dieTemp < materialProps.barrelTemperatures.die.min;
  const dieTempHigh = dieTemp > materialProps.barrelTemperatures.die.max;
  const meltTempLow = meltTemp < materialProps.meltTempRange.min;
  const meltTempHigh = meltTemp > materialProps.meltTempRange.max;
  const screwSpeedHigh = screwSpeed > materialProps.screwSpeedRange.max * 0.9;

  // Modify cause probabilities based on analysis
  causes.forEach((cause) => {
    // Temperature-related causes
    if (cause.cause.toLowerCase().includes('temperature') ||
        cause.cause.toLowerCase().includes('temp')) {
      if (cause.cause.toLowerCase().includes('low') && (meltTempLow || dieTempLow)) {
        cause.probability = 'high';
        cause.explanation += ' [Current settings confirm low temperature condition]';
      }
      if (cause.cause.toLowerCase().includes('high') && (meltTempHigh || dieTempHigh)) {
        cause.probability = 'high';
        cause.explanation += ' [Current settings confirm high temperature condition]';
      }
    }

    // Output/speed related causes
    if (cause.cause.toLowerCase().includes('output') ||
        cause.cause.toLowerCase().includes('rate') ||
        cause.cause.toLowerCase().includes('speed')) {
      if (screwSpeedHigh) {
        cause.probability = 'high';
        cause.explanation += ' [Current screw speed is near upper limit]';
      }
    }

    // Moisture related - flag for hygroscopic materials
    if (cause.cause.toLowerCase().includes('moisture')) {
      if (inputs.material === 'EVOH') {
        cause.probability = 'high';
        cause.explanation += ' [EVOH is hygroscopic - moisture is common issue]';
      }
    }
  });

  // Sort by probability
  const probabilityOrder = { high: 0, medium: 1, low: 2 };
  causes.sort((a, b) => probabilityOrder[a.probability] - probabilityOrder[b.probability]);

  return causes;
}

// Add material-specific recommendations
function getMaterialSpecificRecommendations(
  inputs: DiagnoseInputs
): string[] {
  const recommendations: string[] = [];

  switch (inputs.material) {
    case 'HDPE':
      recommendations.push(
        'HDPE has a narrow processing window - small temperature adjustments (5-10°F) recommended'
      );
      recommendations.push(
        'Monitor melt pressure closely when adjusting parameters'
      );
      break;
    case 'LDPE':
      recommendations.push(
        'LDPE is forgiving - larger parameter adjustments are usually safe'
      );
      break;
    case 'LLDPE':
      recommendations.push(
        'LLDPE requires higher motor load - ensure extruder is not overloaded'
      );
      recommendations.push(
        'Consider blending with LDPE if processing is difficult'
      );
      break;
    case 'EVOH':
      recommendations.push(
        'CRITICAL: Verify material was properly dried before processing'
      );
      recommendations.push(
        'EVOH degradation is irreversible - avoid excessive temperature or residence time'
      );
      recommendations.push(
        'Consider purging with LDPE before and after EVOH runs'
      );
      break;
  }

  return recommendations;
}

// Get defect-specific process checks
function getProcessChecks(inputs: DiagnoseInputs): string[] {
  const checks: string[] = [];

  switch (inputs.defect) {
    case 'melt_fracture':
    case 'shark_skin':
      checks.push('Verify die land length and condition');
      checks.push('Check if processing aid is being used and at correct level');
      break;
    case 'die_lines':
      checks.push('Inspect die lips for damage with magnification');
      checks.push('Check for contamination in hopper and feed system');
      break;
    case 'voids_bubbles':
      checks.push('Verify hopper dryer is operating (if applicable)');
      checks.push('Check feed throat temperature and condition');
      break;
    case 'warping':
      checks.push('Measure frost line height around circumference');
      checks.push('Check air ring leveling and balance');
      break;
    case 'inconsistent_wall_thickness':
      checks.push('Measure die gap at 8 points minimum');
      checks.push('Verify all die zone heaters are functioning');
      break;
    case 'surface_roughness':
      checks.push('Check corona treater level (if applicable)');
      checks.push('Inspect winder tension and roll quality');
      break;
  }

  return checks;
}

export function diagnoseDefect(inputs: DiagnoseInputs): DiagnoseResult {
  const defectInfo = getDefectInfo(inputs.defect);
  const analyzedCauses = analyzeCauses(inputs);

  // Combine general recommendations
  const generalRecommendations = [
    ...defectInfo.generalRecommendations,
    ...getMaterialSpecificRecommendations(inputs),
    ...getProcessChecks(inputs),
  ];

  return {
    defect: inputs.defect,
    defectName: defectInfo.name,
    description: defectInfo.description,
    causes: analyzedCauses,
    generalRecommendations,
  };
}
