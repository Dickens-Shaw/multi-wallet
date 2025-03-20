import styled from 'styled-components';

const DropdownContainer = styled.div<{ $isOpen: boolean; $disabled: boolean }>`
	position: relative;
	width: 70px;
	cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
	opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

const DropdownLabel = styled.div`
	padding: 1px 6px;
	border: 1px solid #000;
	background: rgb(239, 239, 239);
	transition: all 0.2s;

	&:hover {
		border-color: #888;
	}
`;

const DropdownList = styled.ul<{ $isOpen: boolean }>`
	position: absolute;
	width: 100%;
	max-height: 200px;
	margin-top: 4px;
	padding: 0;
	border: 1px solid #000;
	background: white;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	overflow-y: auto;
	opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
	visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
	transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '-10px')});
	transition: all 0.2s ease;
`;

const OptionItem = styled.li`
	padding: 1px 6px;
	list-style: none;
	cursor: pointer;
	transition: background 0.2s;
	
	&:hover {
		background: #f5f5f5;
	}

	&[aria-selected='true'] {
		background: #e6f7ff;
	}
`;

const DefaultOption = styled.span`
	color: #333;
	font-size: 14px;
`;

const ArrowIcon = styled.svg<{ $isOpen: boolean }>`
	font-size: 12px;
	transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0')});
	transition: transform 0.2s ease;
	pointer-events: none;
`;

const ArrowWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 4px;
`;

export { DropdownContainer, DropdownLabel, DropdownList, OptionItem, DefaultOption, ArrowIcon, ArrowWrapper };
