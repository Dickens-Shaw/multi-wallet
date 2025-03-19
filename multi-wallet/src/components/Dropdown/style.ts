import styled from 'styled-components';

const DropdownContainer = styled.div<{ $isOpen: boolean; $disabled: boolean }>`
	position: relative;
	width: 200px;
	cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
	opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

const DropdownLabel = styled.div`
	padding: 8px 12px;
	border: 1px solid #ccc;
	border-radius: 4px;
	background: white;
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
	border: 1px solid #ccc;
	border-radius: 4px;
	background: white;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	overflow-y: auto;
	opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
	visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
	transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '-10px')});
	transition: all 0.2s ease;
`;

const OptionItem = styled.li`
	padding: 8px 12px;
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
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%) rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0')});
	transition: transform 0.2s ease;
	pointer-events: none;
`;

const ArrowWrapper = styled.div`
	position: relative;
	padding-right: 28px; // 为箭头预留空间
`;

export { DropdownContainer, DropdownLabel, DropdownList, OptionItem, DefaultOption, ArrowIcon, ArrowWrapper };
