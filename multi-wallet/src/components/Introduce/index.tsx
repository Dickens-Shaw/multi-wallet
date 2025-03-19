'use client';
import { useTranslation } from 'react-i18next';
import ModalHeader from '../Header/ModalHeader';
import IntroduceContainer from './style';
import VectorSvg from '../SVGs/vectorSvg';

interface IntroduceProps {
	onGetWallet?: () => void;
	onClose: () => void;
}

export function Introduce({ onGetWallet, onClose }: IntroduceProps) {
	const { t } = useTranslation();

	return (
		<>
			<ModalHeader onClose={onClose} className="mainTitle" />
			<IntroduceContainer>
				<div className="title">{t('introduceQuestion')}</div>
				<div className="vector">
					<VectorSvg />
					<div className="vector-text">
						<div className="answer">{t('introduceAnswer')}</div>
						<div className="detail">{t('introduceDetail')}</div>
					</div>
				</div>
				<div className="footer">
					<div className="button" onClick={() => onGetWallet?.()}>
						{t('getWallet')}
					</div>
					{/* <span className="more" onClick={() => {}}>
						{t('learnMore')}
					</span> */}
				</div>
			</IntroduceContainer>
		</>
	);
}
