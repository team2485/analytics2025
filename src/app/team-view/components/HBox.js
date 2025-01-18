"use client";

export default function HBox({title, value, color1, color2}) {
    return (
      <table>
        <tr>
          <td style={{backgroundColor: color1}}>{title}</td>
          <td style={{backgroundColor: color2, fontSize: "13px"}}>{value}</td>
        </tr>
      </table>
    )
  }