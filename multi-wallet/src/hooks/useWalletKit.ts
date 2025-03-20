import { walletHelperStore, type WalletHelperState } from '@stores/coreStore';
import { walletKitStore, type WalletKitState } from '@stores/index';
import { useModalStore } from '@stores/modalStore';
import type { Connector } from '@type/connector';

type WalletKitStoreState = WalletHelperState & WalletKitState;

type WalletKit = WalletKitStoreState & {
	connect: () => Promise<Connector>;
	showWalletInfo: () => void;
	closeWalletInfo: () => void;
};

const enhancedWalletKit = (walletKit: WalletKitStoreState) => {
	const { connect, showWalletInfoModal, closeWalletInfoModal } = useModalStore.getState();
	const showWalletInfo = () => {
		if (walletKit.currentConnector) {
			showWalletInfoModal();
		}
	};
	const closeWalletInfo = () => {
		closeWalletInfoModal();
	};
	return {
		...walletKit,
		connect,
		showWalletInfo,
		closeWalletInfo
	};
};

// use for react component
export const useWalletKit = () => {
	const walletHelperStates = walletHelperStore((states: any) => states);

	const walletKitStates = walletKitStore((states: any) => states);

	return enhancedWalletKit({
		...walletHelperStates,
		// provider,
		...walletKitStates
	} as WalletKit);
};

// use for pure js
export const getWalletKit = () => {
	const walletHelperStates = walletHelperStore.getState();
	const walletKitStates = walletKitStore.getState();

	const exportStates = enhancedWalletKit({
		...walletHelperStates,
		...walletKitStates
	} as WalletKit);

	return exportStates as WalletKit;
};
