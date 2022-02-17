import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState } from "../render/core/controllerInput.js";
import { mBounding, mCollision } from "../render/core/cg.js";

let current = null;
let list = [];
export const init = async model => {

  // CREATE PICKERS FOR THE LEFT AND RIGHT CONTROLLERS

  let beamL = model.add(); //0
  beamL.add().add('cube').color(0,0,1).move(0.025,0,0).scale(.02,.005,.005);
  beamL.add().add('cube').color(0,1,0).move(0,0.025,0).scale(.005,.02,.005)
  beamL.add().add('tubeZ').color(1,0,0).move(0,0,0).scale(.005);
  //
  let beamR = model.add(); //1
  beamR.add().add('cube').color(0,0,1).move(0.025,0,0).scale(.02,.005,.005);
  beamR.add().add('cube').color(0,1,0).move(0,0.025,0).scale(.005,.02,.005)
  beamR.add().add('tubeZ').color(1,0,0).move(0,0,0).scale(.005);

  current = model.add('cube').color(0,0,0).move(1,1,0).scale(0.08); //2

  model.add('cube').scale(0.08).move(0,12.5,0); //3
  model.add('cube').scale(0.08).move(2,12.5,0); //4
  model.add('cube').scale(0.08).move(2,12.5,2); //5
  model.add('cube').scale(0.08).move(2,12.5,4); //6


  model.add('cube').scale(0.08).move(4,12.5,0).scale(0.001); //7
  model.add('cube').scale(0.08).move(4,12.5,2).scale(0.001); //7
  model.add('cube').scale(0.08).move(4,12.5,4).scale(0.001); //7
  model.add('cube').scale(0.08).move(0,12.5,2).scale(0.001); //7
  model.add('cube').scale(0.08).move(0,12.5,4).scale(0.001); //7

  model.add('cube').scale(0.08).move(2,10.5,0).scale(0.001); //7
  model.add('cube').scale(0.08).move(2,10.5,2).scale(0.001); //7
  model.add('cube').scale(0.08).move(2,10.5,4).scale(0.001); //7
  model.add('cube').scale(0.08).move(0,10.5,2).scale(0.001); //7
  model.add('cube').scale(0.08).move(0,10.5,4).scale(0.001); //7

  model.add('cube').scale(0.08).move(2,14.5,0).scale(0.001); //7
  model.add('cube').scale(0.08).move(2,14.5,2).scale(0.001); //7
  model.add('cube').scale(0.08).move(2,14.5,4).scale(0.001); //7
  model.add('cube').scale(0.08).move(0,14.5,2).scale(0.001); //7
  model.add('cube').scale(0.08).move(0,14.5,4).scale(0.001); //7

  model.add('cube').scale(0.08).move(2,12.5,6).scale(0.001); //7
  model.add('cube').scale(0.08).move(2,12.5,-2).scale(0.001); //7

  model.add('cube').scale(0.08).move(-2,12.5,0).scale(0.001);//8
  model.add('cube').scale(0.08).move(0,12.5,-2).scale(0.001); //10
  model.add('cube').scale(0.08).move(0,10.5,0).scale(0.001); //11
  model.add('cube').scale(0.08).move(0,14.5,0).scale(0.001); //27


}

let flag1 = false;
export const display = model => {
  model.animate(() => {
    model.setTable(false);

    model.control('a', 'addCube' , () => {
      list.push(current);
      current = model.add('cube').color(0,0,0).move(1,1,0).scale(0.08);
    });

    if (buttonState.right[4].pressed){
      list.push(current);
      current = model.add('cube').color(0,0,0).move(1,1,0).scale(0.08);
    }

    let stickLB = model.child(0).child(0);
    let stickLG = model.child(0).child(1);
    let pivotL = model.child(0).child(2);

    let stickRB = model.child(1).child(0);
    let stickRG = model.child(1).child(1);
    let pivotR = model.child(1).child(2);

    let matrixL  = controllerMatrix.left;
    let triggerL = buttonState.left[0].pressed;

    let matrixR  = controllerMatrix.right;
    let triggerR = buttonState.right[0].pressed;

    let LM = matrixL.length ? cg.mMultiply(matrixL, cg.mTranslate( .006,0,0)) : cg.mTranslate(0,0,1);
    let RM = matrixR.length ? cg.mMultiply(matrixR, cg.mTranslate(-.001,0,0)) : cg.mTranslate(0,0,1);

    model.child(0).setMatrix(LM).turnY(1.5).turnZ(-1.5).move(0.1,0.1,0);
    model.child(1).setMatrix(RM).turnY(1.5).turnZ(-1.5).move(0.1,0.1,0);

    if (triggerL){
      stickLB.identity().turnZ(Math.sin(1)).child(0).color(0.2,0,0.4);
      stickLG.identity().turnZ(-Math.sin(1)).child(0).color(0.2,0,0.4);
      pivotL.child(0).color(1,0,0);
    }
    else{
      stickLB.identity().child(0).color(0,0,1);
      stickLG.identity().child(0).color(0,1,0);
      pivotL.child(0).color(1,0,0);
    }

    if (triggerR){
      stickRB.identity().turnZ(Math.sin(1)).child(0).color(0.2,0,0.4);
      stickRG.identity().turnZ(-Math.sin(1)).child(0).color(0.2,0,0.4);
      pivotR.child(0).color(1,0,0);

    }

    else{
      stickRB.identity().child(0).color(0,0,1);
      stickRG.identity().child(0).color(0,1,0);
      pivotR.child(0).color(1,0,0);
    }

    let object = current;
    let matrixRB = RM
    let point = [matrixRB[12], matrixRB[13], matrixRB[14]]
    for (let i in list){
      object = list[i];
      if (triggerR && mCollision(point, mBounding(object, 3))){
        flag1 = true
        current = object;
      }
    }
    object = current;
    if (flag1){
      object.setMatrix(RM).scale(0.08).move(0,-2.5,-2.5);
    }
    if (!triggerR){
      flag1 = false;
    }

    for (let i = 7; i <= 27; i++){
      let collide = model.child(i);
      let bounding = mBounding(collide,4);
      for(let j in bounding){
        if (mCollision(bounding[j], mBounding(object, 2))){
          object.setMatrix(collide.getMatrix()).scale(1000);
        }
      }
    }


  });
}