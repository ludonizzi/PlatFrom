var canvas = document.getElementById('canvas');
let divFps = document.getElementById("fps");


var engine = new BABYLON.Engine(canvas, true);
let engineScale = Math.min(window.devicePixelRatio,1.5);


//loading screen
var loadingScreenDiv = window.document.getElementById("loadingScreen");

function customLoadingScreen() {
}
customLoadingScreen.prototype.displayLoadingUI = function () {
    loadingScreenDiv.style.display = "inline";
    loadingScreenDiv.innerHTML = "Loading:     " + (100 - scene.getWaitingItemsCount()) + "%";
};
customLoadingScreen.prototype.hideLoadingUI = function () {
    loadingScreenDiv.style.display = "none";
};
var loadingScreen = new customLoadingScreen();
engine.loadingScreen = loadingScreen;


var clicks = 0;
   




//Main Menu

var scene0 = new BABYLON.Scene(engine);
scene0.createDefaultEnvironment();
var menulight = new BABYLON.PointLight("spot1", new BABYLON.Vector3(-20, 5, 10), scene0);
menulight.diffuse = new BABYLON.Color3(1, 1, 1);
menulight.specular = new BABYLON.Color3(0, 0, 0);
menulight.intensity = 1;
var camera1 = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-40, 10, 0), scene0);
camera1.radius = 15;
camera1.heightOffset = 5;
camera1.rotationOffset = 0;
camera1.cameraAcceleration = 0.1;
camera1.maxCameraSpeed = 100;
camera1.lowerRadiusLimit = 0;
camera1.lowerHeightOffsetLimit = 0;
camera1.upperHeightOffsetLimit = 80;
camera1.attachControl(canvas, true);

var advancedTexture1 = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI1", true, scene0);

var title = new BABYLON.GUI.TextBlock();
title.fontSize = 100;
title.height = 0.2;
title.text = "P L A T F R O M";
title.color = "Grey";
title.fontFamily = "Impact";
title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
advancedTexture1.addControl(title); 

var start = BABYLON.GUI.Button.CreateSimpleButton("but", "START");
start.width = "150px";
start.height = "80px";
start.top = "200";
start.left = "0";
start.color = "red";
start.textBlock.color = "white";
start.textBlock.fontFamily = "Lucida Console";
start.background = "black";
advancedTexture1.addControl(start);


start.onPointerUpObservable.add(function () {       
    clicks ++;
    BABYLON.VirtualJoystick.Canvas.style.zIndex = "4"
    camera.radius = 90;
    camera.heightOffset = 70;  
    camera.rotationOffset = 180;                  
});


var panel2 = new BABYLON.GUI.StackPanel();  
panel2.left = "-400px";
advancedTexture1.addControl(panel2); 

var textblock = new BABYLON.GUI.TextBlock();
textblock.height = "150px";
textblock.fontSize = 40;
textblock.fontFamily = "Lucida Console";
textblock.fontStyle = "bold";
textblock.text = "Select difficulty";
panel2.addControl(textblock); 

var addRadio = function(text, parent, life1) {

    var button = new BABYLON.GUI.RadioButton();
    button.width = "20px";
    button.height = "20px";
    button.color = "red";
    button.background = "black"; 
    if(text=="Easy"){
        button.isChecked=true;
    }

    button.onIsCheckedChangedObservable.add(function(state) {
        if (state) {
            textblock.text = "You selected: " + text;
            if(text == "Easy")life1.text = "10";
            if(text == "Medium") life1.text ="5";
            if(text == "Hard") life1.text = "3";
        }
    }); 

    var header = BABYLON.GUI.Control.AddHeader(button, text, "150px", { isHorizontal: true, controlFirst: true });
    header.height = "50px";
    header.children[1].fontSize = 30;
    header.children[1].fontStyle = "bold";
    header.children[1].fontFamily = "Lucida Console";
    header.children[1].onPointerDownObservable.add(function() {
        button.isChecked = !button.isChecked;
    });

    parent.addControl(header);    
}


var bool = true;
BABYLON.SceneLoader.ImportMesh("", "./models/dude/", "dude.babylon", scene0, function (newMeshes, particleSystems, skeletons) {
    var zero = newMeshes[0];
    skeleton = skeletons[0];
    zero.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
    zero.position = new BABYLON.Vector3(0,0,0);
    camera1.lockedTarget = zero;
    skeleton.bones[32].rotate(BABYLON.Axis.Y, -0.5, BABYLON.Space.LOCAL);
    skeleton.bones[13].rotate(BABYLON.Axis.Y, +0.5, BABYLON.Space.LOCAL);
    
    scene0.registerAfterRender(function(){
        //console.log(skeletons[0].bones[7].position);        
        if(skeletons[0].bones[7].position.z > 1) {
            bool = false;
        }
        else if(skeletons[0].bones[7].position.z < -1) {
            bool = true;
        }
        if(bool){
            skeletons[0].bones[7].translate(new BABYLON.Vector3(0, 0, 0.15));
        } 
        else{
            skeletons[0].bones[7].translate(new BABYLON.Vector3(0, 0, -0.15));
        } 
    });
});




//game over scene
var scene1 = new BABYLON.Scene(engine);
scene1.createDefaultCameraOrLight(true, true, true);
scene1.clearColor = new BABYLON.Color3(0.84, 0.29, 0.29);
var advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("Gameover", true, scene1);
var gover = new BABYLON.GUI.TextBlock();
gover.text = "GAME OVER";
gover.fontFamily = "Impact";
gover.color = "white";
gover.fontSize = 150;
gover.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
advancedTexture2.addControl(gover);


var relbut = BABYLON.GUI.Button.CreateSimpleButton("but", "PLAY AGAIN");
relbut.width = "150px";
relbut.height = "80px";
relbut.color = "red";
relbut.textBlock.color = "white";
relbut.textBlock.fontFamily = "Lucida Console";
relbut.background = "black";
relbut.top = "-100px";
relbut.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
advancedTexture2.addControl(relbut);

relbut.onPointerUpObservable.add(function () {       
    
    location.reload();
    return false;
});






//scene
var scene = new BABYLON.Scene(engine);

scene.autoClear = false;
scene.autoClearDepthAndStencil = false;
scene.blockMaterialDirtyMechanism = true;

scene.useGeometryIdsMap = true;
scene.useMaterialMeshMap = true;
scene.useClonedMeshMap = true;

/* const options = new BABYLON.SceneOptimizerOptions();
options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1.5));
// Decalare an Optimizer
var optimizer = new BABYLON.SceneOptimizer(scene, options);


scene.registerAfterRender(function(){

if(engine.getFps()<60){
    optimizer.start();
}
}); */



//DEBUGGING
// Instrumentation
var instrumentation = new BABYLON.EngineInstrumentation(engine);
instrumentation.captureGPUFrameTime = true;
instrumentation.captureShaderCompilationTime = true;

// GUI
var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

var rect1 = new BABYLON.GUI.Rectangle();
rect1.width = 0.2;
rect1.height = "40px";
rect1.width = "150px";
rect1.color = "red";
rect1.background = "black";
rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
advancedTexture.addControl(rect1);

var life1 = new BABYLON.GUI.TextBlock();
life1.text = "10";
life1.left = "25px";
life1.color = "white";
life1.fontFamily = "Lucida Console";
rect1.addControl(life1);

addRadio("Easy", panel2 ,life1);
addRadio("Medium", panel2, life1);
addRadio("Hard", panel2, life1);

var life2 = new BABYLON.GUI.TextBlock();
life2.text = "LIFE: ";
life2.left = "-15px";
life2.color = "white";
life2.fontFamily = "Lucida Console";
rect1.addControl(life2);

var rect2 = new BABYLON.GUI.Rectangle();
rect2.width = 0.2;
rect2.height = "150px";
rect2.width = "200px";
rect2.color = "red";
rect2.background = "black";
rect2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
rect2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
advancedTexture.addControl(rect2);

var hint = new BABYLON.GUI.TextBlock("hint");
hint.textWrapping = true;
hint.fontFamily = "Lucida Console";
hint.text = "Tutorial:\nW: Up S: Down\nA: Left D: Right\nM: On/Off Music\nC: Camera Switch";
hint.color = "white";

rect2.addControl(hint);



var label = new BABYLON.GUI.TextBlock();
label.fontFamily = "Lucida Console";
label.text = "Press Spacebar to jump!";
label.color = "white";
advancedTexture.addControl(label);


var label3 = new BABYLON.GUI.TextBlock();
label3.width = 10;
label3.height = "30px";
label3.fontSize = 15;
label3.fontFamily = "Lucida Console";
label3.text = "DON'T TOUCH BOXES";
label3.color = "white";




  


//physics
var gravityVector = new BABYLON.Vector3(0,-150, 0);
var physicsPlugin = new BABYLON.CannonJSPlugin();
scene.enablePhysics(gravityVector, physicsPlugin);
var physicsViewer = new BABYLON.Debug.PhysicsViewer();
var physicsHelper = new BABYLON.PhysicsHelper(scene);



        
var bodyb = false;
var groundb = false;
var groundb3 = false;
var boxbarb = false;
var levelbordb = false;
var levelbordb2 = false;
var expbool = false;
var dogwalk = false;
var dogbark = false;
var walldown = true;


//mapping commands
var map = {};
scene.actionManager = new BABYLON.ActionManager(scene);

scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
    map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

}));

scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
    map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
}));



//movement
var njump = 0;
var walkup = false;
var walkdown = false;
var walkleft = false;
var walkright = false;

//animation control
var wbool = false;
var sbool = false;
var abool = false;
var dbool = false;

//animation bool
var animbool = false;

window.addEventListener("keydown", function (evt) {
        if (evt.keyCode == 32) {
            if(njump == 0){
                dudeanim.pause();
                jump.play();
                body.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 5000, 0), body.getAbsolutePosition());
                njump++;
            }                
        }
        if(evt.keyCode == 87){
            player.rotation.y = Math.PI;
            wbool = true;
            stickbool=false;
        }
        if(evt.keyCode == 68){
            player.rotation.y =  -Math.PI/2;
            dbool=true;
            stickbool=false;
        }
        if(evt.keyCode == 65){
            player.rotation.y =  Math.PI/2;
            abool=true;
            stickbool=false;
        }
        if(evt.keyCode == 83){
            player.rotation.y =  0;
            sbool=true;
            stickbool=false;
        }

        if(evt.keyCode == 77){
             if(music.isPlaying && body.position.x <= 1300){
                 music.pause();
             }
             else if(!music.isPlaying && body.position.x <= 1300){
                 music.play();
             }
             if(finalmusic.isPlaying && body.position.x >= 1400){
                finalmusic.pause();
            }
            else if(!finalmusic.isPlaying && body.position.x >= 1400){
                finalmusic.play();
            }
        }
        if(evt.keyCode == 87 || evt.keyCode == 83 || evt.keyCode == 65 || evt.keyCode == 68){
            if(!animbool){
                dudeanim.restart();
                animbool=true;
            }
        }
});

