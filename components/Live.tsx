/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors'
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '@liveblocks/react'
import CursorChat from './cursor/CursorChat';
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type';
import ReactionSelector from './reaction/ReactionButton';
import FlyingReaction from './reaction/FlyingReaction';
import useInterval from '@/hooks/useInterval';

const Live = () => {
    const others = useOthers();
    const [{cursor}, updateMyPresence] = useMyPresence() as any;
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [cursorState, setCursorState] = useState<CursorState>({
      mode: CursorMode.Hidden,
    });

    const broadcast = useBroadcastEvent();

    useInterval(() => {
      if(cursorState.mode === CursorMode.Reaction && cursorState.isPressed 
        && cursor) {
          setReactions((reactions) => reactions.concat([{
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          }]))

          broadcast({
            x: cursor.x,
            y: cursor.y,
            value: cursorState.reaction,
          })
        }
    }, 100);

    useEventListener((eventData) => {
      const event = eventData.event as ReactionEvent;

      setReactions((reactions) => reactions.concat([{
        point: { x: event.x, y: event.y },
        value: event.value,
        timestamp: Date.now(),
      }]))
    });

    const handlePointerMove = useCallback((event: React.PointerEvent) => {
      event.preventDefault();

      if(cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({ cursor: {x,y}});
      }

    }, [updateMyPresence, cursorState.mode, cursor])

    const handlePointerLeave = useCallback((event: React.PointerEvent) => {
      setCursorState({ mode: CursorMode.Hidden })
      
      updateMyPresence({ cursor: null, message: null});

    }, [updateMyPresence,])

    const handlePointerDown = useCallback((event: React.PointerEvent) => {
      event.preventDefault();
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({ cursor: {x,y}});

      setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? {
        ...state, isPressed: true
      } : state);
    }, [cursorState.mode, setCursorState, updateMyPresence])

    const handlePointerUp = useCallback((event: React.
      PointerEvent) => {
        setCursorState((state: CursorState)=> cursorState.mode === CursorMode.Reaction ?
          {...state, isPressed: true} : state
      );
      }, [cursorState.mode, setCursorState])
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if(e.key === '/'){
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: '',
        })
      } else if(e.key === 'Escape'){
        updateMyPresence({ message: ''})
        setCursorState({ mode: CursorMode.Hidden })
      } else if(e.key === '*') {
        setCursorState({
          mode: CursorMode.ReactionSelector,
        })
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if(e.key === '/'){
        e.preventDefault();
      }
    }
    
   return() => {
    window.addEventListener('keyup' , onKeyUp);
    window.addEventListener('keydown' , onKeyDown);
   }

  }, [updateMyPresence])

  const setReaction = useCallback((reaction: string)=> {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false})
  }, [])

  return (
    <div 
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className='h-[100vh]'
    >
      <h1 className='text-2xl'>Welcome to VedLab!!</h1>
      
      {reactions.map((r, index) => (
        <FlyingReaction 
         key={`${r.timestamp}-${index}`}
         x={r.point.x}
         y={r.point.y}
         timestamp={r.timestamp}
         value={r.value}
        />
      ))}

      {cursor && (
        <CursorChat 
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}

      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector  
          setReaction={setReaction}
        />
      )}
     <LiveCursors others={others}/>
    </div>
  )
}

export default Live