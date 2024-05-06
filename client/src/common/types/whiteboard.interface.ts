import { PathActionEnum, penToolTip } from "../../utils/enums/enums";

export interface slideObject {
    seq: number;
    path: pathObj[];
}

export interface pathObj {
    seq?: number;
    path: any;
    pen: penToolTip,
    originalCanvasWidth: number | undefined,
    originalCanvasHeight: number | undefined,
    action: PathActionEnum;
}