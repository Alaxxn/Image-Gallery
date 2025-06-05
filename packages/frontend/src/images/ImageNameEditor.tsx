import { useState } from "react";
import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";

interface INameEditorProps {
    initialValue: string;
    ImgId: string;
    changeData: React.Dispatch<React.SetStateAction<IApiImageData[]>>;
}

export function ImageNameEditor(props: INameEditorProps) {

    const [isEditingName, setIsEditingName] = useState(false);
    const [input, setInput] = useState(props.initialValue);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [loading, _setLoading] = useState(false);

    async function handleSubmitPressed() {
        setIsButtonDisabled(true);
        _setLoading(true);
        const response = await fetch("/api/images");
        const data = await response.json();
        console.log(data);
        data.forEach((image : IApiImageData) => {
            if((image.id === props.ImgId)){
                image.name = input;
            }
        });
        _setLoading(false);
        setIsEditingName(false);
        setIsButtonDisabled(false);
        props.changeData(data);
    }

    if (isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                {loading && <h2>Working...</h2>}
                <label>
                    New Name <input disabled={isButtonDisabled} value={input} onChange={e => setInput(e.target.value)}/>
                </label>
                <button disabled={isButtonDisabled} onClick={handleSubmitPressed}>Submit</button>
                <button onClick={() => {setIsEditingName(false);
                                        setIsButtonDisabled(false);
                }}>Cancel</button>
            </div>
        );
    } else {
        return (
            <div style={{ margin: "1em 0" }}>
                <button onClick={() => setIsEditingName(true)}>Edit name</button>
            </div>
        );
    }
}