var camerabool = false;
window.addEventListener("keyup", function (evt) {

    if (evt.keyCode == 87){
        walkup = false;
        wbool = false;
    }
    if (evt.keyCode == 83){
        walkdown = false;
        sbool = false;
    }
    if (evt.keyCode == 65){
        walkleft = false;
        abool = false;
        if(wbool){
            player.rotation.y = Math.PI;
        }
        if(sbool){
            player.rotation.y = 0;
        }
    }
    if (evt.keyCode == 68){
        walkright = false;
        dbool = false;
        if(wbool){
            player.rotation.y = Math.PI;
        }
        if(sbool){
            player.rotation.y = 0;
        }
    }

    if(evt.keyCode == 67){
        
        if(!camerabool){
            
            camera.maxZ = 10000;
            camera.radius = 60;
            camera.heightOffset = 10;
            camera.rotationOffset = 180;

            camerabool = true;
        }
        else{
            
            camera.maxZ = 270;
            camera.radius = 70;
            camera.heightOffset = 50;
            camera.rotationOffset = 180;
            camerabool = false;
        }
       
    }

    if (!wbool && !sbool && !abool && !dbool){
        for(i=0; i<positionbones.length;i++){
            skeleton.bones[i].position = positionbones[i];
            skeleton.bones[i].rotation = rotationbones[i];
        }
        dudeanim.pause();
        animbool = false;
        player.rotation.y+=Math.PI;
        
    }


});



var firebullet = function () {
    var bullet = BABYLON.MeshBuilder.CreateCylinder("pro", {diameterTop:0, diameterBottom: 5, height: 7, tessellation: 96}, scene);
    bullet.material = demMaterial;
    bullet.position = new BABYLON.Vector3(robbody.position.x, 5, robbody.position.z);
    bullet.rotation.z = Math.PI/2;
    bullet.position.y = 5;
    bullet.physicsImpostor = new BABYLON.PhysicsImpostor(bullet, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, friction: 0.5, restition: 0.3 }, scene);
    bullet.life = 0;
    shot.play();
    body.physicsImpostor.registerOnPhysicsCollide(bullet.physicsImpostor, function() {
        if(life1.text=="10" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "9";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="9" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "8";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="8" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "7";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="7" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "6";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="6" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "5";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="5" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "4";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="4" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "3";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="3" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "2";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="2" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "1";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="1" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "GAME OVER";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
            clicks ++;
        }
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
        
    });
    bullet.step = ()=>{
        bullet.life++;
        bullet.position.x -= 4;
        if(bullet.life>300 && bullet.physicsImpostor){
            bullet.physicsImpostor.dispose()
            bullet.dispose()                
        }
    }

    scene.onBeforeRenderObservable.add(bullet.step)   

}

animbool
var damage = false;
var fight = false;
var cameradone = true;
var victory = false;
var speed = 0.5;
var done = true;


//VIRTUAL JOYSTICK
var leftJoystick = new BABYLON.VirtualJoystick(true);
var rightJoystick = new BABYLON.VirtualJoystick(false);
BABYLON.VirtualJoystick.Canvas.style.zIndex = "-1"
var stickbool = false;





scene.onBeforeRenderObservable.add(()=>{
    if(leftJoystick.pressed){
        stickbool=true;
        if(!animbool){
            animbool=true;
            dudeanim.restart();
        }
        moveX = leftJoystick.deltaPosition.x * (engine.getDeltaTime()/1000) * 30;
        moveZ = leftJoystick.deltaPosition.y * (engine.getDeltaTime()/1000) * 30;
        body.position.z-=moveX;
        body.position.x+=moveZ;
        player.rotation.y=Math.PI+Math.atan2(leftJoystick.deltaPosition.x,leftJoystick.deltaPosition.y);
        
    }
    else{
        if(stickbool){
            if(animbool){
                for(i=0; i<positionbones.length;i++){
                    skeleton.bones[i].position = positionbones[i];
                    skeleton.bones[i].rotation = rotationbones[i];                  
                }
                player.rotation.y += Math.PI;
                dudeanim.pause();
                animbool = false;
            }
        }

    }

     if(rightJoystick.pressed){
        if(njump == 0){
            dudeanim.pause();
            jump.play();
            body.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 5000, 0), body.getAbsolutePosition());
            njump++;
        }     

    } 
});


