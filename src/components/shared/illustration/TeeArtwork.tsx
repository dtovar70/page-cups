import { PrintLabel } from '@/components/shared/illustration/PrintLabel'
import { readablePrintColor, type ArtworkProps } from '@/components/shared/illustration/artwork'
import { PALETTE } from '@/constants/theme.constant'

const SHIRT_PATH =
    'M92 40 L58 52 L34 92 L62 110 L70 98 L70 170 A6 6 0 0 0 76 176 L164 176 A6 6 0 0 0 170 170 L170 98 L178 110 L206 92 L182 52 L148 40 C150 56 138 63 120 63 C102 63 90 56 92 40 Z'

export function TeeArtwork({ color, theme, printText }: ArtworkProps) {
    return (
        <g>
            <ellipse cx={120} cy={182} rx={68} ry={8} fill={PALETTE.ink} opacity={0.09} />

            <path
                d={SHIRT_PATH}
                fill={color}
                stroke={theme.stroke}
                strokeWidth={3}
                strokeOpacity={0.4}
                strokeLinejoin="round"
            />

            <path
                d="M92 40 C94 56 104 63 120 63 C136 63 146 56 148 40"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.5}
            />

            <path
                d="M62 104 L72 96"
                stroke={theme.stroke}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.25}
            />
            <path
                d="M178 104 L168 96"
                stroke={theme.stroke}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.25}
            />
            <path
                d="M78 84 C 75 106 75 128 78 150"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={6}
                strokeLinecap="round"
                opacity={0.3}
            />

            <rect x={82} y={84} width={76} height={64} rx={10} fill="#FFFFFF" opacity={0.18} />

            <PrintLabel
                text={printText}
                x={120}
                y={116}
                width={68}
                color={readablePrintColor(color, theme.print)}
            />
        </g>
    )
}
