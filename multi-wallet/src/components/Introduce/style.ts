import { styled } from 'styled-components';

const IntroduceContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin: 84px 50px 0 96px;
	font-family: Manrope;
	color: ${({ theme }) => theme.textColor1};

	.title {
		color: ${({ theme }) => theme.blue};
		font-size: 18px;
		font-weight: 700;
		line-height: 18px;
	}

	.vector {
		margin-top: 24px;
		display: flex;
		align-items: center;
		gap: 12px;

		svg {
			flex-shrink: 0;
		}

		.vector-text {
			color: #757575;
			font-size: 12px;
			font-style: normal;
			line-height: 14px;
			font-weight: 500;

			.answer {
				font-weight: 700;
			}

			.detail {
				margin-top: 14px;
			}
		}
	}

	.introduce {
		margin-top: 24px;
		font-size: 12px;
		font-weight: 700;
		line-height: 14px;
	}

	.footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 120px;
	}

	.button {
		width: 100%;
		display: inline-block;
		margin-top: 12px;
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
	}

	.more {
		margin-top: 8px;
		font-size: 12px;
		font-style: normal;
		font-weight: 700;
		cursor: pointer;
	}

	@media (max-width: 768px) {
		padding: 40px 32px 0;
		margin: 0;
		align-items: center;

		.vector {
			svg {
				display: none;
			}
			.vector-text {
				text-align: center;
			}
		}
	}
`;

export default IntroduceContainer;