scene.registerBeforeRender(function () {
    
    //Collisions

    body.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=false;
        
    });

            
    body.physicsImpostor.registerOnPhysicsCollide(ground3.physicsImpostor, function() {
        if(life1.text=="10" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "9";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="9" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "8";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="8" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "7";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="7" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "6";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="6" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "5";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="5" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "4";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="4" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "3";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="3" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "2";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="2" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "1";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="1" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "GAME OVER";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
            clicks ++;
        }
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });

    
    body.physicsImpostor.registerOnPhysicsCollide(ground4.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
        
    });


    body.physicsImpostor.registerOnPhysicsCollide(boxbar.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });


    body.physicsImpostor.registerOnPhysicsCollide(levelbord.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });

    body.physicsImpostor.registerOnPhysicsCollide(levelbord2.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });

    body.physicsImpostor.registerOnPhysicsCollide(carbox.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });
    body.physicsImpostor.registerOnPhysicsCollide(carbox2.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });
    body.physicsImpostor.registerOnPhysicsCollide(carbox3.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });
    body.physicsImpostor.registerOnPhysicsCollide(carbox4.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });
    body.physicsImpostor.registerOnPhysicsCollide(carbox5.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });
    body.physicsImpostor.registerOnPhysicsCollide(carbox6.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });
    body.physicsImpostor.registerOnPhysicsCollide(carbox7.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });
    body.physicsImpostor.registerOnPhysicsCollide(carbox8.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });
    body.physicsImpostor.registerOnPhysicsCollide(carbox9.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });
    body.physicsImpostor.registerOnPhysicsCollide(barrierlava.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });
    body.physicsImpostor.registerOnPhysicsCollide(barrierlava2.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });
    body.physicsImpostor.registerOnPhysicsCollide(bridge.physicsImpostor, function() {
        njump = 0;
        if(animbool){
            dudeanim.restart();
        }
        animbool=true;
    });

    body.physicsImpostor.registerOnPhysicsCollide(demoler1.physicsImpostor, function() {
        if(life1.text=="10" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "9";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="9" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "8";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="8" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "7";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="7" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "6";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="6" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "5";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="5" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "4";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="4" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "3";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="3" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "2";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="2" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "1";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="1" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "GAME OVER";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
            clicks ++;
        }
    });


    body.physicsImpostor.registerOnPhysicsCollide(demoler2.physicsImpostor, function() {
        if(life1.text=="10" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "9";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="9" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "8";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="8" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "7";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="7" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "6";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="6" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "5";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="5" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "4";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="4" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "3";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="3" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "2";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="2" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "1";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="1" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "GAME OVER";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
            clicks ++;
        }
    });

    body.physicsImpostor.registerOnPhysicsCollide(demoler3.physicsImpostor, function() {
        if(life1.text=="10" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "9";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="9" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "8";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="8" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "7";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="7" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "6";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="6" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "5";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="5" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "4";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="4" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "3";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="3" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "2";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="2" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "1";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="1" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "GAME OVER";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
            clicks ++;
        }
    });

    body.physicsImpostor.registerOnPhysicsCollide(dogbox.physicsImpostor, function() {
        if(life1.text=="10" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "9";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="9" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "8";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="8" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "7";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="7" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "6";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="6" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "5";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="5" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "4";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="4" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "3";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="3" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "2";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="2" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "1";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
        }
        if(life1.text=="1" && damage == false){
            if(!scream.isPlaying){
                scream.play();
            }
            life1.text = "GAME OVER";
            damage = true;
            setTimeout(function(){damage = false}, 1000);
            clicks ++;
        }
    });


    
    

    if(body.position.x > 120 && body.position.x <= 140) hint.text = "Hint: \n Try to jump!";

    if(body.position.x > 150 && body.position.x <= 180) hint.text = "Hint: \n Well done!";



    if(body.position.x > 500 && body.position.x <= 520) dogwalk = true;

    if(dogwalk) {
        if(!dogbark){
            dogsound.play();
            dogbark = true;
        }
        dogbox.translate(BABYLON.Axis.Z, 1.5, BABYLON.Space.LOCAL);
        if(dogbox.position.x < 450){
            dogwalk = false;
            dogbox.dispose();
        } 
    }


    if(body.position.x > 700 && body.position.x <= 720){
        //EXPLOSION
        if(!expbool){
            expsound.play();
            expbool = true;
        }
        
        var explosion = physicsHelper.applyRadialExplosionImpulse(new BABYLON.Vector3(810, 16, 25),
            {
                radius: 25,
                strength: 500,
                falloff: BABYLON.PhysicsRadialImpulseFalloff.Linear, // or BABYLON.PhysicsRadialImpulseFalloff.Constant
            }
        );
        explosion.dispose();
    }







    //FINAL BOSS EVENTS

    if(body.position.x >1300 && body.position.x <= 1350){
        music.stop();
    }
    if(body.position.x >1520 && body.position.x <=1550){
        spot13.setEnabled(false);
        if(done){
            hint.text = "FINAL BOSS WAKE UP";
            done = false;
        }

        shadowGenerator13.removeShadowCaster(player);
        setTimeout(function(){
            spot16.setEnabled(true);
        },2800);
        
        if(cameradone){
            camera.maxZ = 2000;
            camera.radius = 60;
            camera.heightOffset = 10;
            camera.rotationOffset = 180;

            camerabool = true;
            cameradone = false;
        }
        if(!finalmusic.isPlaying){
            finalmusic.play();
        }
        if(walldown){
            var levelbord4 = BABYLON.MeshBuilder.CreateBox("levelbord4",{ height: 50, width: 20, depth: 500 }, scene);
            levelbord4.position = new BABYLON.Vector3(1500, 0, 0);
            levelbord4.visibility = 0;
            levelbord4.physicsImpostor = new BABYLON.PhysicsImpostor(levelbord4, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});
            //wait 5 seconds to move
            setTimeout(function(){
                hint.text = "Dodge the bullets and wait for the boss to explode!";
                fight = true;
                //lv1 fire every second
                var lv1 = setInterval(function(){
                    firebullet();
                },1000);
                //stop after 25 second and goes to lv2
                setTimeout(function(){
                    clearInterval(lv1);
                    batteryMaterial.emissiveColor = new BABYLON.Color3(1,1,0);
                    speed = 1;
                    var lv2 = setInterval(function(){
                        firebullet();
                    },500);
                    //after other 10 sec go to lv3
                    setTimeout(function(){
                        clearInterval(lv2);
                        batteryMaterial.emissiveColor = new BABYLON.Color3(1,0,0);
                        speed = 1.5;
                        var lv3 = setInterval(function(){
                            firebullet();
                        },200);
                        //after lv3 the boss is defeated and you win the game
                        setTimeout(function(){
                            clearInterval(lv3);
                            fight = false;
                            batteryMaterial.emissiveColor = new BABYLON.Color3(0,0,0);
                            setTimeout(function(){

                                leftarm1.parent = null;
                                leftarm1.position = new BABYLON.Vector3(robbody.position.x, robbody.position.y, robbody.position.z + 20);
                                rightarm1.parent = null;
                                rightarm1.position =new BABYLON.Vector3(robbody.position.x, robbody.position.y, robbody.position.z - 20);
                                robhead.parent = null;
                                robhead.position = new BABYLON.Vector3(robbody.position.x, robbody.position.y + 20, robbody.position.z);

                                robbody.physicsImpostor = new BABYLON.PhysicsImpostor(robbody, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1, restitution: 0});
                                robhead.physicsImpostor = new BABYLON.PhysicsImpostor(robhead, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1, restitution: 0});
                                leftarm1.physicsImpostor = new BABYLON.PhysicsImpostor(leftarm1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1, restitution: 0});
                                rightarm1.physicsImpostor = new BABYLON.PhysicsImpostor(rightarm1, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1, restitution: 0});
                                expsound.play();

                                var explosion2 = physicsHelper.applyRadialExplosionImpulse(new BABYLON.Vector3(robbody.position.x, 0, robbody.position.z),
                                {
                                    radius: 40,
                                    strength: 15,
                                    falloff: BABYLON.PhysicsRadialImpulseFalloff.Linear,
                                }
                                );
                                explosion2.dispose();
                            },1500);

                            setTimeout(function(){
                                victory = true;
                            }, 6000);
                        }, 10000);
                    }, 15000);
                }, 15000);
            }, 5000); 

            walldown = false;
        } 
    }


    if(fight){
        leftarm2.rotate(BABYLON.Axis.Z, 0.1, BABYLON.Space.LOCAL);
        finalcube.rotate(BABYLON.Axis.Z, -0.1, BABYLON.Space.LOCAL);

        rightarm2.rotate(BABYLON.Axis.Z, -0.1, BABYLON.Space.LOCAL);
        finalcube2.rotate(BABYLON.Axis.Z, 0.1, BABYLON.Space.LOCAL);

        robhead.rotate(BABYLON.Axis.Y, 0.1, BABYLON.Space.LOCAL);

        if(robbody.position.z > 50) gunbool=false;
        else if(robbody.position.z < -50) gunbool = true;
        if(gunbool){
            leftarm1.position.y+=0.05;
            rightarm1.position.y-=0.05;
            finalcube.position.y+=0.1;
            finalcube2.position.y-=0.1;
            robbody.position.z+=speed;
            wheel.rotation.x += 0.1;
        }
        else{
            leftarm1.position.y-=0.05;
            rightarm1.position.y+=0.05;
            finalcube.position.y-=0.1;
            finalcube2.position.y+=0.1;
            robbody.position.z-=speed;
            wheel.rotation.x -= 0.1;

        }
    }


    //victory condition
    if(victory){
        gover.text = "VICTORY";
        scene1.clearColor = new BABYLON.Color3(0.31, 0.8, 0.31);
        finalmusic.stop();
        victorymusic.play();
        clicks++;
        console.log(clicks);
    }



    //wrecking ball
    if (body.position.x>=220 && body.position.x <= 240){
        hint.text = "Hint: \n Wreking balls are heavy!";
        spot1.setEnabled(false);
        //spot2.setEnabled(false);
        shadowGenerator.removeShadowCaster(player);
        //shadowGenerator2.removeShadowCaster(player);
        //spot3.setEnabled(true);
        spot4.setEnabled(true);
    }

    //dogs
    if (body.position.x>=420 && body.position.x <= 440){
        hint.text = "Hint: \n Dogs are off leash!";

        //spot3.setEnabled(false);
        spot4.setEnabled(false);
        //shadowGenerator3.removeShadowCaster(player);
        shadowGenerator4.removeShadowCaster(player);
        spot5.setEnabled(true);
        //spot6.setEnabled(true);
    } 

    //explosion
    if (body.position.x>=620 && body.position.x <= 640){
        hint.text = "WARNING: \n Something can make boom!";
        advancedTexture.addControl(label3);
        label3.linkWithMesh(wall);
        //advancedTexture.removeControl(label3);

        spot5.setEnabled(false);
        //spot6.setEnabled(false);
        shadowGenerator5.removeShadowCaster(player);
        //shadowGenerator6.removeShadowCaster(player);
        //spot7.setEnabled(true);
        spot8.setEnabled(true);
    }
    //lava 
    if(body.position.x >= 820 && body.position.x <= 840){
        hint.text = "Hint: \n Lava is hot \n Cars are not";
        //spot7.setEnabled(false);
        spot8.setEnabled(false);
        //shadowGenerator7.removeShadowCaster(player);
        shadowGenerator8.removeShadowCaster(player);
        spot9.setEnabled(true);
        //spot10.setEnabled(true);
    }
    if(body.position.x >= 1020 && body.position.x <= 1040){

        spot9.setEnabled(false);
        //spot10.setEnabled(false);
        shadowGenerator9.removeShadowCaster(player);
        //shadowGenerator10.removeShadowCaster(player);
        spot12.setEnabled(true);
    }
    if(body.position.x >= 1220 && body.position.x <= 1240){
        hint.text = "FINAL BOSS IS SLEEPING";
        spot12.setEnabled(false);
        shadowGenerator12.removeShadowCaster(player);
        spot13.setEnabled(true);
    }


    if ((map["w"] || map["W"])) {
        
        body.translate(BABYLON.Axis.X, 0.6, BABYLON.Space.WORLD);
        if(!walkup && !walkright && !walkdown && !walkleft){
            walkup = true;
        }
        /* if(walkup){
            if (countwalk>10){
                lefthand = false;
            }
            else if(countwalk < -10){
                lefthand= true;
            }
            if(lefthand){
                //arms
                skeleton.bones[32].rotate(BABYLON.Axis.X, 0.075, BABYLON.Space.LOCAL);
                skeleton.bones[13].rotate(BABYLON.Axis.X, 0.075, BABYLON.Space.LOCAL);
        
                skeleton.bones[50].translate(new BABYLON.Vector3(0, 0.5, 0));
                skeleton.bones[54].translate(new BABYLON.Vector3(0, -0.5, 0));
        
        
                skeleton.bones[51].rotate(BABYLON.Axis.Z, -0.04, BABYLON.Space.LOCAL);
                skeleton.bones[55].rotate(BABYLON.Axis.Z, 0.04, BABYLON.Space.LOCAL);
                skeleton.bones[51].translate(new BABYLON.Vector3(0, 0.5, 0));
                skeleton.bones[55].translate(new BABYLON.Vector3(0, -0.5, 0));
        
        
                countwalk = countwalk +1;
            }
            else{
                //arms
                skeleton.bones[32].rotate(BABYLON.Axis.X, -0.075, BABYLON.Space.LOCAL);
                skeleton.bones[13].rotate(BABYLON.Axis.X, -0.075, BABYLON.Space.LOCAL);
        
                skeleton.bones[50].translate(new BABYLON.Vector3(0, -0.5, 0));
                skeleton.bones[54].translate(new BABYLON.Vector3(0, 0.5, 0));
        
                skeleton.bones[51].rotate(BABYLON.Axis.Z, 0.04, BABYLON.Space.LOCAL);
                skeleton.bones[55].rotate(BABYLON.Axis.Z, -0.04, BABYLON.Space.LOCAL);
                skeleton.bones[51].translate(new BABYLON.Vector3(0, -0.5, 0));
                skeleton.bones[55].translate(new BABYLON.Vector3(0, 0.5, 0));
        
        
                countwalk = countwalk-1;
            } 
            
        } */
    
    
    };

    if ((map["s"] || map["S"])) {
        body.translate(BABYLON.Axis.X, -0.6, BABYLON.Space.WORLD);
        if(!walkup && !walkright && !walkdown && !walkleft){
            walkdown = true;
        }
        /* if(walkdown){
            if (countwalk>10){
                lefthand = false;
            }
            else if(countwalk < -10){
                lefthand= true;
            }
            if(lefthand){
                //arms
                skeleton.bones[32].rotate(BABYLON.Axis.X, 0.075, BABYLON.Space.LOCAL);
                skeleton.bones[13].rotate(BABYLON.Axis.X, 0.075, BABYLON.Space.LOCAL);
        
                skeleton.bones[50].translate(new BABYLON.Vector3(0, 0.5, 0));
                skeleton.bones[54].translate(new BABYLON.Vector3(0, -0.5, 0));
        
        
                skeleton.bones[51].rotate(BABYLON.Axis.Z, -0.04, BABYLON.Space.LOCAL);
                skeleton.bones[55].rotate(BABYLON.Axis.Z, 0.04, BABYLON.Space.LOCAL);
                skeleton.bones[51].translate(new BABYLON.Vector3(0, 0.5, 0));
                skeleton.bones[55].translate(new BABYLON.Vector3(0, -0.5, 0));
        
        
                countwalk = countwalk +1;
            }
            else{
                //arms
                skeleton.bones[32].rotate(BABYLON.Axis.X, -0.075, BABYLON.Space.LOCAL);
                skeleton.bones[13].rotate(BABYLON.Axis.X, -0.075, BABYLON.Space.LOCAL);
        
                skeleton.bones[50].translate(new BABYLON.Vector3(0, -0.5, 0));
                skeleton.bones[54].translate(new BABYLON.Vector3(0, 0.5, 0));
        
                skeleton.bones[51].rotate(BABYLON.Axis.Z, 0.04, BABYLON.Space.LOCAL);
                skeleton.bones[55].rotate(BABYLON.Axis.Z, -0.04, BABYLON.Space.LOCAL);
                skeleton.bones[51].translate(new BABYLON.Vector3(0, -0.5, 0));
                skeleton.bones[55].translate(new BABYLON.Vector3(0, 0.5, 0));
        
        
                countwalk = countwalk-1;
            }
            
        } */
    };

    if ((map["d"] || map["D"])) {
        body.translate(BABYLON.Axis.Z, -0.6, BABYLON.Space.WORLD);
        if(!walkup && !walkright && !walkdown && !walkleft){
            walkright = true;
        }
        /* if(walkright){
            if (countwalk>10){
                lefthand = false;
            }
            else if(countwalk < -10){
                lefthand= true;
            }
            if(lefthand){
                //arms
                skeleton.bones[32].rotate(BABYLON.Axis.X, 0.075, BABYLON.Space.LOCAL);
                skeleton.bones[13].rotate(BABYLON.Axis.X, 0.075, BABYLON.Space.LOCAL);
        
                skeleton.bones[50].translate(new BABYLON.Vector3(0, 0.5, 0));
                skeleton.bones[54].translate(new BABYLON.Vector3(0, -0.5, 0));
        
        
                skeleton.bones[51].rotate(BABYLON.Axis.Z, -0.04, BABYLON.Space.LOCAL);
                skeleton.bones[55].rotate(BABYLON.Axis.Z, 0.04, BABYLON.Space.LOCAL);
                skeleton.bones[51].translate(new BABYLON.Vector3(0, 0.5, 0));
                skeleton.bones[55].translate(new BABYLON.Vector3(0, -0.5, 0));
        
        
                countwalk = countwalk +1;
            }
            else{
                //arms
                skeleton.bones[32].rotate(BABYLON.Axis.X, -0.075, BABYLON.Space.LOCAL);
                skeleton.bones[13].rotate(BABYLON.Axis.X, -0.075, BABYLON.Space.LOCAL);
        
                skeleton.bones[50].translate(new BABYLON.Vector3(0, -0.5, 0));
                skeleton.bones[54].translate(new BABYLON.Vector3(0, 0.5, 0));
        
                skeleton.bones[51].rotate(BABYLON.Axis.Z, 0.04, BABYLON.Space.LOCAL);
                skeleton.bones[55].rotate(BABYLON.Axis.Z, -0.04, BABYLON.Space.LOCAL);
                skeleton.bones[51].translate(new BABYLON.Vector3(0, -0.5, 0));
                skeleton.bones[55].translate(new BABYLON.Vector3(0, 0.5, 0));
        
        
                countwalk = countwalk-1;
            }
            
        } */
    };

    if ((map["a"] || map["A"])) {
        body.translate(BABYLON.Axis.Z, 0.6, BABYLON.Space.WORLD);
        if(!walkup && !walkright && !walkdown && !walkleft){
            walkleft = true;
        }
        /* if(walkleft){
            if (countwalk>10){
                lefthand = false;
            }
            else if(countwalk < -10){
                lefthand= true;
            }
            if(lefthand){
                //arms
                skeleton.bones[32].rotate(BABYLON.Axis.X, 0.075, BABYLON.Space.LOCAL);
                skeleton.bones[13].rotate(BABYLON.Axis.X, 0.075, BABYLON.Space.LOCAL);
        
                skeleton.bones[50].translate(new BABYLON.Vector3(0, 0.5, 0));
                skeleton.bones[54].translate(new BABYLON.Vector3(0, -0.5, 0));
        
        
                skeleton.bones[51].rotate(BABYLON.Axis.Z, -0.04, BABYLON.Space.LOCAL);
                skeleton.bones[55].rotate(BABYLON.Axis.Z, 0.04, BABYLON.Space.LOCAL);
                skeleton.bones[51].translate(new BABYLON.Vector3(0, 0.5, 0));
                skeleton.bones[55].translate(new BABYLON.Vector3(0, -0.5, 0));
        
        
                countwalk = countwalk +1;
            }
            else{
                //arms
                skeleton.bones[32].rotate(BABYLON.Axis.X, -0.075, BABYLON.Space.LOCAL);
                skeleton.bones[13].rotate(BABYLON.Axis.X, -0.075, BABYLON.Space.LOCAL);
        
                skeleton.bones[50].translate(new BABYLON.Vector3(0, -0.5, 0));
                skeleton.bones[54].translate(new BABYLON.Vector3(0, 0.5, 0));
        
                skeleton.bones[51].rotate(BABYLON.Axis.Z, 0.04, BABYLON.Space.LOCAL);
                skeleton.bones[55].rotate(BABYLON.Axis.Z, -0.04, BABYLON.Space.LOCAL);
                skeleton.bones[51].translate(new BABYLON.Vector3(0, -0.5, 0));
                skeleton.bones[55].translate(new BABYLON.Vector3(0, 0.5, 0));
        
        
                countwalk = countwalk-1;
            }
            
        } */
    };

});


