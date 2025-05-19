import { useState } from "react";
import { fetchDataFromServer } from "../MockAppData.ts";
import { useParams } from 'react-router';



export function ImageDetails() {
    //hook to get param details
    const {imageId} = useParams();
    console.log(imageId);
    
    const [imageData, _setImageData] = useState(fetchDataFromServer);
    const image = imageData.find(image => image.id === imageId);
    if (!image) {
        return <div className="container"><h2>Image not found</h2></div>;
    }

    return (
        <div className="container">
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </div>
    )
}
