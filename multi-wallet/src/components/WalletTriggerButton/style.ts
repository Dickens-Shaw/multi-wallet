import { styled } from 'styled-components';

const WalletItem = styled.div`
	display: flex;
	padding: 4px 14px;
	border-radius: 8px;
	cursor: pointer;
	flex-shrink: 0;
	box-sizing: border-box;
	user-select: none;
	margin: 0 -14px;

	img {
		width: 28px;
		height: 28px;
		border-radius: 6px;
	}

	&:hover {
		background: ${({ theme }) => theme.itemHoverBg};
	}

	&.active {
		background: ${({ theme }) => theme.itemActiveBg};
	}

	&.disabled {
		pointer-events: none;
		background: none;
	}

	@media (max-width: 768px) {
		width: 86px;
		padding: 4px 12px;
		justify-content: center;
		margin: 0;

		> div {
			box-sizing: border-box;
			flex-direction: column;
			align-items: center;

			img {
				width: 36px;
				height: 36px;
			}

			> div {
				line-height: 14px;
				text-align: center;

				span {
					font-size: 12px;
				}
			}
		}

		.installed span {
			color: ${({ theme }) => theme.blue};
		}
	}
`;

export default WalletItem;
