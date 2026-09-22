import { renderToStaticMarkup } from 'react-dom/server.browser'
import { writeFileSync } from 'node:fs'
import { ProductIllustration } from '@/components/shared/ProductIllustration'

const samples = [
    { category: 'mugs' as const, color: '#FFB3D1', printText: 'Café primero' },
    { category: 'mugs' as const, color: '#2E2438', printText: '¡Sorpresa!' },
    { category: 'tees' as const, color: '#A8D8FF', printText: 'Modo finde' },
    { category: 'tees' as const, color: '#C9F2E0', printText: 'Equipo Salazar 2026' },
    { category: 'keychains' as const, color: '#C0AEFF', printText: 'Mi gente' },
    { category: 'keychains' as const, color: '#FFD979', printText: 'Personalizable' },
]

const body = samples
    .map((s) => `<div class="cell">${renderToStaticMarkup(<ProductIllustration {...s} size="lg" />)}</div>`)
    .join('')

writeFileSync(
    process.argv[2],
    `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>body{margin:0;background:#FFF9FB;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:16px;font-family:Fredoka}
.cell{background:#fff;border-radius:24px;padding:12px;display:flex;align-items:center;justify-content:center}
svg{width:100%;height:auto}</style></head><body>${body}</body></html>`,
)
