import { getAbsoluteZoom, getZoomFactor } from 'advanced-cropper/extensions/absolute-zoom';
import cn from 'classnames';
import { FC } from 'react';
import { CropperFade } from 'react-advanced-cropper';
import { Navigation } from './Navigation';

export const CustomWrapper: FC<any> = ({ cropper, children, loaded, className }) => {
    const state = cropper.getState();

    const settings = cropper.getSettings();

    const absoluteZoom = getAbsoluteZoom(state, settings);

    const onZoom = (value: number, transitions?: boolean) => {
      cropper.zoomImage(getZoomFactor(state, settings, value), {
          transitions: !!transitions,
      });
    };

    return (
      <CropperFade className={cn('flex-grow min-h-0 cursor-grab active:cursor-grabbing', className)} visible={state && loaded}>
        {children}
        <Navigation className="max-w-full w-[462px] absolute bottom-0 my-0 mx-auto" zoom={absoluteZoom} onZoom={onZoom} />
      </CropperFade>
    );
};