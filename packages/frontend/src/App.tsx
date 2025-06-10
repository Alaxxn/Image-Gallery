import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { MainLayout } from "./MainLayout.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Routes, Route } from "react-router";
import { useState, useRef, useEffect } from "react";
import { ValidRoutes } from "csc437-monorepo-backend/src/shared/ValidRoutes.ts";
import type { IApiImageData } from "csc437-monorepo-backend/src/shared/ApiImageData.ts";
import {ImageSearchForm} from "./images/ImageSearchForm.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";


function App() {
    const [imageData, _setImageData] = useState<IApiImageData[]>([]);
    const [loading, _setLoading] = useState(true);
    const [searchTerm, _setSearchTerm] = useState("");
    const [AuthToken, _setAuthToken] = useState("");
    const [error, _setError] = useState(false);
    const ref = useRef(0);

    const fetchImages = async () => {
      ref.current += 1;
      const requestNum = ref.current;
      try {
        const endpoint = `http://localhost:3000/api/images/search?name=${searchTerm}`
        const response = await fetch(endpoint, {
          method: 'GET', // Or the appropriate HTTP method (POST, PUT, etc.)
            headers: { 'Authorization': `Bearer ${AuthToken}`}
        });
        console.log(`fetching data with token=${AuthToken}`);
        if (!response.ok) {
          console.log("Error status:", response.status);
          if (requestNum === ref.current){
          _setError(true);
          _setLoading(false);
          }
        }else if (requestNum === ref.current){
          const data = await response.json();
          _setImageData(data);
          _setLoading(false);
        }else{

        }

      } catch (err) {
        console.error("Fetch failed:", err);
        if (requestNum === ref.current){
        _setError(true);
        _setLoading(false);
        }
      }
    };

  function handleImageSearch() {
    fetchImages();
  }

  useEffect(() => {
    if (AuthToken) {
      fetchImages();
    }
  }, [AuthToken]);
      
  return (
    <Routes>
      <Route path={ValidRoutes.HOME} element={ <MainLayout />} >
        <Route index element={ 
          <ProtectedRoute authToken={AuthToken} > 
          <AllImages 
            data={imageData} 
            loading={loading} 
            error={error} 
            searchPanel= {<ImageSearchForm 
                  searchString = {searchTerm}
                  onSearchStringChange = {_setSearchTerm}
                  onSearchRequested = {handleImageSearch}/>} 
          /> </ProtectedRoute> }/>
        <Route path={ValidRoutes.IMAGES} 
          element={
          <ProtectedRoute authToken={AuthToken}>
          <ImageDetails 
              data={imageData} 
              loading={loading} 
              error={error} 
              changeData= {_setImageData}/>
          </ProtectedRoute> }/>
        <Route path={ValidRoutes.LOGIN} 
              element={<LoginPage 
              isRegistering={false} 
              UpdateToken = {_setAuthToken}/>} />
        <Route path={ValidRoutes.REGISTER} 
              element={<LoginPage 
              isRegistering={true}
              UpdateToken = {_setAuthToken}/>} />
        <Route path={ValidRoutes.UPLOAD} element={ 
          //<ProtectedRoute authToken={AuthToken} > 
          <UploadPage /> 
          //</Route></ProtectedRoute>
          }/>
      </Route> 
    </Routes>

    );
}

export default App;
