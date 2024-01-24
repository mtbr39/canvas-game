import { Reson } from "./system/reson";

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    const reson = new Reson( canvas );

    const animalFactory = reson.animalFactory;
    animalFactory.make({ number: 120, layers: ["animal"], speciesName: "boidA" });
    animalFactory.make({ number: 30, layers: ["animal"], speciesName: "boidB", shapeColor: "#94E4A9", width: 15, height: 15, velocity: 0.3, });
    animalFactory.make({ number: 8, layers: ["animal"], speciesName: "boidC", shapeColor: "#FF8E87", width: 30, height: 30, velocity: 0.5, });
    animalFactory.make({ number: 3, layers: ["animal"], speciesName: "boidE", shapeColor: "#FFA769", width: 40, height: 40, velocity: 0.2, });
    animalFactory.make({ number: 40, layers: ["animal"], speciesName: "boidE", shapeColor: "#FFA769", width: 10, height: 10, velocity: 0.2, });

});
