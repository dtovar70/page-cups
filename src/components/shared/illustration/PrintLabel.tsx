import { wrapPrintText } from '@/components/shared/illustration/wrapPrintText'

export interface PrintLabelProps {
    text: string
    /** Horizontal center of the printable area. */
    x: number
    /** Vertical center of the printable area. */
    y: number
    /** Usable width of the printable area, used to scale the font down. */
    width: number
    color: string
    maxLines?: number
}

const CHAR_WIDTH_RATIO = 0.58
const MAX_FONT_SIZE = 23
const MIN_FONT_SIZE = 9

export function PrintLabel({ text, x, y, width, color, maxLines = 3 }: PrintLabelProps) {
    const lines = wrapPrintText(text, maxLines)
    if (lines.length === 0) return null

    const longest = lines.reduce((max, line) => Math.max(max, line.length), 1)
    const fontSize = Math.round(
        Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, width / (longest * CHAR_WIDTH_RATIO))),
    )
    const lineHeight = Math.round(fontSize * 1.16)
    const firstLineOffset = -((lines.length - 1) * lineHeight) / 2

    return (
        <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Fredoka, ui-rounded, system-ui, sans-serif"
            fontWeight={600}
            fontSize={fontSize}
            fill={color}
        >
            {lines.map((line, index) => (
                <tspan
                    key={`${index}-${line}`}
                    x={x}
                    dy={index === 0 ? firstLineOffset : lineHeight}
                >
                    {line}
                </tspan>
            ))}
        </text>
    )
}
