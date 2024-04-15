import { create } from "zustand";

interface CurrentUserState {
	currentUser: string | null;
	setCurrentUser: (user: string | null) => void;
}

export const useCurrentUserStore = create<CurrentUserState>((set) => ({
	currentUser: null,
	setCurrentUser: (user: string | null) =>
		set((state) => ({ currentUser: user })),
}));

export interface BusyState {
	busy: boolean;
	becomeBusy: () => void;
	stopBeingBusy: () => void;
}

export const useBusyStore = create<BusyState>()((set) => ({
	busy: false,
	becomeBusy: () => set(() => ({ busy: true })),
	stopBeingBusy: () => set(() => ({ busy: false })),
}));