//music
var music = new BABYLON.Sound("vg", "./sounds/vg.mp3", scene, null, { volume: 0.4, loop: true, autoplay: true });
var jump = new BABYLON.Sound("jump", "sounds/jump.wav", scene, null, {volume: 1});
var dogsound = new BABYLON.Sound("dogsound", "./sounds/dog.wav", scene, null, {volume: 0.7});
var expsound = new BABYLON.Sound("expsound", "./sounds/explosion.mp3", scene , null, {volume: 0.7});
var scream = new BABYLON.Sound("screamsound", "./sounds/scream.mp3",scene, null, {volume: 0.3});
var finalmusic = new BABYLON.Sound("bg", "./sounds/finalboss.mp3", scene, null, { volume: 0.4, loop: true});
var shot = new BABYLON.Sound("shotsound", "./sounds/shot.mp3",scene, null, {volume: 0.1});
var victorymusic = new BABYLON.Sound("vicmusic", "./sounds/victory.mp3",scene, null, {volume: 0.3});



//Camera
var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-40, 10, 0), scene);
camera.radius = 70;
camera.heightOffset = 70;
camera.rotationOffset = 180;
camera.cameraAcceleration = 0.1;
camera.maxCameraSpeed = 100;
camera.lowerRadiusLimit = 40;
camera.upperRadiusLimit = 90;
camera.lowerHeightOffsetLimit = 0;
camera.upperHeightOffsetLimit = 80;
camera.lowerRotationOffsetLimit = 100;
camera.upperRotationOffsetLimit = 240;
//camera.minZ = 0;
camera.maxZ = 350;
camera.attachControl(canvas, true);

        
// Skybox
var skybox = BABYLON.Mesh.CreateBox("skyBox", 4000.0, scene);
var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./textures/skyboxall/skybox", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.freeze();
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.disableLighting = true;
skybox.material = skyboxMaterial;




// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
var ground = BABYLON.Mesh.CreateGround("ground1", 1600, 500, 2, scene);
ground.receiveShadows = true;
ground.position.y = 0;
ground.position.x = 600;
ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0}, scene);
groundb = true;

// Create and tweak the background material.
var backgroundMaterial = new BABYLON.StandardMaterial("gmat", scene);
backgroundMaterial.diffuseTexture = new BABYLON.Texture("./textures/street.jpg", scene);
backgroundMaterial.diffuseTexture.uScale = 65.0;
backgroundMaterial.diffuseTexture.vScale = 25.0;
backgroundMaterial.shadowLevel = 0.4;
ground.material = backgroundMaterial;
backgroundMaterial.maxSimultaneousLights = 20;


var barMaterial = new BABYLON.StandardMaterial("barMaterial", scene);
barMaterial.diffuseTexture = new BABYLON.Texture("./textures/rockwall.jpg", scene);
barMaterial.diffuseTexture.uScale = 1.0;
barMaterial.diffuseTexture.vScale = 10.0;
barMaterial.freeze();
var barrierlava = BABYLON.MeshBuilder.CreateBox("barrierlava",{ height: 15, width: 8, depth: 200}, scene);
barrierlava.receiveShadows = true;
barrierlava.physicsImpostor = new BABYLON.PhysicsImpostor(barrierlava, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0}, scene);
barrierlava.position.x = 880;
barrierlava.position.y = 3;
barrierlava.material = barMaterial;

var barrierlava2 = BABYLON.MeshBuilder.CreateBox("barrierlava",{ height: 15, width: 8, depth: 400}, scene);
barrierlava2.receiveShadows = true;
barrierlava2.physicsImpostor = new BABYLON.PhysicsImpostor(barrierlava2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0}, scene);
barrierlava2.position.x = 1320;
barrierlava2.position.y = 3;
barrierlava2.material = barMaterial;


var ground3 = BABYLON.Mesh.CreateGround("ground3", 440, 440, 100, scene);
ground3.receiveShadows = true;
ground3.position.y = 5;
ground3.position.x = 1100;
ground3.physicsImpostor = new BABYLON.PhysicsImpostor(ground3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0}, scene);
groundb3 = true;

var lavaMaterial = new BABYLON.LavaMaterial("lava", scene);	
lavaMaterial.noiseTexture = new BABYLON.Texture("./textures/cloud.png", scene); // Set the bump texture
lavaMaterial.diffuseTexture = new BABYLON.Texture("./textures/lavatile.jpg", scene); // Set the diffuse texture
lavaMaterial.speed = 0.5;
lavaMaterial.fogColor = new BABYLON.Color3(1, 0, 0);
lavaMaterial.unlit = true;

ground3.material = lavaMaterial;

var ground4 = BABYLON.Mesh.CreateGround("ground4", 500, 500, 2, scene);
ground4.receiveShadows = true;
ground4.position.y = 0;
ground4.position.x = 1650;
ground4.physicsImpostor = new BABYLON.PhysicsImpostor(ground4, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0}, scene);


// Create and tweak the background material.
var backgroundMaterial4 = new BABYLON.StandardMaterial("gmat", scene);
backgroundMaterial4.diffuseTexture = new BABYLON.Texture("./textures/grass.jpg", scene);
backgroundMaterial4.diffuseTexture.uScale = 20.0;
backgroundMaterial4.diffuseTexture.vScale = 20.0;
backgroundMaterial4.shadowLevel = 0.4;
ground4.material = backgroundMaterial4;
backgroundMaterial4.maxSimultaneousLights = 20;

