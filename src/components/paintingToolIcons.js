import { Brush, PaintRoller, SprayCan } from 'lucide-react'

export const paintingToolIcons = [PaintRoller, Brush, SprayCan]

export function paintingToolIcon(index = 0) {
  return paintingToolIcons[index % paintingToolIcons.length]
}
