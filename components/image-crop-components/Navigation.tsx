import React, { FC } from 'react';
import { isNumber } from 'advanced-cropper';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Slider } from './Slider';

interface Props {
	zoom?: number;
	onZoom?: (value: number, transitions?: boolean) => void;
	className?: string;
	disabled?: unknown;
}

export const Navigation: FC<Props> = ({ className, onZoom, zoom }) => {
	const onZoomIn = () => {
		if (onZoom && isNumber(zoom)) {
			onZoom(Math.min(1, zoom + 0.25), true);
		}
	};

	const onZoomOut = () => {
		if (onZoom && isNumber(zoom)) {
			onZoom(Math.max(0, zoom - 0.25), true);
		}
	};

	return (
		<div className={cn('h-14 flex justify-center items-center', className)}>
			<button className="flex items-center justify-center w-20 h-full p-0 transition cursor-pointer will-change-transform hover:scale-125" onClick={onZoomOut}>
        <ZoomOut size={20} />
			</button>
			<Slider value={zoom} onChange={onZoom} className="flex flex-col items-center justify-center w-full h-5 rounded cursor-pointer" />
			<button className="flex items-center justify-center w-20 h-full p-0 transition cursor-pointer will-change-transform hover:scale-125" onClick={onZoomIn}>
        <ZoomIn size={20} />
			</button>
		</div>
	);
};
