import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";
import { ImageGrid } from "./ImageGrid.tsx";

interface ImageProp {
    data: IApiImageData[];
    loading : boolean;
    error : boolean;
}

export function AllImages(props : ImageProp) {
    
    if (props.loading) return <p>Loading images...</p>;
    if (props.error) return <p>Failed to load Image. Please try again later.</p>;

    return (
        <div className="container">
            <h2>All Images</h2>
            <ImageGrid images={props.data} />
        </div>
    );
}
