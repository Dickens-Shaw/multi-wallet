import { styled } from 'styled-components';

const ConnectingContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 72px;
	font-family: Manrope;

	.logo {
		img {
			width: 66px;
			height: 66px;
		}
	}

	.introduce {
		margin-top: 44px;
		font-size: 14px;
		font-weight: 700;
		line-height: 14px;
		color: ${({ theme }) => theme.textColor};
	}

	.detail {
		margin-top: 30px;
		font-size: 14px;
		font-weight: 700;
		line-height: 14px;
		color: ${({ theme }) => theme.textColor5};
	}

	.loading {
		margin-top: 24px;
		animation: spin 1s linear infinite;

		path {
			fill: ${({ theme }) => theme.spinColor};
		}
	}

	@keyframes spin {
		100% {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 768px) {
		margin-top: 36px;
	}
`;

export default ConnectingContainer;
