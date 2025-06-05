import { useParams } from 'react-router';
import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";
import { ImageNameEditor } from "./ImageNameEditor";


interface ImageProp {
    data: IApiImageData[];
    loading : boolean;
    error : boolean;
    changeData: React.Dispatch<React.SetStateAction<IApiImageData[]>>;
}

export function ImageDetails(props : ImageProp) {
    //hook to get param details
    const {imageId} = useParams();
    const imageData = props.data;
    const image = imageData.find(image => image.id === imageId);

    if (props.loading) return <p>Loading images...</p>;
    if (props.error) return <p>Failed to load images. Please try again later.</p>;
    if (!imageId) return <h2>Invalid image ID</h2>;
    if (!image) return <h2>Image not found</h2>;


    return (
        <div className="container">
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <ImageNameEditor ImgId={imageId} initialValue={image.name} changeData={props.changeData}/> 
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </div>
    )
}
