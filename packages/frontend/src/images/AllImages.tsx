import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";
import { ImageGrid } from "./ImageGrid.tsx";

interface ImageProp {
    data: IApiImageData[];
}

export function AllImages(props : ImageProp) {
    return (
        <div className="container">
            <h2>All Images</h2>
            <ImageGrid images={props.data} />
        </div>
    );
}
