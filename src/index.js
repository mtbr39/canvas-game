import { Launcher } from "./launcher";

document.addEventListener("DOMContentLoaded", () => {
    const canvasElement = document.getElementsByTagName('canvas')[0];
    const canvasID = canvasElement.id;
    new Launcher({ projectID: canvasID, canvas: canvasElement });
});
