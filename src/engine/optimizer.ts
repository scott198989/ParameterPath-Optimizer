import type { MaterialType, OptimizeInputs, RecommendedSettings } from './types';
import { getMaterial } from './materials';

// Film extrusion parameter optimization based on polymer processing fundamentals
// This uses scaling relationships and material property databases

// Calculate layflat width from target OD
function calculateLayflat(od: number): number {
  // Layflat = circumference / 2 = (PI * OD) / 2
  return (Math.PI * od) / 2;
}

// Get material density (approximate, lb/cu.in)
function getMaterialDensity(material: MaterialType): number {
  const densities: Record<MaterialType, number> = {
    HDPE: 0.035, // ~0.95 g/cc
    LDPE: 0.033, // ~0.92 g/cc
    LLDPE: 0.034, // ~0.93 g/cc
    EVOH: 0.042, // ~1.15 g/cc
  };
  return densities[material];
}

// Get die size based on target OD
function getDieSize(targetOD: number): number {
  if (targetOD <= 10) return 4;
  if (targetOD <= 20) return 6;
  if (targetOD <= 35) return 8;
  if (targetOD <= 50) return 10;
  return 12;
}

// Calculate optimal blow-up ratio based on OD and die diameter
function calculateBUR(targetOD: number, material: MaterialType): number {
  const materialProps = getMaterial(material);
  const dieSize = getDieSize(targetOD);
  const calculatedBUR = targetOD / dieSize;

  // Clamp to material's acceptable range
  return Math.max(
    materialProps.blowUpRatioRange.min,
    Math.min(calculatedBUR, materialProps.blowUpRatioRange.max)
  );
}

// Scale screw speed based on output rate
function calculateScrewSpeed(
  productionRate: number,
  material: MaterialType
): { min: number; max: number; recommended: number } {
  const materialProps = getMaterial(material);

  // Typical specific output: 3-8 lbs/hr per RPM depending on screw design
  // Use 5 as baseline for standard 24:1 L/D screw
  const specificOutput = 5;
  const baseRPM = productionRate / specificOutput;

  // Apply material-specific limits
  const minRPM = Math.max(materialProps.screwSpeedRange.min, baseRPM * 0.8);
  const maxRPM = Math.min(materialProps.screwSpeedRange.max, baseRPM * 1.2);
  const recommendedRPM = Math.min(
    materialProps.screwSpeedRange.max,
    Math.max(materialProps.screwSpeedRange.min, baseRPM)
  );

  return {
    min: Math.round(minRPM),
    max: Math.round(maxRPM),
    recommended: Math.round(recommendedRPM),
  };
}

// Calculate line speed from output and film dimensions
function calculateLineSpeed(
  productionRate: number,
  od: number,
  gauge: number,
  material: MaterialType
): { min: number; max: number; recommended: number } {
  const density = getMaterialDensity(material);

  // Film cross-sectional area (sq inches)
  const filmArea = Math.PI * od * (gauge / 1000);
  // Volume per foot (cubic inches)
  const volumePerFoot = filmArea * 12;
  // Mass per foot (lbs)
  const massPerFoot = volumePerFoot * density;

  // Line speed (ft/min) = output (lbs/hr) / mass per foot / 60
  const targetLineSpeed = productionRate / massPerFoot / 60;

  return {
    min: Math.round(targetLineSpeed * 0.85),
    max: Math.round(targetLineSpeed * 1.15),
    recommended: Math.round(targetLineSpeed),
  };
}

// Calculate melt pressure targets
function calculateMeltPressure(
  productionRate: number,
  material: MaterialType
): { min: number; max: number; target: number } {
  const materialProps = getMaterial(material);

  // Melt pressure scales roughly with output rate
  // Baseline: mid-range pressure at mid-range output
  const midOutput = 200; // lbs/hr typical mid-range
  const midPressure =
    (materialProps.meltPressureRange.min + materialProps.meltPressureRange.max) / 2;

  // Scale pressure with output (square root relationship is common)
  const scaleFactor = Math.sqrt(productionRate / midOutput);
  const targetPressure = midPressure * scaleFactor;

  // Clamp to material limits
  const clampedTarget = Math.max(
    materialProps.meltPressureRange.min,
    Math.min(targetPressure, materialProps.meltPressureRange.max)
  );

  return {
    min: materialProps.meltPressureRange.min,
    max: materialProps.meltPressureRange.max,
    target: Math.round(clampedTarget),
  };
}

