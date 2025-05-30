
import { useParams } from 'react-router';
import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";

interface ImageProp {
    data: IApiImageData[];
}

export function ImageDetails(props : ImageProp) {
    //hook to get param details
    const {imageId} = useParams();
    const imageData = props.data;
    const image = imageData.find(image => image.id === imageId);
    if (!image) {
        return <h2>Image not found</h2>;
    }

    return (
        <div className="container">
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </div>
    )
}
