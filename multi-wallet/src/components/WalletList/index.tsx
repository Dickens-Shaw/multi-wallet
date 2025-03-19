'use client';
import { useTranslation } from 'react-i18next';
import ModalHeader from '../Header/ModalHeader';
import WalletListContainer from './style';
import { useMemo } from 'react';

interface WalletListProps {
	list?: any[];
	onBack?: () => void;
	onGetWallet?: (wallet: any) => void;
	onClose: () => void;
}

export function WalletList({ list, onClose, onBack, onGetWallet }: WalletListProps) {
	const { t } = useTranslation();

	// random three wallets in the list
	const randomList = useMemo(() => {
		const randomList = list
			?.filter(i => !i.webUrl)
			.sort(() => Math.random() - 0.5)
			.slice(0, 3);
		return randomList;
	}, [list]);

	return (
		<WalletListContainer>
			<ModalHeader onClose={onClose} title={t('getWalletTitle')} onBack={onBack} />
			<div className="walletList">
				{randomList?.map((item, index) => (
					<div className="walletItem" key={index + item.name}>
						<img src={item.icon} alt={item.name} />
						<div>
							<div className="name">{item.name.replaceAll('_', ' ')}</div>
							{item.name !== 'GelWallet' && <div className="description">{t('getWalletTips')}</div>}
						</div>
						<div className="button" onClick={() => onGetWallet?.(item)}>
							{t('getWallet')}
						</div>
					</div>
				))}
			</div>
			<div className="question">{t('getWalletQuestion')}</div>
			<div className="answer">{t('getWalletAnswer')}</div>
		</WalletListContainer>
	);
}
