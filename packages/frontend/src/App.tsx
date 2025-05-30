import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { MainLayout } from "./MainLayout.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Routes, Route } from "react-router";
import { useState, useEffect } from "react";
import { ValidRoutes } from "csc437-monorepo-backend/src/shared/ValidRoutes.ts";
import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";


function App() {
    const [imageData, _setImageData] = useState<IApiImageData[]>([]);
    const [loading, _setLoading] = useState(true);
    const [error, _setError] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/images");
        if (!response.ok) {
          console.log("Error status:", response.status);
          _setError(true);
          _setLoading(false);
          return;
        }

        const data = await response.json();
        console.log(data);
        _setImageData(data);
        _setLoading(false);
      } catch (err) {
        console.error("Fetch failed:", err);
        _setError(true);
        _setLoading(false);
      }
    };

    fetchImages();
  }, []);
    
    return (
    <Routes>
      <Route path={ValidRoutes.HOME} element={<MainLayout />} >
        <Route index element={<AllImages data={imageData} loading={loading} error={error}/>} />
        <Route path={ValidRoutes.IMAGES} 
        element={<ImageDetails data={imageData} loading={loading} error={error} changeData={_setImageData}/>}/>
        <Route path={ValidRoutes.LOGIN} element={<LoginPage />} />
        <Route path={ValidRoutes.UPLOAD} element={<UploadPage />} />
      </Route> 
    </Routes>

    );
}



export default App;
