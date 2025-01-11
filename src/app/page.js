import styles from "./page.module.css";
import NumericInput from "./form-components/NumericInput";


export default function Home() {
  return (
    <div>
      <NumericInput pieceType={"Fail"}/>
      <NumericInput pieceType={"Success"}/>
      
    </div>
  );
}
