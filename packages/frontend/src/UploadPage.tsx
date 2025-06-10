import { useId, useState } from 'react';


function readAsDataURL(file : File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = () => resolve(fr.result as string);
        fr.onerror = (err) => reject(err);
    });
}


export function UploadPage() {

    const [img_data, setImgData] = useState("");
    const imageInputId = useId();

    async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const fileObj = e.target.files?.[0];
        if (fileObj) {
            const dataUrl = await readAsDataURL(fileObj);
            setImgData(dataUrl);
        }
    }

    return (
        <div className="container">
            <form>
                <div>
                    <label htmlFor={imageInputId}>Choose image to upload: </label>
                    <input
                        id={imageInputId}
                        name="image"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        required
                        onChange={handleFileSelected}
                    />
                </div>
                <div>
                    <label>
                        <span >Image title: </span>
                        <input name="name" required />
                    </label>
                </div>

                <div> {/* Preview img element */}
                    <img style={{width: "20em", maxWidth: "100%"}} src={img_data} alt="" />
                </div>

                <input type="submit" value="Confirm upload" />
            </form>
        </div>
    );
}
