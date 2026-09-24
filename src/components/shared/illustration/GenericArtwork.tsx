import { PrintLabel } from '@/components/shared/illustration/PrintLabel'
import { readablePrintColor, type ArtworkProps } from '@/components/shared/illustration/artwork'
import { PALETTE } from '@/constants/theme.constant'

const LEFT_LOOP_PATH = 'M120 68 C 106 46 80 46 86 60 C 90 70 106 70 120 68 Z'
const RIGHT_LOOP_PATH = 'M120 68 C 134 46 160 46 154 60 C 150 70 134 70 120 68 Z'

/**
 * Neutral gift box for categories without a dedicated illustration: it reads as "a
 * personalized product" whatever the category sells, and the print sits on the front.
 */
export function GenericArtwork({ color, theme, printText }: ArtworkProps) {
    return (
        <g>
            <ellipse cx={120} cy={182} rx={66} ry={8} fill={PALETTE.ink} opacity={0.09} />

            <rect
                x={64}
                y={88}
                width={112}
                height={88}
                rx={12}
                fill={color}
                stroke={theme.stroke}
                strokeWidth={3}
                strokeOpacity={0.4}
            />
            <path
                d="M80 106 C 76 126 76 146 80 162"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={8}
                strokeLinecap="round"
                opacity={0.35}
            />

            <rect
                x={56}
                y={68}
                width={128}
                height={26}
                rx={10}
                fill={color}
                stroke={theme.stroke}
                strokeWidth={3}
                strokeOpacity={0.4}
            />
            <rect x={110} y={68} width={20} height={26} fill={theme.accent} />
            <rect
                x={56}
                y={68}
                width={128}
                height={26}
                rx={10}
                fill="none"
                stroke={theme.stroke}
                strokeWidth={3}
                strokeOpacity={0.4}
            />

            <path
                d={LEFT_LOOP_PATH}
                fill={theme.accent}
                stroke={theme.stroke}
                strokeWidth={3}
                strokeOpacity={0.55}
                strokeLinejoin="round"
            />
            <path
                d={RIGHT_LOOP_PATH}
                fill={theme.accent}
                stroke={theme.stroke}
                strokeWidth={3}
                strokeOpacity={0.55}
                strokeLinejoin="round"
            />
            <circle
                cx={120}
                cy={67}
                r={7}
                fill={theme.accent}
                stroke={theme.stroke}
                strokeWidth={3}
                strokeOpacity={0.55}
            />

            <PrintLabel
                text={printText}
                x={120}
                y={134}
                width={88}
                color={readablePrintColor(color, theme.print)}
            />
        </g>
    )
}
