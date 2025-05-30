export type Color = {
    r: number;
    g: number;
    b: number;
}

export type Camera = {
    x: number;
    y: number;
    zoom: number;
}

export enum LayerType {
    Rectangle,
    Ellipse,
    Path,
    Text
}

export type RectangleLayer = {
    type: LayerType.Rectangle,
    x: number,
    y: number,
    height: number,
    width: number,
    fill: Color,
    stroke: Color,
    opacity: number,
    cornerRadius?: number,
}

export type EllipseLayer = {
    type: LayerType.Ellipse,
    x: number,
    y: number,
    height: number,
    width: number,
    fill: Color,
    stroke: Color,
    opacity: number,
}

export type PathLayer = {
    type: LayerType.Path,
    x: number,
    y: number,
    height: number,
    width: number,
    fill: Color,
    stroke: Color,
    opacity: number,
    points: number[][],
}

export type Textlayer = {
    type: LayerType.Text,
    x: number,
    y: number,
    height: number,
    width: number,
    text: string,
    fontSize: number,
    fontWeight: number,
    fontFamily: string,
    fill: Color,
    stroke: Color,
    opacity: number,
}

export type Layer = RectangleLayer | EllipseLayer | PathLayer | Textlayer;

export type Point = {
    x: number;
    y: number;
}

export type XYWH = {
    x: number;
    y: number;
    width: number;
    height: number; 
}

export enum Side {
    Top = 1,// 0001
    Bottom = 2, //0010
    Left = 4, //0100
    Right = 8, //1000

}

export enum CanvasMode {
    None,
    Inserting,
    Dragging,
    Resizing,
    Translating, //select layers, move them around, resize them if you want
    Pencil
}

export type CanvasState = 
| {
    mode: CanvasMode.None
  } 
| {
    mode: CanvasMode.Dragging;
    origin: Point | null;
  }
| {
    mode: CanvasMode.Inserting;
    layerType: LayerType.Rectangle | LayerType.Ellipse | LayerType.Text
  }
| {
    mode: CanvasMode.Pencil;
  }
| {
    mode: CanvasMode.Resizing;
    initialBound: XYWH;
    corner: Side;
  }
| {
    mode: CanvasMode.Translating;
    current: Point;
  }