//lamps

BABYLON.SceneLoader.ImportMesh("", "./models/lamp/", "lamp.obj", scene, function (Mesh) {
    lamp = Mesh[0];
    lamp.scaling = new BABYLON.Vector3(6, 6, 6);
    lamp.rotate(BABYLON.Axis.Y, 45*Math.PI/2, BABYLON.Space.LOCAL);
    lamp.position = new BABYLON.Vector3(50, 0, 26);
    
    for(i=0; i < 7; i++){
        var lamp2 = lamp.createInstance("");
        lamp2.position.x = lamp.position.x + (i*200);
    }
    for(i=0; i < 7; i++){
        var lamp3 = lamp.createInstance("");
        lamp3.position.x = lamp.position.x + (i*200);
        lamp3.position.z = -26;
        lamp3.rotate(BABYLON.Axis.Y, 90*Math.PI/2, BABYLON.Space.LOCAL);
    }

});

var sunMaterial = new BABYLON.StandardMaterial("sun", scene);
sunMaterial.emissiveColor = new BABYLON.Color3(1,1,0);
var brokenMaterial = new BABYLON.StandardMaterial("sunbroken", scene);
brokenMaterial.emissiveColor = new BABYLON.Color3(0.19, 0.1, 0.45);

var spot1 = new BABYLON.PointLight("spot1", new BABYLON.Vector3(50, 52.5, 16), scene);
spot1.diffuse = new BABYLON.Color3(1, 1, 1);
spot1.specular = new BABYLON.Color3(0, 0, 0);
spot1.shadowOrthoScale = 2.0;
spot1.intensity = 1;
spot1.shadowMinZ = 0;
spot1.shadowMaxZ = 500;
spot1.range = 400;

var sun1 = BABYLON.Mesh.CreateSphere("sun1", 10, 2, scene);
sun1.material = sunMaterial;
sun1.position = new BABYLON.Vector3(50, 52.5, 16);

var sun2 = BABYLON.Mesh.CreateSphere("sun2", 10, 2, scene);
sun2.material = brokenMaterial;
sun2.position = new BABYLON.Vector3(50, 52.5, -16);
for(i = 1; i < 7; i++){
        var sun3 = sun1.createInstance("");
        sun3.position.x = sun1.position.x + 200*i;
        var sun4 = sun2.createInstance("");
        sun4.position.x = sun2.position.x + 200*i;
        if(i%2==0){
            sun3.position.z = sun1.position.z;
            sun4.position.z = sun2.position.z;
        }
        else{
            sun3.position.z = -sun1.position.z;
            sun4.position.z = -sun2.position.z;
        }
}


/*
var spot2 = new BABYLON.PointLight("spot2", new BABYLON.Vector3(50, 52.5, -16), scene);
spot2.diffuse = new BABYLON.Color3(1, 1, 1);
spot2.specular = new BABYLON.Color3(0, 0, 0);
spot2.shadowOrthoScale = 2.0;
spot2.intensity = 1;
spot2.shadowMinZ = 0;
spot2.shadowMaxZ = 500;
spot2.range = 250;
spot2.setEnabled(false);

var spot3 = new BABYLON.PointLight("spot3", new BABYLON.Vector3(250, 52.5, 16), scene);
spot3.diffuse = new BABYLON.Color3(1, 1, 1);
spot3.specular = new BABYLON.Color3(0, 0, 0);
spot3.shadowOrthoScale = 2.0;
spot3.intensity = 1;
spot3.shadowMinZ = 0;
spot3.shadowMaxZ = 500;
spot3.range = 250;
spot3.setEnabled(false);
*/


var spot4 = new BABYLON.PointLight("spot4", new BABYLON.Vector3(250, 52.5, -16), scene);
spot4.diffuse = new BABYLON.Color3(1, 1, 1);
spot4.specular = new BABYLON.Color3(0, 0, 0);
spot4.shadowOrthoScale = 2.0;
spot4.intensity = 1;
spot4.shadowMinZ = 0;
spot4.shadowMaxZ = 500;
spot4.range = 400;
spot4.setEnabled(false);


var spot5 = new BABYLON.PointLight("spot5", new BABYLON.Vector3(450, 52.5, 16), scene);
spot5.diffuse = new BABYLON.Color3(1, 1, 1);
spot5.specular = new BABYLON.Color3(0, 0, 0);
spot5.shadowOrthoScale = 2.0;
spot5.intensity = 1;
spot5.shadowMinZ = 0;
spot5.shadowMaxZ = 500;
spot5.range = 400;
spot5.setEnabled(false);

/*
var spot6 = new BABYLON.PointLight("spot6", new BABYLON.Vector3(450, 52.5, -16), scene);
spot6.diffuse = new BABYLON.Color3(1, 1, 1);
spot6.specular = new BABYLON.Color3(0, 0, 0);
spot6.shadowOrthoScale = 2.0;
spot6.intensity = 1;
spot6.shadowMinZ = 0;
spot6.shadowMaxZ = 500;
spot6.range = 250;
spot6.setEnabled(false);


var spot7 = new BABYLON.PointLight("spot7", new BABYLON.Vector3(650, 52.5, 16), scene);
spot7.diffuse = new BABYLON.Color3(1, 1, 1);
spot7.specular = new BABYLON.Color3(0, 0, 0);
spot7.shadowOrthoScale = 2.0;
spot7.intensity = 1;
spot7.shadowMinZ = 0;
spot7.shadowMaxZ = 500;
spot7.range = 250;
spot7.setEnabled(false);
*/

var spot8 = new BABYLON.PointLight("spot8", new BABYLON.Vector3(650, 52.5, -16), scene);
spot8.diffuse = new BABYLON.Color3(1, 1, 1);
spot8.specular = new BABYLON.Color3(0, 0, 0);
spot8.shadowOrthoScale = 2.0;
spot8.intensity = 1;
spot8.shadowMinZ = 0;
spot8.shadowMaxZ = 500;
spot8.range = 400;
spot8.setEnabled(false);


var spot9 = new BABYLON.PointLight("spot9", new BABYLON.Vector3(850, 52.5, 16), scene);
spot9.diffuse = new BABYLON.Color3(1, 1, 1);
spot9.specular = new BABYLON.Color3(0, 0, 0);
spot9.shadowOrthoScale = 2.0;
spot9.intensity = 1;
spot9.shadowMinZ = 0;
spot9.shadowMaxZ = 500;
spot9.range = 400;
spot9.setEnabled(false);
/*
var spot10 = new BABYLON.PointLight("spot10", new BABYLON.Vector3(850, 52.5, -16), scene);
spot10.diffuse = new BABYLON.Color3(1, 1, 1);
spot10.specular = new BABYLON.Color3(0, 0, 0);
spot10.shadowOrthoScale = 2.0;
spot10.intensity = 1;
spot10.shadowMinZ = 0;
spot10.shadowMaxZ = 500;
spot10.range = 250;
spot10.setEnabled(false);

var spot11 = new BABYLON.PointLight("spot11", new BABYLON.Vector3(1050, 52.5, 16), scene);
spot11.diffuse = new BABYLON.Color3(1, 1, 1);
spot11.specular = new BABYLON.Color3(0, 0, 0);
spot11.shadowOrthoScale = 2.0;
spot11.intensity = 1;
spot11.shadowMinZ = 0;
spot11.shadowMaxZ = 500;
spot11.range = 250;
spot11.setEnabled(false);
*/

var spot12 = new BABYLON.PointLight("spot12", new BABYLON.Vector3(1050, 52.5, -16), scene);
spot12.diffuse = new BABYLON.Color3(1, 1, 1);
spot12.specular = new BABYLON.Color3(0, 0, 0);
spot12.shadowOrthoScale = 2.0;
spot12.intensity = 1;
spot12.shadowMinZ = 0;
spot12.shadowMaxZ = 500;
spot12.range = 400;
spot12.setEnabled(false);

var spot13 = new BABYLON.PointLight("spot13", new BABYLON.Vector3(1250, 52.5, 16), scene);
spot13.diffuse = new BABYLON.Color3(1, 1, 1);
spot13.specular = new BABYLON.Color3(0, 0, 0);
spot13.shadowOrthoScale = 2.0;
spot13.intensity = 1;
spot13.shadowMinZ = 0;
spot13.shadowMaxZ = 500;
spot13.range = 400;
spot13.setEnabled(false);

var spot16 = new BABYLON.PointLight("spot16", new BABYLON.Vector3(1450, 52.5, -16), scene);
spot16.diffuse = new BABYLON.Color3(1, 1, 1);
spot16.specular = new BABYLON.Color3(0, 0, 0);
spot16.shadowOrthoScale = 2.0;
spot16.intensity = 1;
spot16.shadowMinZ = 0;
spot16.shadowMaxZ = 500;
spot16.range = 400;
spot16.setEnabled(false);







//shadow
var shadowGenerator = new BABYLON.ShadowGenerator(1024, spot1);
shadowGenerator.useBlurExponentialShadowMap = true;

//var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, spot2);
//shadowGenerator2.useBlurExponentialShadowMap = true;

//var shadowGenerator3 = new BABYLON.ShadowGenerator(1024, spot3);
//shadowGenerator3.useBlurExponentialShadowMap = true;

var shadowGenerator4 = new BABYLON.ShadowGenerator(1024, spot4);
shadowGenerator4.useBlurExponentialShadowMap = true;

var shadowGenerator5 = new BABYLON.ShadowGenerator(1024, spot5);
shadowGenerator5.useBlurExponentialShadowMap = true;

//var shadowGenerator6 = new BABYLON.ShadowGenerator(1024, spot6);
//shadowGenerator6.useBlurExponentialShadowMap = true;

//var shadowGenerator7 = new BABYLON.ShadowGenerator(1024, spot7);
//shadowGenerator7.useBlurExponentialShadowMap = true;

var shadowGenerator8 = new BABYLON.ShadowGenerator(1024, spot8);
shadowGenerator8.useBlurExponentialShadowMap = true;

var shadowGenerator9 = new BABYLON.ShadowGenerator(1024, spot9);
shadowGenerator9.useBlurExponentialShadowMap = true;

//var shadowGenerator10 = new BABYLON.ShadowGenerator(1024, spot10);
//shadowGenerator10.useBlurExponentialShadowMap = true;

var shadowGenerator12 = new BABYLON.ShadowGenerator(1024, spot12);
shadowGenerator12.useBlurExponentialShadowMap = true;