// Determine air ring settings based on output and material
function calculateAirRing(
  productionRate: number,
  material: MaterialType,
  od: number
): { lipGap: string; airVelocity: string; coolingCapacity: string } {
  let lipGap: string;
  let airVelocity: string;
  let coolingCapacity: string;

  // Lip gap based on gauge and output
  if (productionRate < 150) {
    lipGap = '0.030-0.040"';
  } else if (productionRate < 300) {
    lipGap = '0.040-0.060"';
  } else {
    lipGap = '0.060-0.080"';
  }

  // Air velocity based on material crystallization rate
  if (material === 'HDPE') {
    airVelocity = 'High (fast crystallization)';
  } else if (material === 'EVOH') {
    airVelocity = 'Moderate (prevent rapid quench)';
  } else {
    airVelocity = 'Medium-High';
  }

  // Cooling capacity based on output and OD
  const coolingLoad = productionRate * od;
  if (coolingLoad < 2000) {
    coolingCapacity = 'Standard single-lip';
  } else if (coolingLoad < 5000) {
    coolingCapacity = 'Dual-lip recommended';
  } else {
    coolingCapacity = 'Dual-lip with IBC recommended';
  }

  return { lipGap, airVelocity, coolingCapacity };
}

// Calculate frost line height recommendations
function calculateFrostLine(
  targetOD: number,
  material: MaterialType,
  productionRate: number
): { heightRange: string; heightInches: { min: number; max: number }; notes: string } {
  const materialProps = getMaterial(material);
  const dieSize = getDieSize(targetOD);

  // Frost line height typically 3-6x die diameter
  // Adjusted by material factor and production rate
  const baseFactor = materialProps.frostLineHeightFactor;
  const rateAdjustment = productionRate > 300 ? 1.1 : productionRate < 100 ? 0.9 : 1.0;

  const minHeight = Math.round(dieSize * 3 * baseFactor * rateAdjustment);
  const maxHeight = Math.round(dieSize * 6 * baseFactor * rateAdjustment);
  const optimalHeight = Math.round(dieSize * 4.5 * baseFactor * rateAdjustment);

  let notes: string;
  if (material === 'HDPE') {
    notes = 'HDPE requires higher frost line for proper crystallinity development';
  } else if (material === 'EVOH') {
    notes = 'EVOH sensitive to frost line - maintain consistent height for barrier properties';
  } else if (material === 'LLDPE') {
    notes = 'LLDPE tolerates wider frost line range than HDPE';
  } else {
    notes = 'LDPE very forgiving - frost line height less critical';
  }

  return {
    heightRange: `${minHeight}-${maxHeight}" (optimal: ~${optimalHeight}")`,
    heightInches: { min: minHeight, max: maxHeight },
    notes,
  };
}

// Calculate nip roller settings
function calculateNipRollers(
  lineSpeed: { min: number; max: number; recommended: number },
  gauge: number,
  material: MaterialType
): { speed: string; pressure: string; temperature: string } {
  // Nip roller speed matches line speed (with slight tension adjustment)
  const speedNote = `Match line speed (${lineSpeed.recommended} ft/min) with 1-3% draw`;

  // Pressure based on gauge and material
  let pressure: string;
  if (gauge < 1) {
    pressure = 'Light (15-25 PSI) - thin gauge sensitive to crushing';
  } else if (gauge < 3) {
    pressure = 'Medium (25-40 PSI) - standard operating range';
  } else {
    pressure = 'Medium-High (35-50 PSI) - heavier gauge needs more nip force';
  }

  // Temperature based on material
  let temperature: string;
  if (material === 'HDPE') {
    temperature = 'Ambient to 80°F - avoid heating crystalline film';
  } else if (material === 'EVOH') {
    temperature = 'Ambient (60-75°F) - prevent moisture pickup';
  } else {
    temperature = 'Ambient to 100°F - slight warming can improve layflat';
  }

  return { speed: speedNote, pressure, temperature };
}

// Calculate IBC (Internal Bubble Cooling) recommendations
function calculateIBC(
  productionRate: number,
  targetOD: number,
  gauge: number,
  material: MaterialType
): { recommended: boolean; airFlow: string; notes: string } {
  const coolingLoad = productionRate * targetOD;
  const isHeavyGauge = gauge > 3;
  const isHighOutput = productionRate > 250;

  // IBC recommended for high cooling loads or specific conditions
  const recommended = coolingLoad > 4000 || (isHeavyGauge && isHighOutput);

  let airFlow: string;
  let notes: string;

  if (!recommended) {
    airFlow = 'Not required for this application';
    notes = 'External air ring cooling sufficient for current parameters';
  } else if (material === 'HDPE') {
    airFlow = 'High flow rate (match or exceed external cooling)';
    notes = 'HDPE benefits significantly from IBC - improves output capacity 20-40%';
  } else if (material === 'EVOH') {
    airFlow = 'Moderate flow - balanced with external cooling';
    notes = 'IBC helps maintain uniform cooling for consistent barrier properties';
  } else {
    airFlow = 'Medium-High flow rate';
    notes = 'IBC enables higher output rates and improved gauge uniformity';
  }

  return { recommended, airFlow, notes };
}

