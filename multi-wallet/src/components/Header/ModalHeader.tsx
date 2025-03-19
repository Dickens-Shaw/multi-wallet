'use client';
import ModalHeaderBox from './style';
import BackArrowSvg from '../SVGs/backArrowSvg';
import CloseSvg from '../SVGs/closeSvg';

interface ModalHeaderProps {
	title?: string | null;
	onBack?: () => void;
	className?: string;
	onClose: () => void;
}

export default function ModalHeader({ title = '', onBack, className, onClose }: ModalHeaderProps) {
	return (
		<ModalHeaderBox className={className}>
			{onBack ? <BackArrowSvg className="backBtn" onClick={onBack} /> : <div className="backBtn"></div>}
			{title ? <div className="title">{title}</div> : <div></div>}
			<div className="closeBtn" onClick={onClose}>
				<CloseSvg />
			</div>
		</ModalHeaderBox>
	);
}
