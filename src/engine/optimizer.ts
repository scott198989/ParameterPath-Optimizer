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

// Calculate optimal blow-up ratio based on OD and die diameter
function calculateBUR(targetOD: number, material: MaterialType): number {
  const materialProps = getMaterial(material);
  // Assume typical die diameters based on target OD
  // BUR = bubble diameter / die diameter
  // Typical die sizes: 4", 6", 8", 10", 12" etc.

  // Select die size based on target OD
  let dieSize: number;
  if (targetOD <= 10) {
    dieSize = 4;
  } else if (targetOD <= 20) {
    dieSize = 6;
  } else if (targetOD <= 35) {
    dieSize = 8;
  } else if (targetOD <= 50) {
    dieSize = 10;
  } else {
    dieSize = 12;
  }

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
  // These are qualitative recommendations

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
    confidence: confidenceResult.level,
    notes,
    criticalParameters: criticalParams,
  };
}
