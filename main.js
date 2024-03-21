import { MyElement } from "mnbski-lit-component";

console.log(MyElement);
console.log("TEST SCRIPT")

const myElement = new MyElement();
document.body.appendChild(myElement);

// document.querySelector('#app').innerHTML = `
//   <div>
//     <my-element></my-element>
//   </div>
// `