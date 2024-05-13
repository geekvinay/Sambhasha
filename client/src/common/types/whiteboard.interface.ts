import { PathActionEnum, penToolTip } from "../../utils/enums/enums";

export interface slideObject {
    seq: number;
    paths: pathObj[];
}

export interface pathObj {
    seq?: number;
    path: any;
    pen: penToolTip;
    originalCanvasWidth: number | undefined;
    originalCanvasHeight: number | undefined;
    action: PathActionEnum;
}

export interface PageMetaData {
    title: string;
    pathCommands: any;
}

export interface SlidesMetaData {
    totalPages: number;
    currentPage: number;
    pages: PageMetaData[];
}