import React, { PureComponent } from 'react';
import { cn } from '@/lib/utils';

interface Props {
	className?: string;
	onChange?: (value: number) => void;
	value?: number;
}

export class Slider extends PureComponent<Props> {
	line = React.createRef<HTMLDivElement>();

	state = {
		focus: false,
	};

	componentDidMount() {
		window.addEventListener('mouseup', this.onStop, { passive: false });
		window.addEventListener('mousemove', this.onDrag, { passive: false });
		window.addEventListener('touchmove', this.onDrag, { passive: false });
		window.addEventListener('touchend', this.onStop, { passive: false });

		const line = this.line.current;
		if (line) {
			line.addEventListener('mousedown', this.onStart);
			line.addEventListener('touchstart', this.onStart);
		}
	}
	componentWillUnmount() {
		window.removeEventListener('mouseup', this.onStop);
		window.removeEventListener('mousemove', this.onDrag);
		window.removeEventListener('touchmove', this.onDrag);
		window.removeEventListener('touchend', this.onStop);

		const line = this.line.current;
		if (line) {
			line.removeEventListener('mousedown', this.onStart);
			line.removeEventListener('touchstart', this.onStart);
		}
	}
	onDrag = (e: MouseEvent | TouchEvent) => {
		const { onChange } = this.props;
		if (this.state.focus) {
			const position = 'touches' in e ? e.touches[0].clientX : e.clientX;
			const line = this.line.current;


			if (line) {
				const { left, width } = line.getBoundingClientRect();

				if (onChange) {
					onChange(Math.min(1, Math.max(0, position - left) / width));
				}
			}
			if (e.preventDefault) {
				e.preventDefault();
			}
		}
	};
	onStop = () => {
		this.setState({
			focus: false,
		});
	};
	onStart = (e: MouseEvent | TouchEvent) => {
		this.setState({
			focus: true,
		});
		this.onDrag(e);
	};
	
	render() {
		const { value = 0, className } = this.props;
		return (
			<div className={cn('w-full h-5 flex items-center flex-col justify-center rounded cursor-pointer', className)} ref={this.line}>
				<div className="bg-zinc-300/50 h-0.5 w-full rounded relative flex items-center">
					<div
						style={{
							flexGrow: value,
							background: "#818cf8",
							alignSelf: "stretch",
							flexBasis: "auto",
							flexDirection: "column",
							flexShrink: 0,
						}}
					/>
					<div
						className={cn(
							'w-4 h-4 -ml-2 rounded-full flex items-center justify-center absolute transition bg-indigo-400',
							this.state.focus && 'fixed-cropper-slider__circle--focus',
						)}
						style={{
							left: `${value * 100}%`,
						}}
					>
						<div
							className={cn(
								'w-4 h-4 rounded-full scale-100 transition',
								this.state.focus && 'scale-110',
							)}
						/>
					</div>
				</div>
			</div>
		);
	}
}
