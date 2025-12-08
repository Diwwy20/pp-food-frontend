import HomeContainer from "@/containers/HomeContainer";
import Recommended from "@/containers/Recommended";
import ReserverDinner from "@/containers/ReserverDinner";
import Services from "@/containers/Services";

const HomePage = () => {
  return (
    <main className="flex-1 w-full px-4 md:px-12 py-4">
      <HomeContainer />
      <Recommended />
      <Services />
      <ReserverDinner />
    </main>
  );
};

export default HomePage;
