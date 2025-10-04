import { create } from 'zustand'

interface FilterState {
  selectedTeam: string | null
  setSelectedTeam: (team: string | null) => void
  resetFilter: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedTeam: null,
  setSelectedTeam: (team) => set({ selectedTeam: team }),
  resetFilter: () => set({ selectedTeam: null }),
}))
