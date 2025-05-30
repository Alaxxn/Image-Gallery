
import { useParams } from 'react-router';
import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";

interface ImageProp {
    data: IApiImageData[];
    loading : boolean;
    error : boolean;
}

export function ImageDetails(props : ImageProp) {
    //hook to get param details
    const {imageId} = useParams();
    const imageData = props.data;
    const image = imageData.find(image => image.id === imageId);
    
    if (!image) return <h2>Image not found</h2>;
    if (props.loading) return <p>Loading images...</p>;
    if (props.error) return <p>Failed to load images. Please try again later.</p>;


    return (
        <div className="container">
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </div>
    )
}
