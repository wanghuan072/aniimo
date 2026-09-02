import { Breadcrumb } from "@/components/ui/Content";
import styles from "@/style/page/tools.module.css";
export default function StaticPage({title,description,children}:{title:string;description:string;children:React.ReactNode}){return <><section className={styles.toolHeader}><div className="container"><Breadcrumb items={[{label:title}]} /><h1>{title}</h1><p>{description}</p></div></section><section className={styles.toolContent}><div className={`container ${styles.staticCopy}`}>{children}</div></section></>}
