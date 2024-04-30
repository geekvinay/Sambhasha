import { pathObj, slideObject } from "../common/types/whiteboard.interface";

export class Whiteboard {
    public bookMetaData = new Array([]) as any;
    public slideMetaData: slideObject = { path: [], seq: 0 };
    public currSlideMetaData: slideObject = { path: [], seq: 0 };

    // Constructor 
    // Create a new bookMetaData to store a colleciton of sequenced slides
    // Add a empty slide object to it
    constructor() {
        this.flushBookMetaData();
        this.setBookMetaData();
        this.addNewSlide();
    }

    setBookMetaData() {
        localStorage.setItem("SLIDES", JSON.stringify(this.bookMetaData));
    }
    flushBookMetaData() {
        localStorage.clear();
    }
    getBookMetaData() {
        const localData = localStorage.getItem("SLIDES");
        if (localData?.length) {
            var parsedData = JSON.parse(localData);
        }
        console.log('parseData: ', parsedData);
        this.bookMetaData = parsedData;
        return parsedData;
    }

    getEmptySlide() {
        const temp: slideObject = {
            path: [],
            seq: 0
        };
        return temp;
    }

    // Add slide to the pages object
    // Add new slide object with empty data
    addNewSlide() {
        this.getBookMetaData();
        console.log('this.bookMetaData: ', this.bookMetaData);
        const emptySlide = this.getEmptySlide();
        this.bookMetaData.push(
            emptySlide
        );
        console.log('this.bookMetaData: ', this.bookMetaData)
    }

    // Add path to slide with sequenced serial number
    // Add it to slide and store back to localstorage
    addPathToSlide(seq: number, pathObj: pathObj) {
        this.getBookMetaData();
        let currSlide = this.bookMetaData[seq];
        currSlide?.path?.push(pathObj);
        this.setBookMetaData();
    }

    // Undo path from slide by slide sequenced number
    undoPathToSlide(seq: number) {
        this.getBookMetaData();
        let currSlide = this.bookMetaData[seq];
        console.log('localData:: currSlide: ', currSlide);
        const path = currSlide.path.splice(-1, 1);
        console.log('localData:: path: ', path);
        this.setBookMetaData();
        this.getBookMetaData();
        currSlide = this.bookMetaData[seq];
        console.log('localData:: currSlide: ', currSlide);
        return path;
    }
}