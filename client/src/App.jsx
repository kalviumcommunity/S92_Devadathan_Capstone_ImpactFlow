import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import BeneficiaryCard from "./components/BeneficiaryCard";
import Footer from "./components/Footer";
import FileUpload from "./components/FileUpload";

function App() {
  return (
    <div>
      <Header />
      <Sidebar />
      <BeneficiaryCard />
      <FileUpload />
      <Footer />
    </div>
  );
}

export default App;