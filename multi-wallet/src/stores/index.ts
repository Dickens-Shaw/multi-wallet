import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Locals, Theme } from '@type/configType';

type Avatar = {
	text: string;
	bg: string;
};

export interface WalletKitState {
	chains: Array<any>;
	setChains: (chains: Array<any>) => void;

	language: Locals;
	setLanguage: (language: Locals) => void;

	theme: Theme;
	toggleTheme: () => void;

	avatar: Avatar | null;
	setAvatar: (avatar: Avatar) => void;
}

export const walletKitStore = create<WalletKitState>()(
	persist(
		(set, get) => ({
			chains: [],
			setChains(chains: Array<any>) {
				return set(() => ({ chains }));
			},

			language: 'en',
			setLanguage(language: Locals) {
				return set(() => ({ language }));
			},

			theme: 'lightMode',
			toggleTheme() {
				const { theme } = get();
				return set(() => ({ theme: theme === 'darkMode' ? 'lightMode' : 'darkMode' }));
			},

			avatar: null,
			setAvatar(avatar: Avatar) {
				return set(() => ({ avatar }));
			}
		}),
		{
			name: 'WALLET_KIT_STORE',
			storage: createJSONStorage(() => localStorage)
		}
	)
);
