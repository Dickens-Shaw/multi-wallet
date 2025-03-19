import { styled } from 'styled-components';

const WalletListContainer = styled.div`
	display: flex;
	flex-direction: column;
	font-family: Manrope;
	color: ${({ theme }) => theme.textColor1};
	height: 100%;

	.walletList {
		display: flex;
		flex-direction: column;
		padding: 10px 20px;
		gap: 20px;
		flex: 1;
		overflow: auto;

		.walletItem {
			display: flex;
			align-items: center;
		}

		img {
			width: 28px;
			height: 28px;
			flex-shrink: 0;
			margin-right: 10px;
			border-radius: 6px;
		}

		.name {
			font-size: 14px;
			font-weight: 700;
			line-height: 14px;
			color: ${({ theme }) => theme.textColor};
		}

		.description {
			margin-top: 10px;
			font-size: 12px;
			font-weight: 500;
			line-height: 14px;
			color: ${({ theme }) => theme.textColor3};
		}

		.button {
			display: inline-block;
			margin-left: auto;
			padding: 11px 16px;
			color: ${({ theme }) => theme.buttonColor};
			background: ${({ theme }) => theme.buttonBg};
			font-size: 14px;
			font-weight: 700;
			line-height: 14px;
			text-align: center;
			border-radius: 8px;
			box-sizing: border-box;
			cursor: pointer;
			height: 36px;
		}
	}

	.question {
		margin-left: 42px;
		margin-bottom: 10px;
		font-size: 16px;
		font-weight: 700;
		line-height: 16px;
		color: ${({ theme }) => theme.textColor4};
	}

	.answer {
		margin-left: 42px;
		margin-bottom: 47px;
		font-size: 16px;
		font-weight: 400;
		line-height: 16px;
		color: ${({ theme }) => theme.textColor4};
	}

	@media (max-width: 768px) {
		.walletList {
			padding: 10px 28px 0;
			min-height: 237px;
			max-height: 237px;
			overflow: auto;

			.button {
				font-size: 12px;
			}
		}

		.question {
			margin: 10px 25px;
		}

		.answer {
			margin: 0 25px 75px;
		}
	}
`;
export default WalletListContainer;
