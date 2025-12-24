import type { MaterialType, MaterialProperties } from './types';

// Processing parameters based on polymer processing engineering references
// Sources: Plastics Engineering Handbook, Blown Film Extrusion Guide, SPE Technical Papers

export const MATERIALS: Record<MaterialType, MaterialProperties> = {
  HDPE: {
    name: 'HDPE',
    fullName: 'High-Density Polyethylene',
    meltTempRange: { min: 400, max: 500 }, // °F
    processingTempRange: { min: 350, max: 550 },
    barrelTemperatures: {
      feed: { min: 300, max: 350, recommended: 325 },
      compression: { min: 360, max: 420, recommended: 390 },
      metering: { min: 400, max: 460, recommended: 430 },
      die: { min: 410, max: 480, recommended: 445 },
    },
    screwSpeedRange: { min: 30, max: 120 }, // RPM
    meltPressureRange: { min: 2500, max: 5500 }, // PSI
    blowUpRatioRange: { min: 2.0, max: 4.0 },
    frostLineHeightFactor: 1.2,
    notes: [
      'HDPE requires higher melt temps than LDPE for proper flow',
      'Sensitive to screw speed - too fast causes melt fracture',
      'Good mechanical properties but narrower processing window',
      'May require melt pressure monitoring for quality control',
    ],
  },

  LDPE: {
    name: 'LDPE',
    fullName: 'Low-Density Polyethylene',
    meltTempRange: { min: 340, max: 450 }, // °F
    processingTempRange: { min: 300, max: 500 },
    barrelTemperatures: {
      feed: { min: 280, max: 330, recommended: 305 },
      compression: { min: 320, max: 380, recommended: 350 },
      metering: { min: 360, max: 420, recommended: 390 },
      die: { min: 370, max: 440, recommended: 405 },
    },
    screwSpeedRange: { min: 40, max: 150 }, // RPM
    meltPressureRange: { min: 2000, max: 4500 }, // PSI
    blowUpRatioRange: { min: 1.5, max: 3.5 },
    frostLineHeightFactor: 1.0,
    notes: [
      'LDPE has excellent processability and wide operating window',
      'Good optical clarity possible at lower melt temps',
      'Branched structure allows high output rates',
      'Less sensitive to processing variations than HDPE',
    ],
  },

  LLDPE: {
    name: 'LLDPE',
    fullName: 'Linear Low-Density Polyethylene',
    meltTempRange: { min: 360, max: 480 }, // °F
    processingTempRange: { min: 320, max: 520 },
    barrelTemperatures: {
      feed: { min: 290, max: 340, recommended: 315 },
      compression: { min: 340, max: 400, recommended: 370 },
      metering: { min: 380, max: 440, recommended: 410 },
      die: { min: 390, max: 460, recommended: 425 },
    },
    screwSpeedRange: { min: 35, max: 130 }, // RPM
    meltPressureRange: { min: 3000, max: 6000 }, // PSI
    blowUpRatioRange: { min: 2.0, max: 4.5 },
    frostLineHeightFactor: 1.1,
    notes: [
      'LLDPE requires higher motor load than LDPE - monitor amps',
      'Superior puncture and tear resistance',
      'Higher melt viscosity - may need higher temps',
      'Often blended with LDPE for improved processability',
    ],
  },

  EVOH: {
    name: 'EVOH',
    fullName: 'Ethylene Vinyl Alcohol',
    meltTempRange: { min: 380, max: 440 }, // °F
    processingTempRange: { min: 350, max: 470 },
    barrelTemperatures: {
      feed: { min: 320, max: 360, recommended: 340 },
      compression: { min: 360, max: 400, recommended: 380 },
      metering: { min: 380, max: 430, recommended: 405 },
      die: { min: 390, max: 440, recommended: 415 },
    },
    screwSpeedRange: { min: 20, max: 80 }, // RPM - lower due to sensitivity
    meltPressureRange: { min: 2800, max: 5000 }, // PSI
    blowUpRatioRange: { min: 1.8, max: 3.0 },
    frostLineHeightFactor: 0.9,
    notes: [
      'EVOH is hygroscopic - material must be dried before processing',
      'Narrow processing window - temperature control is critical',
      'Excellent gas barrier properties but moisture sensitive',
      'Often used as barrier layer in coextrusion',
      'Lower screw speeds recommended to prevent degradation',
    ],
  },
};

export function getMaterial(type: MaterialType): MaterialProperties {
  return MATERIALS[type];
}

export function getAllMaterials(): MaterialType[] {
  return Object.keys(MATERIALS) as MaterialType[];
}
