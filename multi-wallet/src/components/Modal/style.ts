import { styled } from 'styled-components';

export const ModalContainer = styled.div`
	display: flex;
	width: 720px;
	height: 506px;

	@media (max-width: 768px) {
		flex-direction: column;
		width: 100vw;
		height: 454px;
	}
`;

export const ModalAside = styled.div`
	width: 200px;
	display: flex;
	flex-direction: column;
	border-right: 1px solid ${({ theme }) => theme.borderColor};
	padding-top: 16px;
	box-sizing: border-box;

	@media (max-width: 768px) {
		width: 100%;
		border-right: none;
		padding-top: 0;
		padding-bottom: 24px;
		background-color: ${({ theme }) => theme.modalSideBg};

		&.hidden {
			display: none;
		}
	}
`;

export const AsideList = styled.div`
	overflow-y: auto;
	overflow-x: hidden;
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 0 20px 20px;
	margin-top: 10px;

	.typeBox {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.typeHeader {
		font-size: 14px;
		line-height: 14px;
		font-weight: 700;
		color: ${({ theme }) => theme.gray};
		margin-bottom: 12px;

		&.installed {
			color: ${({ theme }) => theme.blue};
		}
	}

	@media (max-width: 768px) {
		overflow-x: auto;
		overflow-y: hidden;
		flex-direction: row;
		padding: 0 20px;

		.typeBox {
			flex-direction: row;

			.typeHeader {
				display: none;
			}
		}

		// &::-webkit-scrollbar {
		// 	display: none;
		// }
	}
`;

export const ModalMain = styled.div`
	flex: 1;
	height: 100%;
`;

export const InfoModalContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 360px;
	height: 240px;
	text-align: center;

	.avatarBox {
		margin-top: -28px;
		font-size: 41px;

		.avatar {
			width: 74px;
			height: 74px;
			line-height: 74px;
			border-radius: 50%;
			user-select: none;
			cursor: pointer;
		}
	}

	.accountInfo {
		margin-top: 12px;
		color: ${({ theme }) => theme.textColor};

		.address {
			font-size: 18px;
			font-weight: 800;
			line-height: 24px;
		}

		.tokenAmount {
			font-size: 14px;
			font-weight: 600;
			line-height: 18px;
			color: ${({ theme }) => theme.textColor3};
		}
	}

	.btnGroup {
		display: flex;
		gap: 8px;
		margin-top: 16px;
		width: 100%;
		justify-content: center;
		padding: 0 16px 16px;
		box-sizing: border-box;

		.button {
			padding: 8px;
			color: ${({ theme }) => theme.textColor};
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			cursor: pointer;
			border-radius: 12px;
			background-color: ${({ theme }) => theme.infoBtnBg};

			&:hover {
				background-color: ${({ theme }) => theme.infoBtnHoverBg};
			}
		}

		.btnIcon {
			height: 18px;
		}
		.btnText {
			font-size: 13px;
			font-weight: 600;
			line-height: 18px;
		}
	}

	@media (max-width: 768px) {
		width: 100vw;
		height: 280px;

		.avatarBox {
			margin-top: -4px;
			font-size: 45px;

			.avatar {
				width: 82px;
				height: 82px;
				line-height: 82px;
			}
		}

		.accountInfo {
			margin-top: 16px;

			.address {
				font-size: 20px;
			}

			.tokenAmount {
				font-size: 16px;
				line-height: 20px;
			}
		}
	}
`;