// Calculate gauge control recommendations
function calculateGaugeControl(
  gauge: number,
  targetOD: number,
  material: MaterialType
): { targetVariation: string; dieGapSetting: string; recommendations: string[] } {
  const dieSize = getDieSize(targetOD);

  // Target variation based on gauge
  let targetVariation: string;
  if (gauge < 1) {
    targetVariation = '±5% (tight control required for thin gauge)';
  } else if (gauge < 3) {
    targetVariation = '±5-7% (standard tolerance)';
  } else {
    targetVariation = '±7-10% (relaxed tolerance acceptable)';
  }

  // Die gap setting (roughly 10-20x final gauge for typical BUR)
  const estimatedDieGap = gauge * 15; // mils
  const dieGapSetting = `~${estimatedDieGap.toFixed(0)} mils (${(estimatedDieGap / 1000).toFixed(3)}")`;

  const recommendations: string[] = [
    'Measure gauge at minimum 8 points around circumference',
    'Use automatic gauge control (AGC) if available',
    `Verify die gap uniformity (target ±0.001" on ${dieSize}" die)`,
  ];

  if (material === 'HDPE') {
    recommendations.push('HDPE gauge sensitive to cooling - balance air ring first');
  }
  if (gauge < 1) {
    recommendations.push('Thin gauge: small die adjustments have large effect');
  }

  return { targetVariation, dieGapSetting, recommendations };
}

// Assess bubble stability
function assessBubbleStability(
  inputs: OptimizeInputs,
  bur: number
): { rating: 'stable' | 'moderate' | 'challenging'; factors: string[]; recommendations: string[] } {
  const factors: string[] = [];
  const recommendations: string[] = [];
  let stabilityScore = 100;

  // BUR effects on stability
  if (bur > 3.5) {
    stabilityScore -= 20;
    factors.push('High BUR increases bubble sensitivity');
    recommendations.push('Ensure uniform air ring cooling at high BUR');
  } else if (bur < 2.0) {
    stabilityScore -= 10;
    factors.push('Low BUR may cause MD/TD imbalance');
  }

  // Gauge effects
  if (inputs.targetGauge < 0.75) {
    stabilityScore -= 25;
    factors.push('Very thin gauge highly sensitive to disturbances');
    recommendations.push('Minimize drafts and air currents around tower');
    recommendations.push('Consider bubble cage or guide system');
  } else if (inputs.targetGauge < 1.5) {
    stabilityScore -= 10;
    factors.push('Thin gauge moderately sensitive');
  }

  // Production rate effects
  if (inputs.productionRate > 400) {
    stabilityScore -= 15;
    factors.push('High output rate can challenge stability');
    recommendations.push('Verify adequate cooling capacity');
  }

  // Material effects
  if (inputs.material === 'LLDPE') {
    stabilityScore -= 5;
    factors.push('LLDPE has higher melt strength - generally stable');
  } else if (inputs.material === 'LDPE') {
    factors.push('LDPE excellent bubble stability');
  } else if (inputs.material === 'HDPE') {
    stabilityScore -= 10;
    factors.push('HDPE lower melt strength - monitor closely');
    recommendations.push('Maintain consistent melt temperature');
  } else if (inputs.material === 'EVOH') {
    stabilityScore -= 15;
    factors.push('EVOH narrow processing window affects stability');
    recommendations.push('Precise temperature control essential');
  }

  // Large diameter effects
  if (inputs.targetOD > 40) {
    stabilityScore -= 10;
    factors.push('Large bubble diameter more prone to oscillation');
    recommendations.push('Consider IBC for improved stability');
  }

  // Always add baseline recommendations
  recommendations.push('Maintain steady extruder output (consistent melt pressure)');

  let rating: 'stable' | 'moderate' | 'challenging';
  if (stabilityScore >= 75) {
    rating = 'stable';
  } else if (stabilityScore >= 50) {
    rating = 'moderate';
  } else {
    rating = 'challenging';
  }

  return { rating, factors, recommendations };
}

