import { styled } from 'styled-components';

const GetWalletContainer = styled.div`
	display: flex;
	flex-direction: column;
	font-family: Manrope;
	color: ${({ theme }) => theme.textColor1};
	height: 100%;

	.cardBox {
		display: flex;
		flex-direction: column;
		margin: 0 64px 24px;
		gap: 24px;
		flex: 1;
	}

	.card {
		display: flex;
		gap: 24px;
		padding: 40px 60px 0;
		border: 1px solid ${({ theme }) => theme.borderColor};
		border-radius: 12px;
		flex: 1;
		background: ${({ theme }) => theme.cardBg};

		img {
			width: 60px;
			height: 60px;
			border-radius: 12px;
		}

		.title {
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
			margin-top: 18px;
		}
	}

	.button {
		display: inline-block;
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

	.qrCodeBox {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		flex: 1;

		.downloadTip {
			text-align: center;
			font-size: 14px;
			font-weight: 600;
			line-height: 18px;
		}

		.qrCode {
			margin-top: 24px;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 270px;
			height: 270px;
			border-radius: 12px;
			border: 1px solid ${({ theme }) => theme.borderColor};
			font-size: 0;
			overflow: hidden;
		}

		.button {
			margin-top: auto;
			margin-bottom: 24px;
		}
	}

	@media (max-width: 768px) {
		.cardBox {
			margin: 0 24px 24px;

			.card {
				padding: 35px 24px;
			}
		}

		.qrCodeBox {
			.button {
				margin-top: 16px;
			}
		}
	}
`;

export default GetWalletContainer;
