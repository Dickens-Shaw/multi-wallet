'use client';
import React from 'react';
import { styled } from 'styled-components';

interface TextOrg {
	text?: string | number | any;
	size?: number;
	weight?: number;
	color?: string;
	padding?: string;
	margin?: string;
	ellipsis?: boolean;
	className?: string;
	children?: React.ReactNode;
	prefix?: string;
	suffix?: string;
	counting?: boolean;
	href?: string;
}

const TextStyled = styled.div`
	display: flex;
	align-items: center;

	.text {
		max-width: 120px;
		color: ${({ theme }) => theme.textColor2};
		font-family: Manrope;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		@media (max-width: 768px) {
			white-space: wrap;
		}
	}
`;

export const Text: React.FC<TextOrg> = ({
	prefix,
	suffix,
	className = '',
	text,
	size,
	weight,
	color,
	padding = '',
	margin = ''
}) => {
	return (
		<TextStyled
			className={className}
			style={{
				fontSize: size ? size + 'px' : '16px',
				fontWeight: weight || 700,
				color,
				padding,
				margin
			}}
		>
			{prefix ? <span>{prefix}</span> : <></>}
			<span className="text" dangerouslySetInnerHTML={{ __html: text }} />
			{suffix ? <span>{suffix}</span> : <></>}
		</TextStyled>
	);
};

export default Text;
