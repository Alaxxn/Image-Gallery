import type { IImageData } from "../MockAppData.ts";
import { ImageGrid } from "./ImageGrid.tsx";

interface ImageProp {
    data: IImageData[];
}


export function AllImages(props : ImageProp) {
    return (
        <div className="container">
            <h2>All Images</h2>
            <ImageGrid images={props.data} />
        </div>
    );
}
