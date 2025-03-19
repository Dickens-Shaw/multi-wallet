import { create } from 'zustand';
import type { StoreSet, StoreGet } from '@type/store';
// import { detectWalletBrowser } from '@web3jskit/wallethelper';

interface ConnectModalData {
	onError: (error: any) => void;
	onConnect: (address: string) => void;
}

class ModalStore {
	constructor(
		private readonly set: StoreSet<ModalStore>,
		// @ts-expect-error Requires two parameters
		private readonly get: StoreGet<ModalStore>
	) {}
	connectModalData?: ConnectModalData;
	isShowWalletInfoModal: boolean = false;

	readonly connect = () => {
		// const result = detectWalletBrowser();
		// console.log('result', result);
		return new Promise((resolve, reject) => {
			const close = () => {
				this.set({
					connectModalData: undefined
				});
			};
			this.set({
				connectModalData: {
					onError: (error: any) => {
						close();
						reject(error);
					},
					onConnect: (address: string) => {
						close();
						resolve(address);
					}
				}
			});
		});
	};
	readonly showWalletInfoModal = () => {
		this.set({
			isShowWalletInfoModal: true
		});
	};
	readonly closeWalletInfoModal = () => {
		this.set({
			isShowWalletInfoModal: false
		});
	};
}

export const useModalStore = create<ModalStore>((set, get) => new ModalStore(set, get));
