import RegularMenuPack from "@/containers/RegularMenuPack";
import { useTranslations } from "next-intl";

const MenuPage = () => {
  const t = useTranslations("Menu");

  return (
    <main className="flex-1 w-full px-4 md:px-12 py-8">
      <h1 className="text-4xl font-bold text-[#372117] text-center mb-8 font-chivo">
        {t("title")}
      </h1>
      <RegularMenuPack />
    </main>
  );
};

export default MenuPage;
