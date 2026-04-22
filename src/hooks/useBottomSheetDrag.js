import { useRef, useState } from 'react';

export default function useBottomSheetDrag(closeSheet) {
  const [dragY, setDragY] = useState(0);
  const startYRef = useRef(null);

  function resetDrag() {
    setDragY(0);
  }

  function handleTouchStart(event) {
    startYRef.current = event.touches[0].clientY;
  }

  function handleTouchMove(event) {
    if (!startYRef.current) return;

    const currentY = event.touches[0].clientY;
    const diff = currentY - startYRef.current;

    if (diff > 0) {
      setDragY(diff);
    }
  }

  function handleTouchEnd() {
    if (dragY > 100) {
      setDragY(0);
      closeSheet();
    } else {
      setDragY(0);
    }

    startYRef.current = null;
  }

  return {
    dragY,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetDrag,
  };
}
