import Header from "../../Content/Header";
import { ReactNode } from "react";

interface HeaderProps {
  title?: string;
  selectedMenuKey?: any;
}
interface BreadcrumbItemProps {
  icon?:string;
  title?:string;
  url?:string;
}

interface Props {
  showHeader?: boolean;
  showFooter?: boolean;
  breadcrumbItems?:BreadcrumbItemProps[]
  children?: ReactNode; // Made `children` optional
  headerProps?: HeaderProps;
}

const App: React.FC<Props> = ({ showHeader = true, children, headerProps,breadcrumbItems=[] }) => {
  return (
    <>
      {showHeader && <Header {...headerProps} />}
      <div className={`${breadcrumbItems.length>0?"min-h-[calc(100vh-79px)]":"min-h-[calc(100vh-79px)]"}`}>
        {children}
      </div>
      {/* {showFooter && <footer>Footer Content</footer>} */}
    </>
  );
};

export default App;
