import type { ComponentType } from 'react'
import { HookSlide, ProblemSlide, IdeaSlide, JourneySlide } from './act1'
import { GateSlide, TrialsSlide, SanctumSlide } from './act2'
import { CraftSlide, BrandSlide, WhySlide, MnemonicSlide, EndSlide } from './act3'

export interface SlideDef {
  id: string
  label: string
  title: string
  Component: ComponentType
}

export const SLIDES: SlideDef[] = [
  { id: 'hook', label: 'HOOK', title: 'The network that pretends not to exist.', Component: HookSlide },
  { id: 'problem', label: 'PROBLEM', title: "Survivors can't google a rebellion.", Component: ProblemSlide },
  { id: 'idea', label: 'IDEA', title: 'We built the network.', Component: IdeaSlide },
  { id: 'journey', label: 'JOURNEY', title: 'Four acts. One rite of passage.', Component: JourneySlide },
  { id: 'gate', label: 'GATE', title: 'A scroll is a journey.', Component: GateSlide },
  { id: 'trials', label: 'TRIALS', title: 'Three rites judge the worthy.', Component: TrialsSlide },
  { id: 'sanctum', label: 'SANCTUM', title: 'Inside: the tools of a hidden war.', Component: SanctumSlide },
  { id: 'craft', label: 'CRAFT', title: 'Engineered to feel expensive.', Component: CraftSlide },
  { id: 'brand', label: 'BRAND', title: 'Motion must mean something.', Component: BrandSlide },
  { id: 'why', label: 'WHY IT WINS', title: 'Every criterion becomes a feature.', Component: WhySlide },
  { id: 'mnemonic', label: 'SUMMARY', title: 'Hide in plain sight.', Component: MnemonicSlide },
  { id: 'end', label: 'TRANSMISSION', title: 'The network remembers.', Component: EndSlide },
]
