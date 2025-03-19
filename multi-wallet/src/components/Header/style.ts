import { styled } from 'styled-components';

const ModalHeaderBox = styled.div`
	width: 100%;
	height: 56px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-shrink: 0;

	.backBtn {
		cursor: pointer;
		margin-left: 20px;

		path {
			fill: ${({ theme }) => theme.backArrowColor};
		}
	}

	.title {
		color: ${({ theme }) => theme.textColor};
		font-size: 16px;
		font-weight: 700;
		line-height: 170%;
		letter-spacing: 0.3px;
	}

	.closeBtn {
		margin-right: 20px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 12px;
		transition: all 0.2s;
		color: ${({ theme }) => theme.closeBtnColor};
		transform-origin: 50% 50%;
		background-color: ${({ theme }) => theme.closeBtnBg};
		z-index: 1;

		&:hover {
			background-color: ${({ theme }) => theme.closeBtnHoverBg};
			transform: rotate(180deg);
			transition: all 0.2s;
		}
	}

	&.asideTitle {
		justify-content: flex-start;
		height: auto;

		.closeBtn {
			display: none;
		}
	}

	@media (max-width: 768px) {
		&.mainTitle {
			display: none;
		}

		&.asideTitle {
			justify-content: space-between;
			height: 56px;
			.closeBtn {
				display: flex;
			}
		}
	}
`;

export default ModalHeaderBox;
