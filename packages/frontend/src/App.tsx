import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { MainLayout } from "./MainLayout.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Routes, Route } from "react-router";

function App() {
    return (
    <Routes>
      <Route path="/" element={<MainLayout />} >
        <Route index element={<AllImages />} />
        <Route path="images/:imageId" element={<ImageDetails/>} />
        <Route path="login" element={<LoginPage />} />
        <Route path="upload" element={<UploadPage />} />
      </Route> 
    </Routes>

    );
}



export default App;
