import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { MainLayout } from "./MainLayout.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Routes, Route } from "react-router";
import { useState, useEffect } from "react";
import { ValidRoutes } from "csc437-monorepo-backend/src/shared/ValidRoutes.ts";
import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";
import {ImageSearchForm} from "./images/ImageSearchForm.tsx";


function App() {
    const [imageData, _setImageData] = useState<IApiImageData[]>([]);
    const [loading, _setLoading] = useState(true);
    const [searchTerm, _setSearchTerm] = useState("");
    const [error, _setError] = useState(false);

    const fetchImages = async () => {
      try {
        const endpoint = `http://localhost:3000/api/images/search?name=${searchTerm}`
        const response = await fetch(endpoint);
        if (!response.ok) {
          console.log("Error status:", response.status);
          _setError(true);
          _setLoading(false);
          return;
        }
        const data = await response.json();
        _setImageData(data);
        _setLoading(false);
      } catch (err) {
        console.error("Fetch failed:", err);
        _setError(true);
        _setLoading(false);
      }
    };

  useEffect(() => {
    fetchImages();
  }, []);

  function handleImageSearch() {
    fetchImages();
  }
    
  return (
    <Routes>
      <Route path={ValidRoutes.HOME} element={<MainLayout />} >
        <Route index element={
          <AllImages 
            data={imageData} 
            loading={loading} 
            error={error} 
            searchPanel= {<ImageSearchForm 
                  searchString = {searchTerm}
                  onSearchStringChange = {_setSearchTerm}
                  onSearchRequested = {handleImageSearch}
            
              />} 
          />}/>
        <Route path={ValidRoutes.IMAGES} 
        element={<ImageDetails data={imageData} loading={loading} error={error} changeData={_setImageData}/>}/>
        <Route path={ValidRoutes.LOGIN} element={<LoginPage />} />
        <Route path={ValidRoutes.UPLOAD} element={<UploadPage />} />
      </Route> 
    </Routes>

    );
}



export default App;