var shadowGenerator13 = new BABYLON.ShadowGenerator(1024, spot13);
shadowGenerator13.useBlurExponentialShadowMap = true;

var shadowGenerator16 = new BABYLON.ShadowGenerator(1024, spot16);
shadowGenerator16.useBlurExponentialShadowMap = true;




//houses

var mat1 = new BABYLON.StandardMaterial('mat1', scene);
mat1.diffuseTexture = new BABYLON.Texture("./textures/graf.jpg", scene);
//mat1.freeze();
var mat2 = new BABYLON.StandardMaterial('mat2', scene);
mat2.diffuseTexture = new BABYLON.Texture("./textures/graf2.jpg", scene);
//mat2.freeze();


BABYLON.SceneLoader.ImportMesh("","./models/mansion/", "mansion.obj", scene, function (meshes) {

    var mansion = BABYLON.Mesh.MergeMeshes(meshes);
    mansion.material = mat1;
    mansion.scaling = new BABYLON.Vector3(1, 1, 1);
    mansion.translate(BABYLON.Axis.X, 0, BABYLON.Space.WORLD);
    mansion.translate(BABYLON.Axis.Z, -100, BABYLON.Space.WORLD);
    for(i=1; i < 7; i++){
        if(i%2==0){
            var mansion2;
            mansion2 = mansion.createInstance("");
            mansion2.position.x = mansion.position.x + (i*210);
            
        }
        else{
            var mansion2;
            mansion2 = mansion.createInstance("");
            mansion2.position.x = mansion.position.x + (i*210);
            mansion2.position.z = - mansion.position.z;
        }

    }
});



BABYLON.SceneLoader.ImportMesh("","./models/apartment/", "b1.obj", scene, function (meshes) {
    var apartment = BABYLON.Mesh.MergeMeshes(meshes);
    apartment.material = mat2;
    apartment.scaling = new BABYLON.Vector3(20, 20, 20);
    apartment.rotate(BABYLON.Axis.Y, 2*Math.PI/2, BABYLON.Space.LOCAL);
    apartment.translate(BABYLON.Axis.X, 0, BABYLON.Space.WORLD);
    apartment.translate(BABYLON.Axis.Z, 150, BABYLON.Space.WORLD);

    for(i=1; i < 7; i++){
        if(i%2==0){
            var apartment2;
            apartment2 = apartment.createInstance("");
            apartment2.position.x = apartment.position.x + (i*210);
            
        }
        else{
            var apartment2;
            apartment2 = apartment.createInstance("");
            apartment2.position.x = apartment.position.x + (i*210);
            apartment2.position.z = - apartment.position.z + 50;
        }

    }

});

var tree = BABYLON.SceneLoader.ImportMesh("","./models/trees/", "Tree.babylon", scene, function (meshes) {
    var tree = meshes[0];
    tree.scaling = new BABYLON.Vector3(200, 200, 200);
    tree.position = new BABYLON.Vector3(0, 0, 0);
    tree.material.opacityTexture = null;
    tree.material.backFaceCulling = false;

    for(i=0; i < 10; i++){
        for(j = 0; j <= 4; j++){
            if(j%2==0){
                var tree2 = tree.createInstance("");
                tree2.position.x = 1400 + (i*50);
                tree2.position.z = 60 + (j*25);
                var tree3 = tree.createInstance("");
                tree3.position.x = 1400 + (i*50);
                tree3.position.z = -60 - (j*25);
            }
            else{
                var tree2 = tree.createInstance("");
                tree2.position.x = 1425 + (i*50);
                tree2.position.z = 60 + (j*25);
                var tree3 = tree.createInstance("");
                tree3.position.x = 1425 + (i*50);
                tree3.position.z = -60 - (j*25);
            }
        }

    }
    for(i=0; i < 2; i++){
        for(j = 1; j <= 5; j++){
            if(i%2==0){
                var tree2 = tree.createInstance("");
                tree2.position.x = 1800 + (i*50);
                tree2.position.z = 60 - (j*25);
            }
            else{
                var tree2 = tree.createInstance("");
                tree2.position.x = 1825 + (i*50);
                tree2.position.z = 60 - (j*25);
            }
        }

    }
    tree.isVisible = false;
});

















//Level
var levelbord = BABYLON.MeshBuilder.CreateBox("lvbord",{ height: 80, width: 1600, depth: 10 }, scene);
levelbord.position = new BABYLON.Vector3(500, 25, -40);
levelbord.visibility = 0;
levelbord.physicsImpostor = new BABYLON.PhysicsImpostor(levelbord, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});


var levelbord2 = BABYLON.MeshBuilder.CreateBox("lvbord2",{ height: 80, width: 1600, depth: 10 }, scene);
levelbord2.position = new BABYLON.Vector3(500, 25, 40);
levelbord2.visibility = 0;
levelbord2.physicsImpostor = new BABYLON.PhysicsImpostor(levelbord2, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});

var levelbord6 = BABYLON.MeshBuilder.CreateBox("lvbord6",{ height: 80, width: 1000, depth: 10 }, scene);
levelbord6.position = new BABYLON.Vector3(1700, 25, 60);
levelbord6.visibility = 0;
levelbord6.physicsImpostor = new BABYLON.PhysicsImpostor(levelbord6, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});

var levelbord7 = BABYLON.MeshBuilder.CreateBox("lvbord7",{ height: 80, width: 1000, depth: 10 }, scene);
levelbord7.position = new BABYLON.Vector3(1700, 25, -60);
levelbord7.visibility = 0;
levelbord7.physicsImpostor = new BABYLON.PhysicsImpostor(levelbord7, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});


var levelbord3 = BABYLON.MeshBuilder.CreateBox("lvbord2",{ height: 80, width: 10, depth: 100 }, scene);
levelbord3.position = new BABYLON.Vector3(-50, 15, 0);
levelbord3.visibility = 0;
levelbord3.physicsImpostor = new BABYLON.PhysicsImpostor(levelbord3, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});



var boxbar = BABYLON.MeshBuilder.CreateBox("boxbar",{ height: 8, width: 75, depth: 10 }, scene);
boxbar.visibility = 0;

var bar;
BABYLON.SceneLoader.ImportMesh("","./models/road/", "bar3.obj", scene, function (meshes) {
    bar = meshes[0];
    bar.scaling = new BABYLON.Vector3(12, 10, 10);
    boxbar.position.y = 5;
    boxbar.physicsImpostor = new BABYLON.PhysicsImpostor(boxbar, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});
    boxbarb = true;
    bar.parent = boxbar;
    bar.position.y = -5;
    boxbar.physicsImpostor.physicsBody.inertia.setZero();
    boxbar.physicsImpostor.physicsBody.invInertia.setZero();
    boxbar.physicsImpostor.physicsBody.invInertiaWorld.setZero();
    boxbar.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.LOCAL);
    boxbar.position.x = 150;

    label.linkWithMesh(boxbar);
});

BABYLON.SceneLoader.ImportMesh("","./models/road/", "bar2.obj", scene, function (meshes) {
    var bar = meshes[0];
    bar.scaling = new BABYLON.Vector3(10, 10, 10);
    bar.position.x = 150;
    bar.position.z = 25;
    bar.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.LOCAL);
});
BABYLON.SceneLoader.ImportMesh("","./models/road/", "bar3.obj", scene, function (meshes) {
    var bar = meshes[0];
    bar.scaling = new BABYLON.Vector3(10, 10, 10);
    bar.position.x = 150;
    bar.position.z = -25;
    bar.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.LOCAL);
});


var wall = BABYLON.MeshBuilder.CreateBox("wall",{ height: 16, width: 30, depth: 5}, scene);
wall.position = new BABYLON.Vector3(720,8,-22);
wall.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.LOCAL);
var wallMaterial = new BABYLON.StandardMaterial("wallmat", scene);
wallMaterial.diffuseTexture = new BABYLON.Texture("./textures/floor.png", scene);
wallMaterial.freeze();
wall.material = wallMaterial;
wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});


var demMaterial = new BABYLON.StandardMaterial("demmat", scene);
demMaterial.diffuseTexture = new BABYLON.Texture("./textures/steel.jpg", scene);
var demoler1 = BABYLON.Mesh.CreateSphere("s1", 32, 10, scene);
demoler1.position = new BABYLON.Vector3(300,10,0);
demoler1.material = demMaterial;
demoler1.physicsImpostor = new BABYLON.PhysicsImpostor(demoler1, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 1000, restitution: 0});
var demoler2 = BABYLON.Mesh.CreateSphere("s2", 32, 10, scene);
demoler2.position = new BABYLON.Vector3(350,10,0);
demoler2.material = demMaterial;
demoler2.physicsImpostor = new BABYLON.PhysicsImpostor(demoler2, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 1000, restitution: 0});
var demoler3 = BABYLON.Mesh.CreateSphere("s3", 32, 10, scene);
demoler3.position = new BABYLON.Vector3(400,10,0);
demoler3.material = demMaterial;
demoler3.physicsImpostor = new BABYLON.PhysicsImpostor(demoler3, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 1000, restitution: 0});

var pointup1 = BABYLON.Mesh.CreateSphere("pup1", 32, 2, scene);
pointup1.position = new BABYLON.Vector3(300,50,0);
pointup1.visibility = 0;
pointup1.physicsImpostor = new BABYLON.PhysicsImpostor(pointup1, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 0, restitution: 0});
var distanceJoint = new BABYLON.DistanceJoint({ maxDistance: 40 });
demoler1.physicsImpostor.addJoint(pointup1.physicsImpostor, distanceJoint);
demoler1.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, 50000), demoler1.getAbsolutePosition());

var pointup2 = BABYLON.Mesh.CreateSphere("pup2", 32, 2, scene);
pointup2.position = new BABYLON.Vector3(350,50,0);
pointup2.visibility = 0;
pointup2.physicsImpostor = new BABYLON.PhysicsImpostor(pointup2, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 0, restitution: 0});
var distanceJoint2 = new BABYLON.DistanceJoint({ maxDistance: 40 });
demoler2.physicsImpostor.addJoint(pointup2.physicsImpostor, distanceJoint2);
demoler2.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, -50000), demoler2.getAbsolutePosition());

var pointup3 = BABYLON.Mesh.CreateSphere("pup3", 32, 2, scene);
pointup3.position = new BABYLON.Vector3(400,50,0);
pointup3.visibility = 0;
pointup3.physicsImpostor = new BABYLON.PhysicsImpostor(pointup3, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 0, restitution: 0});
var distanceJoint3 = new BABYLON.DistanceJoint({ maxDistance: 40 });
demoler3.physicsImpostor.addJoint(pointup3.physicsImpostor, distanceJoint3);
demoler3.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, 50000), demoler3.getAbsolutePosition());


