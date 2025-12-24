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

  gauge_bands: {
    name: 'Gauge Bands',
    description:
      'Periodic thickness variations appearing as visible bands or rings around the film circumference. Often creates roll hardness variations.',
    causes: [
      {
        cause: 'Air ring instability',
        probability: 'high',
        adjustments: [
          'Check air ring for vibration or flutter',
          'Verify blower output is steady',
          'Inspect air ring for damage or blockage',
        ],
        explanation:
          'Pulsating air flow causes cyclical cooling variations that create bands.',
      },
      {
        cause: 'Extruder output surging',
        probability: 'high',
        adjustments: [
          'Check screw speed consistency',
          'Verify feed consistency (no bridging)',
          'Inspect screw and barrel for wear',
        ],
        explanation:
          'Variations in melt delivery create periodic thickness changes.',
      },
      {
        cause: 'Die bolt pattern interference',
        probability: 'medium',
        adjustments: [
          'Check die bolt torque uniformity',
          'Verify die is not warped',
          'Consider thermal bolt adjustments',
        ],
        explanation:
          'Die bolts can create local flow restrictions that cause repeating patterns.',
      },
      {
        cause: 'Haul-off speed variation',
        probability: 'medium',
        adjustments: [
          'Check nip roll drive for consistency',
          'Verify encoder/tachometer operation',
          'Inspect rolls for damage or buildup',
        ],
        explanation:
          'Speed variations in takeoff create periodic gauge changes.',
      },
    ],
    generalRecommendations: [
      'Gauge bands often have mechanical origin - check rotating equipment',
      'Oscillating haul-off can mask minor banding',
      'Frequency analysis can help identify the source',
    ],
  },

  wrinkles: {
    name: 'Wrinkles',
    description:
      'Film surface exhibits creases or folds, often appearing after collapsing frame or at winder. Affects roll quality and downstream converting.',
    causes: [
      {
        cause: 'Uneven film tension',
        probability: 'high',
        adjustments: [
          'Balance collapsing frame geometry',
          'Check guide roll alignment',
          'Verify uniform nip pressure across width',
        ],
        explanation:
          'Tension differences across the web cause material to bunch up.',
      },
      {
        cause: 'Gauge variation',
        probability: 'high',
        adjustments: [
          'Improve gauge uniformity (see gauge control)',
          'Balance air ring cooling',
          'Adjust die gap as needed',
        ],
        explanation:
          'Thick and thin areas travel at different effective speeds, creating wrinkles.',
      },
      {
        cause: 'Collapsing frame issues',
        probability: 'medium',
        adjustments: [
          'Verify frame angle is appropriate',
          'Check for worn or damaged guide boards',
          'Ensure bubble is centered in frame',
        ],
        explanation:
          'Poor bubble collapse geometry causes uneven layflat.',
      },
      {
        cause: 'Static electricity',
        probability: 'low',
        adjustments: [
          'Install static elimination equipment',
          'Increase ambient humidity if possible',
          'Ground all equipment properly',
        ],
        explanation:
          'Static can cause film layers to attract/repel unpredictably.',
      },
    ],
    generalRecommendations: [
      'Wrinkles often originate at the collapsing frame',
      'Check all roller alignments in film path',
      'Proper winder tension control is essential',
    ],
  },

  blocking: {
    name: 'Blocking',
    description:
      'Film layers stick together on the roll, making unwinding difficult or causing film damage. Common issue with certain additives or storage conditions.',
    causes: [
      {
        cause: 'Insufficient antiblock additive',
        probability: 'high',
        adjustments: [
          'Increase antiblock concentration (0.1-0.3% typical)',
          'Verify additive is properly dispersed',
          'Consider different antiblock type (silica vs talc)',
        ],
        explanation:
          'Antiblock creates micro-roughness that prevents intimate layer contact.',
      },
      {
        cause: 'Excessive winding tension',
        probability: 'high',
        adjustments: [
          'Reduce winder tension 10-20%',
          'Use taper tension profile (decreasing toward core)',
          'Avoid over-tight rolls',
        ],
        explanation:
          'High pressure between layers promotes blocking.',
      },
      {
        cause: 'Film too warm at winder',
        probability: 'medium',
        adjustments: [
          'Increase cooling before winder',
          'Reduce line speed if needed',
          'Add cooling rolls if available',
        ],
        explanation:
          'Warm film is softer and more prone to blocking.',
      },
      {
        cause: 'Storage conditions',
        probability: 'medium',
        adjustments: [
          'Store rolls at lower temperature',
          'Avoid stacking heavy rolls',
          'Allow rolls to age before shipping',
        ],
        explanation:
          'Heat and pressure during storage worsen blocking over time.',
      },
    ],
    generalRecommendations: [
      'Blocking often develops during storage, not immediately',
      'Test blocking resistance after 24-48 hours',
      'Slip additives can worsen blocking - balance carefully',
    ],
  },

  gels: {
    name: 'Gels',
    description:
      'Small, hard particles visible in the film, appearing as specs or fish-eyes. Can be crosslinked polymer, contamination, or undispersed additives.',
    causes: [
      {
        cause: 'Degraded material in system',
        probability: 'high',
        adjustments: [
          'Purge extruder thoroughly',
          'Check for dead spots in flow path',
          'Reduce residence time if possible',
        ],
        explanation:
          'Material that sits too long at temperature can crosslink and form gels.',
      },
      {
        cause: 'Contamination',
        probability: 'high',
        adjustments: [
          'Inspect raw material for contamination',
          'Clean hopper and feed system',
          'Check regrind quality and cleanliness',
        ],
        explanation:
          'Foreign material or degraded regrind creates visible defects.',
      },
      {
        cause: 'Screen pack breakthrough',
        probability: 'medium',
        adjustments: [
          'Replace screen pack',
          'Use finer mesh screens',
          'Verify breaker plate condition',
        ],
        explanation:
          'Damaged screens allow gels to pass through.',
      },
      {
        cause: 'Additive dispersion issues',
        probability: 'medium',
        adjustments: [
          'Use pre-compounded materials',
          'Verify masterbatch let-down ratio',
          'Increase mixing (screw design or speed)',
        ],
        explanation:
          'Undispersed additives can appear as gel-like defects.',
      },
    ],
    generalRecommendations: [
      'Gels are often "built up" over time - regular purging helps',
      'Fine screen packs (150+ mesh) catch most gels',
      'Reduce barrel temperatures if degradation suspected',
    ],
  },

  poor_clarity: {
    name: 'Poor Clarity',
    description:
      'Film appears hazy, cloudy, or has reduced transparency. Affects appearance and may indicate processing issues.',
    causes: [
      {
        cause: 'Excessive crystallinity',
        probability: 'high',
        adjustments: [
          'Increase cooling rate (raise frost line)',
          'Reduce melt temperature slightly',
          'Increase quench air velocity',
        ],
        explanation:
          'Large crystals scatter light and reduce clarity. Fast cooling creates smaller crystals.',
      },
      {
        cause: 'Surface roughness',
        probability: 'high',
        adjustments: [
          'Increase melt/die temperature',
          'Optimize frost line height',
          'Reduce cooling rate initially',
        ],
        explanation:
          'Rough surfaces scatter light and appear hazy.',
      },
      {
        cause: 'Additive bloom',
        probability: 'medium',
        adjustments: [
          'Reduce slip/antiblock levels',
          'Change additive types',
          'Adjust processing temperatures',
        ],
        explanation:
          'Additives migrating to surface create haze.',
      },
      {
        cause: 'Moisture in material',
        probability: 'medium',
        adjustments: [
          'Dry material properly',
          'Check hopper dryer operation',
          'Verify material storage conditions',
        ],
        explanation:
          'Water vapor creates micro-voids that scatter light.',
      },
    ],
    generalRecommendations: [
      'Clarity is very material-dependent - LDPE typically best',
      'HDPE inherently more hazy due to higher crystallinity',
      'Balance clarity against other properties (stiffness, strength)',
    ],
  },

  bubble_instability: {
    name: 'Bubble Instability',
    description:
      'Bubble oscillates, breathes, or moves erratically. Can be helical (corkscrew), draw resonance, or random motion. Causes gauge variation and production issues.',
    causes: [
      {
        cause: 'Melt temperature variation',
        probability: 'high',
        adjustments: [
          'Stabilize barrel temperatures',
          'Check for screw/barrel wear',
          'Verify consistent material feed',
        ],
        explanation:
          'Temperature changes affect melt viscosity and bubble strength.',
      },
      {
        cause: 'Air ring imbalance',
        probability: 'high',
        adjustments: [
          'Level air ring precisely',
          'Balance air flow around circumference',
          'Check for blocked or damaged ports',
        ],
        explanation:
          'Uneven cooling causes asymmetric forces on the bubble.',
      },
      {
        cause: 'Inadequate melt strength',
        probability: 'medium',
        adjustments: [
          'Reduce melt temperature',
          'Decrease output rate',
          'Consider different resin grade',
        ],
        explanation:
          'Weak melt cannot support the bubble weight and internal pressure.',
      },
      {
        cause: 'Draft or air currents',
        probability: 'medium',
        adjustments: [
          'Shield bubble from drafts',
          'Install bubble cage if needed',
          'Check building HVAC systems',
        ],
        explanation:
          'External air movement disturbs the delicate bubble equilibrium.',
      },
      {
        cause: 'Improper BUR or frost line',
        probability: 'medium',
        adjustments: [
          'Adjust blow-up ratio',
          'Modify frost line height',
          'Balance cooling with output rate',
        ],
        explanation:
          'Wrong BUR or frost line position can cause natural instability modes.',
      },
    ],
    generalRecommendations: [
      'Draw resonance often occurs at specific output rates - adjust slightly',
      'Helical instability usually air ring related',
      'IBC can help stabilize large or thin-gauge bubbles',
      'Consistent melt pressure is key to stable operation',
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
