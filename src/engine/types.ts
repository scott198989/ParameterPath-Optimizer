export type MaterialType = 'HDPE' | 'LDPE' | 'LLDPE' | 'EVOH';

export type DefectType =
  | 'melt_fracture'
  | 'shark_skin'
  | 'die_lines'
  | 'voids_bubbles'
  | 'warping'
  | 'inconsistent_wall_thickness'
  | 'surface_roughness'
  | 'gauge_bands'
  | 'wrinkles'
  | 'blocking'
  | 'gels'
  | 'poor_clarity'
  | 'bubble_instability';

export interface BarrelTemperatures {
  feed: { min: number; max: number; recommended: number };
  compression: { min: number; max: number; recommended: number };
  metering: { min: number; max: number; recommended: number };
  die: { min: number; max: number; recommended: number };
}

export interface MaterialProperties {
  name: string;
  fullName: string;
  meltTempRange: { min: number; max: number };
  processingTempRange: { min: number; max: number };
  barrelTemperatures: BarrelTemperatures;
  screwSpeedRange: { min: number; max: number };
  meltPressureRange: { min: number; max: number };
  blowUpRatioRange: { min: number; max: number };
  frostLineHeightFactor: number;
  notes: string[];
}

export interface OptimizeInputs {
  material: MaterialType;
  targetOD: number; // inches
  targetGauge: number; // mils (thousandths of inch)
  productionRate: number; // lbs/hr
}

export interface RecommendedSettings {
  barrelTemps: {
    feed: number;
    compression: number;
    metering: number;
    die: number;
  };
  screwSpeed: { min: number; max: number; recommended: number };
  lineSpeed: { min: number; max: number; recommended: number };
  meltPressure: { min: number; max: number; target: number };
  airRing: {
    lipGap: string;
    airVelocity: string;
    coolingCapacity: string;
  };
  blowUpRatio: number;
  frostLine: {
    heightRange: string;
    heightInches: { min: number; max: number };
    notes: string;
  };
  nipRollers: {
    speed: string;
    pressure: string;
    temperature: string;
  };
  ibc: {
    recommended: boolean;
    airFlow: string;
    notes: string;
  };
  gaugeControl: {
    targetVariation: string;
    dieGapSetting: string;
    recommendations: string[];
  };
  bubbleStability: {
    rating: 'stable' | 'moderate' | 'challenging';
    factors: string[];
    recommendations: string[];
  };
  confidence: 'high' | 'medium' | 'low';
  notes: string[];
  criticalParameters: string[];
}

export interface DiagnoseInputs {
  material: MaterialType;
  currentSettings: {
    meltTemp: number;
    screwSpeed: number;
    lineSpeed: number;
    dieTemp: number;
  };
  defect: DefectType;
}

export interface DefectCause {
  cause: string;
  probability: 'high' | 'medium' | 'low';
  adjustments: string[];
  explanation: string;
}

export interface DiagnoseResult {
  defect: DefectType;
  defectName: string;
  description: string;
  causes: DefectCause[];
  generalRecommendations: string[];
}