var line1 = BABYLON.Mesh.CreateLines("line1",[pointup1.position, demoler1.position],scene,true);
line1.color = "black";
var line2 = BABYLON.Mesh.CreateLines("line2",[pointup2.position, demoler2.position],scene,true);
line2.color = "black";
var line3 = BABYLON.Mesh.CreateLines("line3",[pointup3.position, demoler3.position],scene,true);
line3.color = "black";
scene.registerAfterRender(function() {
    line1 = BABYLON.Mesh.CreateLines("line1", [pointup1.position, demoler1.position], null, null, line1);
    line2 = BABYLON.Mesh.CreateLines("line2", [pointup2.position, demoler2.position], null, null, line2);
    line3 = BABYLON.Mesh.CreateLines("line3", [pointup3.position, demoler3.position], null, null, line3);
});

BABYLON.SceneLoader.ImportMesh("","./models/dogsign/", "objSign.obj", scene, function (meshes) {
    for(index = 0; index < meshes.length; index++){
        meshes[index].scaling = new BABYLON.Vector3(2, 2, 2);
        meshes[index].rotate(BABYLON.Axis.Y, 3*Math.PI/2, BABYLON.Space.LOCAL);
        meshes[index].translate(BABYLON.Axis.X, 500, BABYLON.Space.WORLD);
        meshes[index].translate(BABYLON.Axis.Z, 20, BABYLON.Space.WORLD);
    }
});

var dogsig = BABYLON.MeshBuilder.CreateBox("dogsig",{ height: 30, width: 5, depth: 5}, scene);
dogsig.position = new BABYLON.Vector3(500,15,20);
dogsig.physicsImpostor = new BABYLON.PhysicsImpostor(dogsig, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});
dogsig.visibility = 0;


var dogbox = BABYLON.MeshBuilder.CreateBox("dogbox",{ height: 10, width: 50, depth: 10}, scene);
dogbox.visibility = 0;
BABYLON.SceneLoader.ImportMesh("","./models/dog/", "dog.obj", scene, function (meshes) {
    var dog = meshes[0];
    dog.scaling = new BABYLON.Vector3(7, 7, 7);
    dogbox.position.y = 5;
    dogbox.physicsImpostor = new BABYLON.PhysicsImpostor(dogbox, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});
    dog.parent = dogbox;
    dog.position.y = -5;
    dog.position.x = 25;
    dogbox.rotate(BABYLON.Axis.Y, 3*Math.PI/2, BABYLON.Space.LOCAL);

    dogbox.position.x = 640;
    dogbox.translate(BABYLON.Axis.X, 0, BABYLON.Space.LOCAL);
    
    for(i=1; i < 6; i++){
        dog2 = dog.clone("");
        dog2.position.x = dog.position.x - (i*10); 
    }
});






var car1;
var carbox = BABYLON.MeshBuilder.CreateBox("carbox",{ height: 10, width: 15, depth: 30}, scene);
carbox.visibility = 0;
var carbox2, carbox3, carbox4, carbox5, carbox6, carbox7, carbox8, carbox9;
var carboxb;
BABYLON.SceneLoader.ImportMesh("","./models/mitsubishi/", "car1.obj", scene, function (meshes) {
    car1 = BABYLON.Mesh.MergeMeshes(meshes);
    car1.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);
    car1.rotate(BABYLON.Axis.Y, 3*Math.PI/2, BABYLON.Space.LOCAL);
    car1.parent = carbox;
    car1.position.y = -5
    car1.position.z = -23;
    carbox.position = new BABYLON.Vector3(900,5,-15);
    carbox.physicsImpostor = new BABYLON.PhysicsImpostor(carbox, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});
    carbox.physicsImpostor.physicsBody.inertia.setZero();
    carbox.physicsImpostor.physicsBody.invInertia.setZero();
    carbox.physicsImpostor.physicsBody.invInertiaWorld.setZero();

    carbox2 = carbox.clone("");
    carbox2.position.x = carbox.position.x + (0.5*70);
    carbox2.position.z = 15;
    carbox2.rotate(BABYLON.Axis.Y, 2*Math.PI/2, BABYLON.Space.LOCAL);

    carbox3 = carbox.clone("");
    carbox3.position.x = carbox.position.x + (1*70);

    carbox4 = carbox.clone("");
    carbox4.position.x = carbox.position.x + (1.5*70);
    carbox4.position.z = 15;
    carbox4.rotate(BABYLON.Axis.Y, 2*Math.PI/2, BABYLON.Space.LOCAL);
        
    carbox5 = carbox.clone("");
    carbox5.position.x = carbox.position.x + (2*70); 

    carbox6 = carbox.clone("");
    carbox6.position.x = carbox.position.x + (2.5*70);
    carbox6.position.z = 15;
    carbox6.rotate(BABYLON.Axis.Y, 2*Math.PI/2, BABYLON.Space.LOCAL);

    carbox7 = carbox.clone("");
    carbox7.position.x = carbox.position.x + (3*70);

    carbox8 = carbox.clone("");
    carbox8.position.x = carbox.position.x + (3.5*70);
    carbox8.position.z = 15;
    carbox8.rotate(BABYLON.Axis.Y, 2*Math.PI/2, BABYLON.Space.LOCAL);
    
    carbox9 = carbox.clone("");
    carbox9.position.x = carbox.position.x + (4*70);

    carboxb = true;

});


var bridge = BABYLON.MeshBuilder.CreateBox("bridge",{ height: 17, width: 110, depth: 20}, scene);
bridge.receiveShadows = true;
bridge.position = new BABYLON.Vector3(1260,2.5,0);
bridge.physicsImpostor = new BABYLON.PhysicsImpostor(bridge, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});
bridge.physicsImpostor.physicsBody.inertia.setZero();
bridge.physicsImpostor.physicsBody.invInertia.setZero();
bridge.physicsImpostor.physicsBody.invInertiaWorld.setZero();
bridge.color = "Brown";
var bridgeMaterial = new BABYLON.StandardMaterial("bridgeMaterial", scene);
bridgeMaterial.diffuseTexture = new BABYLON.Texture("./textures/bridge.jpg", scene);
bridgeMaterial.diffuseTexture.uScale = 1.0;
bridgeMaterial.diffuseTexture.vScale = 5.0;
bridge.material = bridgeMaterial;


//BOSS WALL
var levelbord5 = BABYLON.MeshBuilder.CreateBox("levelbord5",{ height: 50, width: 20, depth: 500 }, scene);
levelbord5.position = new BABYLON.Vector3(1600, 0, 0);
levelbord5.visibility = 0;
levelbord5.physicsImpostor = new BABYLON.PhysicsImpostor(levelbord5, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0});



//ROBOT MATERIAL

var bodyMaterial = new BABYLON.StandardMaterial("bodyMaterial", scene);
bodyMaterial.diffuseTexture = new BABYLON.Texture("./textures/red.jpg", scene);

var batteryMaterial = new BABYLON.StandardMaterial("batteryMaterial", scene);
batteryMaterial.emissiveColor = new BABYLON.Color3(0,1,0);

var armMaterial = new BABYLON.StandardMaterial("armMaterial", scene);
armMaterial.diffuseTexture = new BABYLON.Texture("./textures/ice.jpg", scene);

var donutMaterial = new BABYLON.StandardMaterial("armMaterial", scene);
donutMaterial.diffuseTexture = new BABYLON.Texture("./textures/blue.jpeg", scene);

var headMaterial = new BABYLON.StandardMaterial("headMaterial", scene);
headMaterial.diffuseTexture = new BABYLON.Texture("./textures/head.jpg", scene);




//ROBOT
var int1 = BABYLON.Mesh.CreateSphere("int1", 32, 25, scene);
int1.position = new BABYLON.Vector3(70, 23, 0);
var a = BABYLON.CSG.FromMesh(int1);

var tot = BABYLON.MeshBuilder.CreateBox("robbody",{ height: 15, width: 21, depth: 21}, scene);
tot.position = new BABYLON.Vector3(70, 23, 0);


var b = BABYLON.CSG.FromMesh(tot);

//csg
var robbody = b.intersect(a).toMesh("c", null, scene);
robbody.material = bodyMaterial;
robbody.position.x = 1700;
int1.dispose();
tot.dispose();


var robbodybot = BABYLON.MeshBuilder.CreateBox("robbodybot",{ height: 6, width: 10, depth: 10}, scene);
robbodybot.parent = robbody;
robbodybot.position = new BABYLON.Vector3(0, -8, 0);
robbodybot.material = bodyMaterial;

var robhead = BABYLON.Mesh.CreateSphere("robhead", 32, 10, scene);
robhead.parent = robbody;
robhead.position.y = 8;
robhead.material = headMaterial;

var robheadcone1 = BABYLON.MeshBuilder.CreateCylinder("robheadcone1", {diameterTop:0, diameterBottom: 3, height: 5, tessellation: 96}, scene);
robheadcone1.parent = robhead;
robheadcone1.position = new BABYLON.Vector3(0, 5, 4);
robheadcone1.rotate(BABYLON.Axis.X, Math.PI/4, BABYLON.Space.LOCAL);
robheadcone1.material = demMaterial;


var robheadcone2 = BABYLON.MeshBuilder.CreateCylinder("robheadcone2", {diameterTop:0, diameterBottom: 3, height: 5, tessellation: 96}, scene);
robheadcone2.parent = robhead;
robheadcone2.position = new BABYLON.Vector3(0, 5, -4);
robheadcone2.rotate(BABYLON.Axis.X, -Math.PI/4, BABYLON.Space.LOCAL);
robheadcone2.material = demMaterial;

var robbodysphere = BABYLON.Mesh.CreateSphere("robbodysphere", 32, 7, scene);
robbodysphere.parent = robbody;
robbodysphere.position.x = -10;
robbodysphere.material = batteryMaterial;

var donut = BABYLON.MeshBuilder.CreateTorus("donut", {thickness: 3.5, diameter: 10}, scene);
donut.parent = robbody;
donut.position.y = -13;
donut.material = donutMaterial;

var wheel = BABYLON.Mesh.CreateSphere("wheel", 32, 10, scene);
wheel.parent = robbody;
wheel.position.y = -18;
wheel.material = demMaterial;

