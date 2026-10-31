import { cx } from "../../lib/utils";

function Card({ className, children, ...props }) {
  return <div className={cx("h-study-card p-5", className)} {...props}>{children}</div>;
}

export default Card;
export { Card };
