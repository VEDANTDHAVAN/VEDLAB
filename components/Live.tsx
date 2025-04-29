import React, { useCallback, useState } from 'react'
import LiveCursors from './cursor/LiveCursors'
import { useMyPresence, useOthers } from '@liveblocks/react'
import CursorChat from './cursor/CursorChat';
import { CursorMode } from '@/types/type';

const Live = () => {
    const others = useOthers();
    const [{cursor}, updateMyPresence] = useMyPresence() as any;

    const [cursorState, setCursorState] = useState({
      mode: CursorMode.Hidden,
    })

    const handlePointerMove = useCallback((event: React.PointerEvent) => {
      event.preventDefault();
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({ cursor: {x,y}});

    }, [])

    const handlePointerLeave = useCallback((event: React.PointerEvent) => {
      setCursorState({ mode: CursorMode.Hidden })
      
      updateMyPresence({ cursor: null, message: null});

    }, [])

    const handlePointerDown = useCallback((event: React.PointerEvent) => {
      event.preventDefault();
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({ cursor: {x,y}});

    }, [])

  return (
    <div 
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className='h-[100vh]'
    >
      <h1>Welcome to VedLab!!</h1>
      {cursor && (
        <CursorChat 
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
     <LiveCursors others={others}/>
    </div>
  )
}

export default Live