var leftarm1 = BABYLON.MeshBuilder.CreateCylinder("leftarm1", {diameterTop:7, diameterBottom: 7, height: 10, tessellation: 96}, scene);
leftarm1.rotation.x = Math.PI/2;
leftarm1.parent = robbody;
leftarm1.position = new BABYLON.Vector3(0, 0, -15);
leftarm1.material = bodyMaterial;

var leftarm2 = BABYLON.MeshBuilder.CreateCylinder("leftarm2", {diameterTop:7, diameterBottom: 7, height: 20, tessellation: 96}, scene);
leftarm2.parent = leftarm1;
leftarm2.rotation.x = Math.PI/2;
leftarm2.position = new BABYLON.Vector3(0, -8, 0);
leftarm2.material = armMaterial;

var leftarm2cone1 = BABYLON.MeshBuilder.CreateCylinder("leftarm2cone1", {diameterTop:0, diameterBottom: 7, height: 6, tessellation: 96}, scene);
leftarm2cone1.parent = leftarm2;
leftarm2cone1.position.y = 13;
leftarm2cone1.material = demMaterial;

var leftarm2cone2 = BABYLON.MeshBuilder.CreateCylinder("leftarm2cone2", {diameterTop:0, diameterBottom: 7, height: 6, tessellation: 96}, scene);
leftarm2cone2.parent = leftarm2;
leftarm2cone2.position.y = -13;
leftarm2cone2.rotation.x = Math.PI;
leftarm2cone2.material = demMaterial;

var finalcube = BABYLON.MeshBuilder.CreateBox("finalcube",{ height: 6, width: 6, depth: 6}, scene);
finalcube.parent = leftarm2;
finalcube.position.z = 6;
finalcube.material = bodyMaterial;

var finalcone = BABYLON.MeshBuilder.CreateCylinder("finalcone", {diameterTop:0, diameterBottom: 5, height: 7, tessellation: 96}, scene);
finalcone.parent = finalcube;
finalcone.position.x = -6;
finalcone.rotation.z = Math.PI/2;
finalcone.material = demMaterial;


var rightarm1 = BABYLON.MeshBuilder.CreateCylinder("rightarm1", {diameterTop:7, diameterBottom: 7, height: 10, tessellation: 96}, scene);
rightarm1.rotation.x = Math.PI/2;
rightarm1.parent = robbody;
rightarm1.position = new BABYLON.Vector3(0, 0, 15);
rightarm1.material = bodyMaterial;

var rightarm2 = BABYLON.MeshBuilder.CreateCylinder("rightarm2", {diameterTop:7, diameterBottom: 7, height: 20, tessellation: 96}, scene);
rightarm2.parent = rightarm1;
rightarm2.rotation.x = Math.PI/2;
rightarm2.position = new BABYLON.Vector3(0, 8, 0);
rightarm2.material = armMaterial;

var rightarm2cone1 = BABYLON.MeshBuilder.CreateCylinder("rightarm2cone1", {diameterTop:0, diameterBottom: 7, height: 6, tessellation: 96}, scene);
rightarm2cone1.parent = rightarm2;
rightarm2cone1.position.y = 13;
rightarm2cone1.material = demMaterial;

var rightarm2cone2 = BABYLON.MeshBuilder.CreateCylinder("rightarm2cone2", {diameterTop:0, diameterBottom: 7, height: 6, tessellation: 96}, scene);
rightarm2cone2.parent = rightarm2;
rightarm2cone2.position.y = -13;
rightarm2cone2.rotation.x = Math.PI;
rightarm2cone2.material = demMaterial;

var finalcube2 = BABYLON.MeshBuilder.CreateBox("finalcube2",{ height: 6, width: 6, depth: 6}, scene);
finalcube2.parent = rightarm2;
finalcube2.position.z = -6;
finalcube2.material = bodyMaterial;

var finalcone2 = BABYLON.MeshBuilder.CreateCylinder("finalcone", {diameterTop:0, diameterBottom: 5, height: 7, tessellation: 96}, scene);
finalcone2.parent = finalcube2;
finalcone2.position.x = -6;
finalcone2.rotation.z = Math.PI/2;
finalcone2.material = demMaterial;

var gunbool = true;










//PLAYER
var body = BABYLON.MeshBuilder.CreateBox("body",{ height: 10, width: 5, depth: 3 }, scene);
body.visibility = 0;
var player;
var skeleton;
var positionbones = [];
var rotationbones = [];

//dude animation
var dudeanim;

BABYLON.SceneLoader.ImportMesh("", "./models/dude/", "dude.babylon", scene, function (newMeshes, particleSystems, skeletons) {
    player = newMeshes[0];
    skeleton = skeletons[0];
    dudeanim = scene.beginAnimation(skeleton, 0, 100, true, 2.0);
    dudeanim.pause();
    body.position.y = 5;
    body.physicsImpostor = new BABYLON.PhysicsImpostor(body, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 80, restitution: 0});

    //starting point
    player.scaling = new BABYLON.Vector3(0.15, 0.15, 0.15);

    skeleton.bones[32].rotate(BABYLON.Axis.Y, -0.5, BABYLON.Space.LOCAL);
    skeleton.bones[13].rotate(BABYLON.Axis.Y, +0.5, BABYLON.Space.LOCAL);

    for(k = 0; k < skeleton.bones.length; k++){
        positionbones[k] = skeleton.bones[k].getPosition();
        rotationbones[k] = skeleton.bones[k].getRotation();
    }
    

    bodyb = true;
    player.parent = body;
    player.position.y = -4.70;
    //position was -20
    body.position.x = -20;
    body.physicsImpostor.physicsBody.inertia.setZero();
    body.physicsImpostor.physicsBody.invInertia.setZero();
    body.physicsImpostor.physicsBody.invInertiaWorld.setZero();
    body.rotate(BABYLON.Axis.Y, Math.PI/2, BABYLON.Space.LOCAL);

    //Camera lock
    camera.lockedTarget = body;

    //Shadows
    shadowGenerator.addShadowCaster(player);
    //shadowGenerator2.addShadowCaster(player);
    //shadowGenerator3.addShadowCaster(player);
    shadowGenerator4.addShadowCaster(player);
    shadowGenerator5.addShadowCaster(player);
    //shadowGenerator6.addShadowCaster(player);    
    //shadowGenerator7.addShadowCaster(player);
    shadowGenerator8.addShadowCaster(player);
    shadowGenerator9.addShadowCaster(player);
    //shadowGenerator10.addShadowCaster(player);
    shadowGenerator12.addShadowCaster(player);
    shadowGenerator13.addShadowCaster(player);
    shadowGenerator16.addShadowCaster(player);            

    var box = BABYLON.MeshBuilder.CreateBox("", {height: 5, width: 5, depth: 5}, scene);
    box.position = new BABYLON.Vector3(780,-2.5,15);
    var boxMaterial = new BABYLON.StandardMaterial("boxmat", scene);
    boxMaterial.diffuseTexture = new BABYLON.Texture("./textures/box.png", scene);
    box.material = boxMaterial;

    for(i = 1; i < 4; i++){
        for(j= 1; j < 4; j++){
            for(z = 1; z < 4; z++){
                var box2 = box.clone("");
                box2.position = new BABYLON.Vector3(box.position.x + i*6, box.position.y + j*6, box.position.z + z*6);
                box2.physicsImpostor = new BABYLON.PhysicsImpostor(box2, BABYLON.PhysicsImpostor.BoxImpostor,{mass: 5, restitution: 0, friction: 1}, scene);
                body.physicsImpostor.registerOnPhysicsCollide(box2.physicsImpostor, function() {
                    if(life1.text=="10" && damage == false){
                        if(!scream.isPlaying){
                            scream.play();
                        }
                        life1.text = "9";
                        damage = true;
                        setTimeout(function(){damage = false}, 1000);
                    }
                    if(life1.text=="9" && damage == false){
                        if(!scream.isPlaying){
                            scream.play();
                        }
                        life1.text = "8";
                        damage = true;
                        setTimeout(function(){damage = false}, 1000);
                    }
                    if(life1.text=="8" && damage == false){
                        if(!scream.isPlaying){
                            scream.play();
                        }
                        life1.text = "7";
                        damage = true;
                        setTimeout(function(){damage = false}, 1000);
                    }
                    if(life1.text=="7" && damage == false){
                        if(!scream.isPlaying){
                            scream.play();
                        }
                        life1.text = "6";
                        damage = true;
                        setTimeout(function(){damage = false}, 1000);
                    }
                    if(life1.text=="6" && damage == false){
                        if(!scream.isPlaying){
                            scream.play();
                        }
                        life1.text = "5";
                        damage = true;
                        setTimeout(function(){damage = false}, 1000);
                    }
                    if(life1.text=="5" && damage == false){
                        if(!scream.isPlaying){
                            scream.play();
                        }
                        life1.text = "4";
                        damage = true;
                        setTimeout(function(){damage = false}, 1000);
                    }
                    if(life1.text=="4" && damage == false){
                        if(!scream.isPlaying){
                            scream.play();
                        }
                        life1.text = "3";
                        damage = true;
                        setTimeout(function(){damage = false}, 1000);
                    }
                    if(life1.text=="3" && damage == false){
                        if(!scream.isPlaying){
                            scream.play();
                        }
                        life1.text = "2";
                        damage = true;
                        setTimeout(function(){damage = false}, 1000);
                    }
                    if(life1.text=="2" && damage == false){
                        if(!scream.isPlaying){
                            scream.play();
                        }
                        life1.text = "1";
                        damage = true;
                        setTimeout(function(){damage = false}, 1000);
                    }
                    if(life1.text=="1" && damage == false){
                        if(!scream.isPlaying){
                            scream.play();
                        }
                        life1.text = "GAME OVER";
                        damage = true;
                        setTimeout(function(){damage = false}, 1000);
                        clicks ++;
                    }
                });
    
            }
        }
    }
    box.dispose();
});


engine.runRenderLoop(function(){
    divFps.innerHTML = engine.getFps().toFixed() + " fps";
    if(clicks==0){
        if (scene.getWaitingItemsCount() === 0) {
            engine.hideLoadingUI();
            scene0.render();
        } else {
            engine.displayLoadingUI();
        }
    }                   
    else if(clicks == 1){
        advancedTexture1.dispose();
        scene.render();
    }
    else if(clicks == 2){
        advancedTexture.dispose();
        scene1.render();
    }
});


window.addEventListener("resize", function () {
    engine.resize();
    engine.setHardwareScalingLevel(1/engineScale);
});