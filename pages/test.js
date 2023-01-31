import React, { useRef, useState, useEffect } from 'react'

import Draggable from 'react-draggable';
const quickAndDirtyStyle = {
  width: "200px",
  height: "200px",
  background: "#FF9900",
  color: "#FFFFFF",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}

const DraggableComponent = () => {
  const [pressed, setPressed] = useState(false)
  const [position, setPosition] = useState({x: 0, y: 0})
  const ref = useRef()

  // Monitor changes to position state and update DOM
  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translate(${position.x}px, ${position.y}px)`
    }
  }, [position])

  // Update the current position if mouse is down
  const onMouseMove = (event) => {
    if (pressed) {
        console.log(event)
      setPosition({
        x: event.pageX,
        y: event.pageY
      })
    }
  }
/*
  return (
    <div
      ref={ ref }
      style={ quickAndDirtyStyle }
      onMouseMove={ onMouseMove }
      onMouseDown={ () => setPressed(true) }
      onMouseUp={ () => setPressed(false) }>
      <p>{ pressed ? "Dragging..." : "Press to drag" }</p>
    </div>
  )
  */

  return (
    <Draggable handle="strong">
                    <div className="box no-cursor">
                        <strong className="cursor">Drag Here</strong>
                        <div>You must click my handle to drag me</div>
                    </div>
            </Draggable>
  )
}

export default DraggableComponent