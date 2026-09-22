import { PrintLabel } from '@/components/shared/illustration/PrintLabel'
import { readablePrintColor, type ArtworkProps } from '@/components/shared/illustration/artwork'
import { PALETTE } from '@/constants/theme.constant'

export function KeychainArtwork({ color, theme, printText }: ArtworkProps) {
    return (
        <g>
            <ellipse cx={120} cy={186} rx={50} ry={8} fill={PALETTE.ink} opacity={0.09} />

            <circle cx={120} cy={36} r={21} fill="none" stroke={theme.stroke} strokeWidth={7} />
            <path
                d="M105 24 A21 21 0 0 1 130 18"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.7}
            />
            <circle cx={120} cy={66} r={8} fill="none" stroke={theme.stroke} strokeWidth={5} />

            <rect
                x={58}
                y={74}
                width={124}
                height={106}
                rx={26}
                fill={color}
                stroke={theme.stroke}
                strokeWidth={3}
                strokeOpacity={0.4}
            />

            <circle
                cx={120}
                cy={94}
                r={7}
                fill={PALETTE.cream}
                stroke={theme.stroke}
                strokeWidth={2}
                strokeOpacity={0.35}
            />

            <path
                d="M76 116 C 72 134 72 150 76 166"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={8}
                strokeLinecap="round"
                opacity={0.35}
            />
            <PrintLabel
                text={printText}
                x={120}
                y={138}
                width={92}
                color={readablePrintColor(color, theme.print)}
            />
        </g>
    )
}
