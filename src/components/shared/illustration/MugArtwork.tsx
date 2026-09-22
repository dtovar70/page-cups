import { PrintLabel } from '@/components/shared/illustration/PrintLabel'
import { readablePrintColor, type ArtworkProps } from '@/components/shared/illustration/artwork'
import { PALETTE } from '@/constants/theme.constant'

const HANDLE_PATH = 'M168 90 C 203 90 203 136 168 136'
const BODY_PATH = 'M62 64 H170 L164 152 A14 14 0 0 1 150 165 H82 A14 14 0 0 1 68 152 Z'

export function MugArtwork({ color, theme, printText }: ArtworkProps) {
    return (
        <g>
            <ellipse cx={120} cy={174} rx={64} ry={9} fill={PALETTE.ink} opacity={0.09} />

            <path
                d={HANDLE_PATH}
                fill="none"
                stroke={theme.stroke}
                strokeWidth={21}
                strokeLinecap="round"
                opacity={0.22}
            />
            <path d={HANDLE_PATH} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" />

            <path
                d={BODY_PATH}
                fill={color}
                stroke={theme.stroke}
                strokeWidth={3}
                strokeOpacity={0.4}
                strokeLinejoin="round"
            />

            <path
                d="M80 84 C 74 110 74 132 80 152"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={9}
                strokeLinecap="round"
                opacity={0.38}
            />

            <ellipse cx={116} cy={64} rx={54} ry={10} fill="#FFFFFF" opacity={0.94} />
            <ellipse cx={116} cy={64} rx={45} ry={6.5} fill={theme.accent} />

            <PrintLabel
                text={printText}
                x={116}
                y={116}
                width={78}
                color={readablePrintColor(color, theme.print)}
            />
        </g>
    )
}
