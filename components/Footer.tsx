import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer className="w-full bg-[#372117] text-white mt-12">
      <div className="w-full border-t border-white/20"></div>

      <div className="py-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} PP Food. {t("rights")}
      </div>
    </footer>
  );
};

export default Footer;
