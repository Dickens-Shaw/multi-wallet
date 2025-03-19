import React, { useRef, useEffect } from 'react';
import {
	DropdownList,
	OptionItem,
	DropdownContainer,
	DropdownLabel,
	DefaultOption,
	ArrowIcon,
	ArrowWrapper
} from './style';

interface DropdownProps {
	options: { value: string | number; label: string }[];
	value?: string | number;
	placeholder?: string;
	disabled?: boolean;
	showArrow?: boolean;
	onChange?: (value: string | number) => void;
	renderOptionItem?: (option: { value: string | number; label: string }, isSelected: boolean) => React.ReactNode;
}

const Dropdown = ({
	options,
	value = '',
	placeholder = '请选择',
	disabled = false,
	showArrow = true,
	onChange,
	renderOptionItem
}: DropdownProps) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// 点击外部关闭
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// 处理选择
	const handleDropdown = (selectedValue: string | number) => {
		setIsOpen(false);
		onChange?.(selectedValue);
	};

	// 获取显示文本
	const displayText = options.find(opt => opt.value === value)?.label || placeholder;

	return (
		<DropdownContainer
			ref={containerRef}
			$isOpen={isOpen}
			$disabled={disabled}
			onClick={() => !disabled && setIsOpen(!isOpen)}
		>
			<DropdownLabel>
				<ArrowWrapper>
					{displayText}
					{showArrow && (
						<ArrowIcon $isOpen={isOpen} viewBox="0 0 448 512" height="1em" width="1em">
							<path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
						</ArrowIcon>
					)}
				</ArrowWrapper>
			</DropdownLabel>

			<DropdownList $isOpen={isOpen}>
				{options.map(option => (
					<OptionItem
						key={option.value}
						onClick={() => handleDropdown(option.value)}
						aria-selected={option.value === value}
					>
						{renderOptionItem ? (
							renderOptionItem(option, option.value === value)
						) : (
							<DefaultOption>{option.label}</DefaultOption>
						)}
					</OptionItem>
				))}
			</DropdownList>
		</DropdownContainer>
	);
};

export default Dropdown;
