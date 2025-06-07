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

        try {
            const endpoint = `/api/images/${props.ImgId}/name`;
            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: input }),
            });

            if (response.ok) {
                props.changeData((prevData: IApiImageData[]) =>
                    prevData.map((img) =>
                    img.id === props.ImgId ? { ...img, name: input } : img
                ));
            } else {
                const error = await response.json();
                console.error("Failed to update image name:", error.error || error);
                alert("Could not update image name.");
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error occurred.");
        }

        _setLoading(false);
        setIsEditingName(false);
        setIsButtonDisabled(false);
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