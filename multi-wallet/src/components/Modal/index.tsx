'use client';
import { type ReactNode, type RefObject } from 'react';
import { styled } from 'styled-components';
import { animated, useTransition } from '@react-spring/web';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import '@reach/dialog/styles.css';

const AnimatedDialogOverlay = animated(DialogOverlay);

const AnimatedDialogContent = animated(DialogContent);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
	&[data-reach-dialog-overlay] {
		width: 100vw;
		z-index: 99;
		background-color: ${({ theme }) => theme.modalOverlay};
	}
`;

const StyledDialogContent = styled(({ ...rest }) => <AnimatedDialogContent {...rest} />).attrs({
	'aria-label': 'dialog'
})`
	&[data-reach-dialog-content] {
		position: fixed;
		left: 50%;
		bottom: 50%;
		transform: translate(-50%, 50%);
		border-radius: 12px;
		box-shadow: rgb(47 128 237 / 5%) 0 4px 8px 0;
		overflow: hidden;
		align-self: center;
		padding: 0;
		margin: 0;
		outline: none;
		width: auto;
		background-color: ${({ theme }) => theme.modalBg};

		@media (max-width: 768px) {
			left: 0;
			bottom: 0;
			transform: none;
			border-bottom-right-radius: 0;
			border-bottom-left-radius: 0;
		}
	}
`;

interface ModalProps {
	isOpen: boolean;
	minHeight?: number | false;
	maxHeight?: number;
	initialFocusRef?: RefObject<any>;
	children?: ReactNode;
	closeAble?: boolean;
	onCancel?: () => void;
}

export default function Modal({ isOpen, children, closeAble = true, onCancel }: ModalProps) {
	const transitions = useTransition(isOpen, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: { duration: 150 }
	});
	// const { closeModal } = useWalletKit();
	return (
		<>
			{transitions((styles: any, item: any) => {
				return (
					item && (
						<StyledDialogOverlay
							style={{ opacity: styles.opacity }}
							onDismiss={closeAble ? onCancel : () => {}}
							isOpen={isOpen}
						>
							<StyledDialogContent className={'dialog-content-style'}>{children}</StyledDialogContent>
						</StyledDialogOverlay>
					)
				);
			})}
		</>
	);
}