// Assess confidence in recommendations
function assessConfidence(
  inputs: OptimizeInputs
): { level: 'high' | 'medium' | 'low'; reasons: string[] } {
  const reasons: string[] = [];
  let score = 100;

  // Check if production rate is reasonable
  if (inputs.productionRate < 50) {
    score -= 20;
    reasons.push('Low production rate may require special considerations');
  }
  if (inputs.productionRate > 500) {
    score -= 15;
    reasons.push('High production rate - verify equipment capacity');
  }

  // Check gauge
  if (inputs.targetGauge < 0.5) {
    score -= 25;
    reasons.push('Very thin gauge - process stability may be challenging');
  }
  if (inputs.targetGauge > 10) {
    score -= 15;
    reasons.push('Heavy gauge - monitor cooling capacity');
  }

  // Check OD
  if (inputs.targetOD < 5) {
    score -= 10;
    reasons.push('Small diameter - BUR may be limited');
  }
  if (inputs.targetOD > 60) {
    score -= 10;
    reasons.push('Large diameter - ensure adequate die size');
  }

  // Material-specific considerations
  if (inputs.material === 'EVOH') {
    score -= 10;
    reasons.push('EVOH requires careful moisture control');
  }

  if (score >= 80) {
    return { level: 'high', reasons };
  } else if (score >= 60) {
    return { level: 'medium', reasons };
  } else {
    return { level: 'low', reasons };
  }
}

// Identify critical parameters for the operation
function identifyCriticalParameters(inputs: OptimizeInputs): string[] {
  const critical: string[] = [];

  if (inputs.material === 'EVOH') {
    critical.push('Material drying (target <0.05% moisture)');
    critical.push('Die temperature uniformity (±5°F)');
  }

  if (inputs.material === 'HDPE') {
    critical.push('Melt temperature control (melt fracture prevention)');
    critical.push('Cooling rate (crystallinity control)');
  }

  if (inputs.targetGauge < 1) {
    critical.push('Bubble stability (thin gauge sensitivity)');
    critical.push('Line speed consistency');
  }

  if (inputs.productionRate > 300) {
    critical.push('Melt pressure monitoring');
    critical.push('Adequate cooling capacity');
  }

  // Always critical
  critical.push('Die gap uniformity for gauge control');
  critical.push('Frost line height consistency');

  return critical;
}

export function optimizeParameters(inputs: OptimizeInputs): RecommendedSettings {
  const materialProps = getMaterial(inputs.material);

  // Calculate barrel temperatures (use recommended values, may adjust based on rate)
  const tempOffset = inputs.productionRate > 300 ? 10 : 0; // Slightly higher temps for high output

  const barrelTemps = {
    feed: materialProps.barrelTemperatures.feed.recommended,
    compression: materialProps.barrelTemperatures.compression.recommended + tempOffset,
    metering: materialProps.barrelTemperatures.metering.recommended + tempOffset,
    die: materialProps.barrelTemperatures.die.recommended + tempOffset,
  };

  const screwSpeed = calculateScrewSpeed(inputs.productionRate, inputs.material);
  const lineSpeed = calculateLineSpeed(
    inputs.productionRate,
    inputs.targetOD,
    inputs.targetGauge,
    inputs.material
  );
  const meltPressure = calculateMeltPressure(inputs.productionRate, inputs.material);
  const airRing = calculateAirRing(inputs.productionRate, inputs.material, inputs.targetOD);
  const blowUpRatio = calculateBUR(inputs.targetOD, inputs.material);

  // New calculations
  const frostLine = calculateFrostLine(inputs.targetOD, inputs.material, inputs.productionRate);
  const nipRollers = calculateNipRollers(lineSpeed, inputs.targetGauge, inputs.material);
  const ibc = calculateIBC(inputs.productionRate, inputs.targetOD, inputs.targetGauge, inputs.material);
  const gaugeControl = calculateGaugeControl(inputs.targetGauge, inputs.targetOD, inputs.material);
  const bubbleStability = assessBubbleStability(inputs, blowUpRatio);

  const confidenceResult = assessConfidence(inputs);
  const criticalParams = identifyCriticalParameters(inputs);

  // Build notes
  const notes = [...materialProps.notes];
  if (confidenceResult.reasons.length > 0) {
    notes.push(...confidenceResult.reasons);
  }

  // Add layflat info
  const layflat = calculateLayflat(inputs.targetOD);
  notes.unshift(`Target layflat width: ${layflat.toFixed(2)}" (${(layflat * 2).toFixed(2)}" full width)`);

  return {
    barrelTemps,
    screwSpeed,
    lineSpeed,
    meltPressure,
    airRing,
    blowUpRatio,
    frostLine,
    nipRollers,
    ibc,
    gaugeControl,
    bubbleStability,
    confidence: confidenceResult.level,
    notes,
    criticalParameters: criticalParams,
  };
}
