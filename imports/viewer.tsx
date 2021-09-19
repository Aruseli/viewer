import { Button, Grid, Portal, Typography } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/styles';
import cn from 'classnames';
import dynamic from "next/dynamic";
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useDebounce } from 'use-debounce';
const KeyboardEventHandler = dynamic(() => import("react-keyboard-event-handler"), { ssr: false });

const useStyle = makeStyles(() => ({
  dialog: {
		position: 'absolute',
		top: 0, left: 0, width: '100%', height: '100%',
		zIndex: 999999,
		overflow: 'hidden',
		opacity: 0,
		transform: 'scaleY(0)',
		transition: 'opacity 0.3s ease 0s, transform 0s ease 0.3s',
		background: '#000000b3',
  },
  visibleGridContainer: {
		opacity: 1,
		transform: 'scaleY(1)',
		transition: 'opacity 0.3s ease 0s, transform 0s ease 0s',
  },
  hiddenGridItem: {
		opacity: 0,
		transform: 'scale(2)',
		transition: 'all 0.3s ease 0s',
  },
  visibleGridItem: {
		opacity: 1,
		transform: 'scale(1)',
		transition: 'all 0.3s ease 0s',
  },
  topMenuVisible: {
		width: 'calc(100% - 40px)',
		padding: 6,
		transition: 'all 0.3s ease',
  },
  topMenuHidden: {
		width: 42,
		height: 42,
		padding: 6,
		transition: 'all 0.3s ease',
  },
}));

export const ViewerContext = createContext<{ top: number; bottom: number; }>({ top: 0, bottom: 0 });

export const Viewer = React.memo<any>(({
  open,
  onClose,
  slides = [],
  index,
  onChangeIndex,
  SwipeableViewsProps = {},
  title = null,
  bottom = null,
  bottomVisible = true,
}: {
  open: boolean;
  onClose: () => any;
  slides: { id: any; el: any; }[];
  index: number;
  onChangeIndex: (index: number) => any;
  SwipeableViewsProps?: any;
  title?: any;
  bottom?: any;
  bottomVisible?: boolean;
}) => {
  const vc = useContext(ViewerContext);
  const classes = useStyle();

  const [y, setY] = useState(1);
  useEffect(() => {
		if (open) setY(1);
  }, [open]);
  useEffect(() => {
		if (y === 0 || y === 2) onClose();
  }, [y]);

  const [_open] = useDebounce(open, 500);
  const [__open] = useDebounce(open, 100);

  const [isZoom, setIsZoom] = useState(false);

  const downRef = useRef<any>();

  return <Portal>
	{!!(open || _open) && <Grid container
	  className={cn(classes.dialog, (open && __open) && classes.visibleGridContainer)}
	  justify="center" alignItems="center"
	  // onClick={() => !isZoom && onClose()}
	>
	  <Grid item xs={12} className={(open && __open) ? classes.visibleGridItem : classes.hiddenGridItem} style={{ height: '100%' }}>
		<>
		  <KeyboardEventHandler
				handleKeys={['esc']}
				onKeyEvent={(key, e) => {
					setY(0);
			}}
		  />
		  <KeyboardEventHandler
				handleKeys={['left']}
				onKeyEvent={(key, e) => {
					if (index > 0) onChangeIndex(index - 1);
			}}
		  />
		  <KeyboardEventHandler
				handleKeys={['right']}
				onKeyEvent={(key, e) => {
					if (index < slides.length - 1) onChangeIndex(index + 1);
			}}
		  />
		</>
		<SwipeableViews index={y} onChangeIndex={setY} animateHeight slideStyle={{ height: '100%', width: '100%', position: 'relative' }} enableMouseEvents axis={"y"}>
		  <div style={{ width: '100vw', height: '100vh' }}></div>
		  <div style={{ width: '100vw', height: '100vh' }}
			onMouseDown={(e) => downRef.current = { x: e.pageX, y: e.pageY }}
			onMouseUp={(e) => {
			  if (downRef.current.x == e.pageX && downRef.current.y == e.pageY) setY(0);
			}}
		  >
			<SwipeableViews index={index} onChangeIndex={onChangeIndex} resistance slideStyle={{ height: '100%', width: '100%', position: 'relative' }} {...SwipeableViewsProps} enableMouseEvents>
			  {slides.map((slide, i) => (<div key={slide.id} style={{ height: '100vh' }}>
			  <TransformWrapper 
					panning={{disabled: !isZoom}}
					// scalePadding={{disabled: true}}
					doubleClick={{mode : isZoom ? 'zoomOut' : 'zoomIn'}}
					onZoom={(r, event) => {
						const n = r.state.scale > 1;
						isZoom !== n && setIsZoom(n);
				}}>
				<TransformComponent contentStyle={{width: '100%', height: '100%'}}>
				  {slide.el}
				</TransformComponent>
			  </TransformWrapper>
			  </div>))}
			</SwipeableViews>
		  </div>
		  <div style={{ width: '100vw', height: '100vh' }}></div>
		</SwipeableViews>
	  </Grid>
	  <div className={title ? classes.topMenuVisible : classes.topMenuHidden} style={{ position: 'absolute', top: 16+vc.top, left: 16, boxSizing: 'border-box', borderRadius: 40, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
		<Grid container alignItems="center">
		  <Grid item style={{ width: 30, height: 30 }}>
			<Button size="small" onClick={() => onClose()} style={{ borderRadius: '100%', float: 'left', color: 'white', height: 30, width: 30 }}>
			  <ClearIcon/>
			</Button>
		  </Grid>
		  {title ? <Grid item style={{ width: 'calc(100% - 50px)' }}>
			<Typography align="center" style={{ color: 'white' }}>{title}</Typography>
		  </Grid> : null}
		</Grid>
	  </div>
	  <div className={bottom && bottomVisible ? classes.visibleGridItem : classes.hiddenGridItem} style={{ position: 'absolute', bottom: 0+vc.bottom, left: 0, width: '100%' }}>
		{bottom}
	  </div>
	</Grid>}
  </Portal>
});
