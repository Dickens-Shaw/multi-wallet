'use client';
import ModalHeader from '../Header/ModalHeader';
import Modal from './index';
import { createConnector } from '@/connectors/createConnectors';
import SupportWallets from '@config/walletConfig';
import { useTranslation } from 'react-i18next';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { WalletTriggerButton } from '../WalletTriggerButton';
import { Introduce } from '../Introduce';
import { WalletList } from '../WalletList';
import { GetWallet } from '../GetWallet';
import { Connecting } from '../Connecting';
import { useWalletKit } from '@hooks/useWalletKit';
import { AsideList, ModalAside, ModalContainer, ModalMain } from './style';
import { useModalStore } from '@stores/modalStore';
import { UserRejectError } from '../../errors';
import { ChainContext } from '../WalletKitProvider/ChainProvider';

enum Step {
	Introduce = 0,
	WalletList = 1,
	GetWallet = 2,
	Connecting = 3
}

export function ConnectModal() {
	const { t } = useTranslation();

	const { currentChainType, supportWallets, connectStatus, isConnecting } = useWalletKit();

	const { connectModalData } = useModalStore();

	const [step, setStep] = useState(Step.Introduce);
	const [selectedWallet, setSelectedWallet] = useState<any | null>(null);
	const [connectors, setConnectors] = useState<any[]>([]);

	const isOpen = useMemo(() => {
		return !!connectModalData;
	}, [connectModalData]);

	// 获取ChainProvider中的Provider.value
	const { isTokenUp } = useContext(ChainContext);

	const requestConnectors = async () => {
		const list = await createConnector(currentChainType, supportWallets || [], isTokenUp);
		setConnectors(list);
	};

	const connectorsGroupByType = useMemo(() => {
		const result = connectors.reduce((acc, connector) => {
			if (!acc[connector.connectorType]) {
				acc[connector.connectorType] = [];
			}
			acc[connector.connectorType].push(connector);
			return acc;
		}, {});
		return result;
	}, [connectors]);

	const sortedKeys = useMemo(() => {
		const keys = Object.keys(connectorsGroupByType);
		const sortedKeys = keys.sort((a, b) => {
			const order = ['installed', 'run', 'more'];
			return order.indexOf(a) - order.indexOf(b);
		});
		return sortedKeys;
	}, [connectorsGroupByType]);

	useEffect(() => {
		if (isOpen) {
			requestConnectors();
		} else {
			setStep(0);
			setConnectors([]);
		}
	}, [isOpen, currentChainType]);

	useEffect(() => {
		switch (connectStatus) {
			case 'connected':
				// closeModal();
				break;
			default:
				setStep(0);
				break;
		}
	}, [connectStatus]);

	const renderMainByStep = useCallback(() => {
		switch (step) {
			case 0:
				return (
					<Introduce
						onClose={handleCancel}
						onGetWallet={() => {
							setStep(Step.WalletList);
						}}
					/>
				);
			case 1:
				return (
					<WalletList
						onClose={handleCancel}
						list={SupportWallets}
						onBack={() => {
							setStep(0);
						}}
						onGetWallet={wallet => {
							if (wallet.webUrl) {
								window.open(wallet.webUrl, '_blank');
								return;
							}
							setSelectedWallet(wallet);
							setStep(Step.GetWallet);
						}}
					/>
				);
			case 2:
				return (
					<GetWallet
						onClose={handleCancel}
						wallet={selectedWallet}
						onBack={() => {
							setStep(Step.WalletList);
						}}
					/>
				);
			default:
				return <></>;
		}
	}, [step, selectedWallet]);

	const handleConnect = (address: string) => {
		connectModalData?.onConnect(address);
	};

	const handleCancel = () => {
		useModalStore.getState().connectModalData?.onError(UserRejectError);
	};

	return (
		<Modal isOpen={isOpen} onCancel={handleCancel}>
			<ModalContainer>
				<ModalAside className={step !== 0 ? 'hidden' : ''}>
					<ModalHeader onClose={handleCancel} title={t('connectWallet')} className="asideTitle" />
					<AsideList>
						{sortedKeys.map(connectorType => {
							return (
								<div className="typeBox" key={connectorType}>
									<div className={`typeHeader ${connectorType}`}>{t(connectorType)}</div>
									{connectorsGroupByType[connectorType].map((connector: any) => {
										return (
											<WalletTriggerButton
												onConnect={handleConnect}
												onError={connectModalData?.onError}
												key={connectorType + connector.name}
												connector={connector}
												onGetWallet={() => {
													if (connector.name === 'Gel Wallet') {
														window.open(connector.webUrl, '_blank');
														return;
													}
													setSelectedWallet(connector);
													setStep(Step.GetWallet);
												}}
											/>
										);
									})}
								</div>
							);
						})}

					</AsideList>
				</ModalAside>
				<ModalMain>
					{isConnecting ? <Connecting onClose={handleCancel} wallet={isConnecting} /> : renderMainByStep()}
				</ModalMain>
			</ModalContainer>
		</Modal>
	);
}
