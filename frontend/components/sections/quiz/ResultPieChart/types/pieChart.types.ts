export interface ResultPieChartProps {
  correct: number
  total: number
  size?: number
}

export interface PieSlicesProps {
  cx: number
  cy: number
  r: number
  correct: number
  wrong: number
  correctAngle: number
  isPerfect: boolean
}

export interface PieLegendProps {
  correct: number
  wrong: number
}

export interface PerfectCakeProps {
  cx: number
  cy: number
  r: number
}
