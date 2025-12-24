import type { DefectType, DefectCause } from './types';

interface DefectInfo {
  name: string;
  description: string;
  causes: DefectCause[];
  generalRecommendations: string[];
}

// Defect-cause matrix based on blown film troubleshooting guides
// and polymer processing fundamentals

export const DEFECT_DATABASE: Record<DefectType, DefectInfo> = {
  melt_fracture: {
    name: 'Melt Fracture',
    description:
      'Surface distortion appearing as irregular roughness, often with a "sharkskin" or helical pattern. Caused by excessive shear stress at the die exit.',
    causes: [
      {
        cause: 'Excessive output rate',
        probability: 'high',
        adjustments: [
          'Reduce screw speed by 10-20%',
          'Decrease line speed proportionally',
          'Consider larger die gap',
        ],
        explanation:
          'High throughput increases wall shear stress beyond the critical value for the polymer.',
      },
      {
        cause: 'Melt temperature too low',
        probability: 'high',
        adjustments: [
          'Increase metering zone temp by 10-20°F',
          'Increase die temp by 10-15°F',
          'Allow stabilization time (10-15 min)',
        ],
        explanation:
          'Lower temperatures increase melt viscosity, raising shear stress at the die wall.',
      },
      {
        cause: 'Die land length insufficient',
        probability: 'medium',
        adjustments: [
          'Use die with longer land length (8:1 to 15:1 L/D ratio)',
          'If not possible, reduce output rate further',
        ],
        explanation:
          'Short die lands do not allow enough stress relaxation before the melt exits.',
      },
      {
        cause: 'Sharp die entry angle',
        probability: 'medium',
        adjustments: [
          'Consider die with streamlined entry geometry',
          'Reduce output as a workaround',
        ],
        explanation:
          'Abrupt flow constrictions create extensional stress concentrations.',
      },
    ],
    generalRecommendations: [
      'Start by increasing melt temperature - most common fix',
      'If increasing temp does not help, reduce throughput',
      'For persistent issues, consider processing aids (fluoropolymer PPA)',
    ],
  },

  shark_skin: {
    name: 'Shark Skin',
    description:
      'Fine surface roughness with a regular pattern, typically appearing before full melt fracture. A milder form of surface defect related to die exit stress.',
    causes: [
      {
        cause: 'Die lip temperature too low',
        probability: 'high',
        adjustments: [
          'Increase die zone temperature by 5-15°F',
          'Check die heater band functionality',
          'Ensure uniform die lip temperature',
        ],
        explanation:
          'Cool die lips increase local viscosity and stress at the exit point.',
      },
      {
        cause: 'Output rate near critical limit',
        probability: 'high',
        adjustments: [
          'Reduce screw speed by 5-15%',
          'Monitor surface quality as you adjust',
        ],
        explanation:
          'Operating near the critical shear rate threshold causes intermittent surface defects.',
      },
      {
        cause: 'Resin grade not suited for application',
        probability: 'medium',
        adjustments: [
          'Consider resin with higher melt index (lower viscosity)',
          'Try resin designed for high-speed extrusion',
        ],
        explanation:
          'Some resin grades have lower critical shear stress thresholds.',
      },
    ],
    generalRecommendations: [
      'Shark skin often precedes full melt fracture - address early',
      'Processing aids (0.02-0.1% fluoropolymer) very effective',
      'Die conditioning may help - run higher temp briefly',
    ],
  },

  die_lines: {
    name: 'Die Lines',
    description:
      'Visible lines or streaks running in the machine direction, caused by flow irregularities or die surface issues.',
    causes: [
      {
        cause: 'Die lip damage or buildup',
        probability: 'high',
        adjustments: [
          'Stop and clean die lips with brass tools',
          'Inspect for nicks or scratches',
          'Polish die lips if damaged',
        ],
        explanation:
          'Any surface irregularity at the die exit will transfer to the film.',
      },
      {
        cause: 'Die temperature variation',
        probability: 'high',
        adjustments: [
          'Check all die zone heaters',
          'Verify thermocouple readings',
          'Balance die temperatures (within ±5°F)',
        ],
        explanation:
          'Temperature variations cause viscosity differences and flow irregularities.',
      },
      {
        cause: 'Contamination in melt',
        probability: 'medium',
        adjustments: [
          'Check hopper and feed throat for contamination',
          'Purge system thoroughly',
          'Verify material is clean and dry',
        ],
        explanation:
          'Gels or contaminants can hang up at die lips causing streaks.',
      },
      {
        cause: 'Screen pack issues',
        probability: 'medium',
        adjustments: [
          'Replace screen pack',
          'Check breaker plate for damage',
          'Use appropriate screen mesh for material',
        ],
        explanation:
          'Torn screens or blocked areas cause flow channeling.',
      },
    ],
    generalRecommendations: [
      'Die lines are almost always a die condition issue',
      'Regular die lip cleaning prevents most problems',
      'Keep spare die lip inserts on hand',
    ],
  },

  voids_bubbles: {
    name: 'Voids / Bubbles',
    description:
      'Trapped air or volatiles appearing as bubbles in the film wall, reducing strength and clarity.',
    causes: [
      {
        cause: 'Moisture in material',
        probability: 'high',
        adjustments: [
          'Dry material per manufacturer specs',
          'Check hopper dryer operation',
          'Verify dew point is adequate (-40°F typical)',
        ],
        explanation:
          'Moisture vaporizes at melt temperature, creating steam bubbles.',
      },
      {
        cause: 'Feed throat problems',
        probability: 'high',
        adjustments: [
          'Check for feed throat flooding',
          'Reduce feed throat cooling if frosting',
          'Verify consistent pellet feed',
        ],
        explanation:
          'Air can become entrapped in the feed section and carried forward.',
      },
      {
        cause: 'Melt temperature too high',
        probability: 'medium',
        adjustments: [
          'Reduce barrel temperatures by 10-20°F',
          'Reduce screw speed (lowers shear heating)',
        ],
        explanation:
          'Excessive temperature can cause material degradation and gas generation.',
      },
      {
        cause: 'Volatile additives',
        probability: 'low',
        adjustments: [
          'Check additive specifications',
          'Consider pre-compounded materials',
          'Reduce barrel temperatures if possible',
        ],
        explanation:
          'Some slip agents or other additives have low volatilization temperatures.',
      },
    ],
    generalRecommendations: [
      'Always dry hygroscopic materials (EVOH, nylon, etc.)',
      'Maintain proper feed section conditions',
      'Voids reduce dart impact and tear strength significantly',
    ],
  },

  warping: {
    name: 'Warping',
    description:
      'Film does not lay flat, exhibits curl or distortion. Can be MD (machine direction) or TD (transverse direction) dominant.',
    causes: [
      {
        cause: 'Uneven cooling',
        probability: 'high',
        adjustments: [
          'Balance air ring air flow around circumference',
          'Check for blocked air ring ports',
          'Verify uniform frost line height',
        ],
        explanation:
          'Differential cooling rates cause uneven shrinkage and stress.',
      },
      {
        cause: 'MD/TD orientation imbalance',
        probability: 'high',
        adjustments: [
          'Adjust blow-up ratio (BUR)',
          'Modify frost line height',
          'Balance draw-down ratio with BUR',
        ],
        explanation:
          'Unbalanced molecular orientation causes directional shrinkage differences.',
      },
      {
        cause: 'Frost line too low or high',
        probability: 'medium',
        adjustments: [
          'Adjust air ring cooling capacity',
          'Modify output rate if needed',
          'Target frost line at 3-6x die diameter',
        ],
        explanation:
          'Frost line position affects crystallization and orientation development.',
      },
    ],
    generalRecommendations: [
      'Measure actual BUR and compare to target',
      'Check film properties in MD and TD - balanced is ideal',
      'IBC (Internal Bubble Cooling) helps if available',
    ],
  },

  inconsistent_wall_thickness: {
    name: 'Inconsistent Wall Thickness',
    description:
      'Gauge variation around the circumference or along the length of the film, causing weak spots and winding problems.',
    causes: [
      {
        cause: 'Die gap not uniform',
        probability: 'high',
        adjustments: [
          'Measure and adjust die gap around circumference',
          'Use feeler gauges to verify uniformity',
          'Target ±0.001" variation',
        ],
        explanation:
          'Die gap variations directly translate to thickness variations.',
      },
      {
        cause: 'Unbalanced air ring',
        probability: 'high',
        adjustments: [
          'Level air ring precisely',
          'Balance air flow at multiple points',
          'Check air ring lip gap uniformity',
        ],
        explanation:
          'Cooling variations cause differential drawdown around bubble.',
      },
      {
        cause: 'Temperature variations in die',
        probability: 'medium',
        adjustments: [
          'Check all die zone heaters',
          'Verify proper heater coverage',
          'Look for drafts affecting die',
        ],
        explanation:
          'Hot spots have lower viscosity and flow more material.',
      },
      {
        cause: 'Melt temperature instability',
        probability: 'medium',
        adjustments: [
          'Check barrel temperature stability',
          'Verify consistent screw speed',
          'Ensure steady material feed',
        ],
        explanation:
          'Melt temp fluctuations cause viscosity changes and output variations.',
      },
    ],
    generalRecommendations: [
      'Gauge variation should be <±5% of nominal',
      'Automatic gauge control systems help significantly',
      'Oscillating haul-off can spread minor variations',
    ],
  },

  surface_roughness: {
    name: 'Surface Roughness',
    description:
      'General loss of surface gloss or smoothness, not related to melt fracture. May affect print quality and optical properties.',
    causes: [
      {
        cause: 'Melt temperature too low',
        probability: 'high',
        adjustments: [
          'Increase die temperature by 10-20°F',
          'Increase metering zone temperature',
          'Allow melt to homogenize longer',
        ],
        explanation:
          'Insufficient melt temperature prevents good surface finish development.',
      },
      {
        cause: 'Cooling too rapid',
        probability: 'high',
        adjustments: [
          'Reduce air ring velocity',
          'Raise frost line height',
          'Consider lower volume, higher velocity air',
        ],
        explanation:
          'Rapid quench freezes surface before it can smooth out.',
      },
      {
        cause: 'Incompatible additives',
        probability: 'medium',
        adjustments: [
          'Review additive package compatibility',
          'Check for slip/antiblock migration issues',
          'Consider different additive levels',
        ],
        explanation:
          'Some additives can bloom to surface and cause haze or roughness.',
      },
    ],
    generalRecommendations: [
      'Surface quality is very sensitive to die temperature',
      'Corona treatment level affects apparent roughness',
      'Some roughness may be acceptable depending on application',
    ],
  },
};

export function getDefectInfo(defect: DefectType): DefectInfo {
  return DEFECT_DATABASE[defect];
}

export function getAllDefects(): DefectType[] {
  return Object.keys(DEFECT_DATABASE) as DefectType[];
}

export function getDefectDisplayName(defect: DefectType): string {
  return DEFECT_DATABASE[defect].name;
}
