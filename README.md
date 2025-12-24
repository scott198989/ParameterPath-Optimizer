# ParameterPath Optimizer

Expert system for plastic film extrusion parameter optimization and defect diagnosis.

## Features

### Optimize Parameters Mode
- Input target specifications (material, OD, gauge, production rate)
- Get recommended processing parameters:
  - Barrel zone temperatures (feed, compression, metering, die)
  - Screw speed (RPM)
  - Line speed (ft/min)
  - Melt pressure target
  - Air ring settings
- Confidence indicators and critical parameter notes

### Diagnose Defect Mode
- Select observed defect from common blown film issues
- Input current operating conditions
- Get ranked probable causes with specific adjustments
- Material-specific recommendations

### Supported Materials
- HDPE (High-Density Polyethylene)
- LDPE (Low-Density Polyethylene)
- LLDPE (Linear Low-Density Polyethylene)
- EVOH (Ethylene Vinyl Alcohol)

### Diagnosable Defects
- Melt fracture
- Shark skin
- Die lines
- Voids/bubbles
- Warping
- Inconsistent wall thickness
- Surface roughness

## Technical Approach

This tool uses a **rules-based expert system** rather than machine learning. Recommendations are derived from:
- Polymer processing fundamentals
- Material science principles
- Published processing windows from plastics engineering references

### Why Expert Systems?
- **Explainable**: Every recommendation traces to engineering principles
- **Predictable**: Same inputs always produce same outputs
- **Auditable**: Rules can be reviewed by process engineers
- **Safe**: No risk of hallucinating dangerous parameters

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Vercel

### Option 1: Vercel CLI
```bash
npx vercel
```

### Option 2: Connect Git Repository
1. Push to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel auto-detects Vite - no configuration needed
4. Click Deploy

The included `vercel.json` handles SPA routing automatically.

## Tech Stack
- React 19
- TypeScript
- Tailwind CSS 4
- Vite 7

## Disclaimer

Recommendations are starting points based on general polymer processing principles. Always verify with your specific equipment and follow facility safety procedures. This tool does not replace the judgment of an experienced process engineer.
