import { PathActionEnum } from "../../utils/enums/enums";

export interface slideObject {
    seq: number;
    path: pathObj[];
}

export interface pathObj {
    seq?: number;
    path: any;
    originalCanvasWidth: number | undefined,
    originalCanvasHeight: number | undefined,
    left: number,
    top: number,
    action: PathActionEnum;
}