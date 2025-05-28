import { ReactSketchCanvas } from "react-sketch-canvas";

export default function SketchCanvas() {
  return (
    <div className="flex justify-center flex-col">
      <h1>Draw here!</h1>
      <ReactSketchCanvas
        width="50%"
        height="150px"
        canvasColor="transparent"
        strokeColor="#a855f7"
      />
    </div>
  );
}