import {RefObject} from 'react';

/**
 * Calculate position relative to parent object
 * @param eventPos Mouse position
 * @param bounds Position of the object that is used as a canvas to calculate position relative to that object
 * @returns x and y position of mouse in other object
 */
export const relativeCoords = (
  eventPos: {x: number; y: number},
  bounds: {x: number; y: number},
  ref_draggable: RefObject<HTMLDivElement>
): {x: number; y: number} => {
  if (ref_draggable.current) {
    const x = eventPos.x - bounds.x - ref_draggable.current.offsetWidth / 2;
    const y = eventPos.y - bounds.y - ref_draggable.current.offsetHeight / 2;
    return {x: Math.floor(x), y: Math.floor(y)};
  }
  return {x: 0, y: 0};
};

/**
 * Calculate size relative to parent object
 * @param eventPos Mouse position
 * @param bounds Position of the object that is used as a canvas to calculate position relative to that object
 * @returns x and y size of object in other object
 */
export const relativeSize = (
  eventPos: {x: number; y: number},
  bounds: {x: number; y: number},
  lockAspectRatio: boolean,
  aspectRatio: number,
  itemPosition: {x: number; y: number}
): {x: number; y: number} => {
  if (!lockAspectRatio) {
    const x = eventPos.x - bounds.x - itemPosition.x;
    const y = eventPos.y - bounds.y - itemPosition.y;
    return {x: Math.floor(x), y: Math.floor(y)};
  }
  const x = Math.floor(eventPos.x - bounds.x - itemPosition.x);
  const y = Math.floor(x * aspectRatio);
  return {x: x, y: y};
};
