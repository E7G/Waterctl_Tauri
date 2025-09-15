import "water.css/out/light.min.css";
import "./styles.css";
//import "./writeValueLogging";
import { handleButtonClick } from "./bluetooth";
import { checkPermissions } from "@mnlphlp/plugin-blec";
import { initSettingsUI } from "./settings";
//import { registerServiceWorker, resizeWindow, setupInstallButton } from "./pwaHelper";

document.getElementById("counter")?.classList.remove("low-time");//不然这个样式会被精简掉


//(document.getElementById("version") as HTMLSpanElement).innerText = " · v" + VERSION;

document.addEventListener("DOMContentLoaded", async() => {
  const bley = await checkPermissions();
  if (!bley) {
    (document.querySelector(".supported") as HTMLElement).style.display = "none";
    (document.querySelector(".unsupported") as HTMLElement).style.display = "block";
  }
  const mainButton = document.getElementById("main-button") as HTMLButtonElement;
  mainButton.addEventListener("click", handleButtonClick);
  mainButton.click();
  
  // 初始化设置UI
  initSettingsUI();
  
  console.log("DOMContentLoaded");
});

//fetch("https://count.cab/hit/kqbHURtd0E", { method: "POST" });

// PWA
//registerServiceWorker();
//setupInstallButton();
//resizeWindow();