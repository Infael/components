import { useRef, useState, FC, useLayoutEffect } from "react";
import { relativeCoords, relativeSize } from "./draggable_utilities";

type Coordinates = {
  x: number;
  y: number;
};

type Props = {
  itemSize: Coordinates;
  itemPosition: Coordinates;
  lockAspectRatio?: boolean;
  aspectRatio?: number;
  ui?: boolean;
  image?: string;
  imageOpacity?: number;
  setItemSize: (size: Coordinates) => void;
  setItemPosition: (position: Coordinates) => void;
};

const DraggableComponent: FC<Props> = ({
  itemSize,
  itemPosition,
  lockAspectRatio,
  aspectRatio = 1,
  ui,
  image = "",
  imageOpacity = 1,
  setItemSize,
  setItemPosition,
}) => {
  const [pressed, setPressed] = useState(false);
  const [pressedResize, setPressedResize] = useState(false);
  const ref_draggable = useRef<HTMLDivElement>(null);
  const ref_parent = useRef<HTMLDivElement>(null);

  // Monitor changes to position state and update DOM
  useLayoutEffect(() => {
    if (ref_draggable.current) {
      ref_draggable.current.style.transform = `translate(${itemPosition.x}px, ${itemPosition.y}px)`;
    }
  }, [itemPosition]);

  // Monitor changes to size state and update DOM
  useLayoutEffect(() => {
    if (ref_draggable.current) {
      ref_draggable.current.style.width = `${itemSize.x}px`;
      ref_draggable.current.style.height = `${itemSize.y}px`;
    }
  }, [itemSize]);

  const positionChange = (event: React.MouseEvent<HTMLDivElement>) => {
    if (ref_draggable.current && ref_parent.current) {
      const newPosition = relativeCoords(
        { x: event.clientX, y: event.clientY },
        {
          x: ref_parent.current.getBoundingClientRect().left,
          y: ref_parent.current.getBoundingClientRect().top,
        },
        ref_draggable
      );

      if (newPosition.x < 0) {
        newPosition.x = 0;
      } else if (newPosition.x > ref_parent.current.offsetWidth - itemSize.x) {
        newPosition.x = ref_parent.current.offsetWidth - itemSize.x;
      }
      if (newPosition.y < 0) {
        newPosition.y = 0;
      } else if (newPosition.y > ref_parent.current.offsetHeight - itemSize.y) {
        newPosition.y = ref_parent.current.offsetHeight - itemSize.y;
      }
      setItemPosition(newPosition);
    }
  };

  const sizeChange = (event: React.MouseEvent<HTMLDivElement>) => {
    if (ref_parent.current) {
      const newSize = relativeSize(
        { x: event.clientX, y: event.clientY },
        {
          x: ref_parent.current.getBoundingClientRect().left,
          y: ref_parent.current.getBoundingClientRect().top,
        },
        lockAspectRatio ? true : false,
        aspectRatio,
        itemPosition
      );

      if (newSize.x < 1) {
        newSize.x = 1;
      } else if (newSize.x > ref_parent.current.offsetWidth - itemPosition.x) {
        newSize.x = ref_parent.current.offsetWidth - itemPosition.x;
      }
      if (newSize.y < 1) {
        newSize.y = 1;
      } else if (newSize.y > ref_parent.current.offsetHeight - itemPosition.y) {
        newSize.y = ref_parent.current.offsetHeight - itemPosition.y;
      }
      setItemSize(newSize);
    }
  };

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (pressed && !pressedResize) {
      positionChange(event);
    } else if (pressedResize) {
      sizeChange(event);
    }
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div
      ref={ref_parent}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setPressed(false)}
      onMouseUp={() => {
        setPressed(false);
        setPressedResize(false);
      }}
      className="absolute w-full h-full"
    >
      <div
        ref={ref_draggable}
        className={
          "w-20 h-20 flex flex-col overflow-hidden cursor-grab" +
          (ui ? " border-2 border-red" : " border-2 border-transparent") +
          (pressed ? " cursor-grabbing" : " cursor-grab")
        }
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
      >
        {image !== "" && (
          <img
            src={image}
            alt="watermark"
            className="object-fill"
            style={{
              opacity: imageOpacity,
              width: itemSize.x,
              height: itemSize.y,
            }}
            draggable={false}
          />
        )}
        {ui && (
          <div>
            <div className="w-0.5 h-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red" />
            <div className="w-5 h-0.5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red" />
            <div
              onMouseDown={() => setPressedResize(true)}
              onMouseUp={() => setPressedResize(false)}
              className="w-8 h-8 absolute left-full top-full transform -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DraggableComponent;
