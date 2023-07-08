import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.130.0-WI96Ec9p8dZb5AMcOcgD/mode=imports,min/optimized/three.js';
//import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three-orbitcontrols@2.110.3/OrbitControls.min.js';

// Setup
let spaceTexture, scene, camera, renderer, directlLight, ambientLight, earth, moon, clouds, saturn, mars;
let r, r2, theta, dTheta, dTheta2;


let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let mouseX = 0;
let mouseY = 0;


const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

  console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onLoad = function ( ) {

  console.log( 'Loading complete!');
  fadeOutEffect('ld');

};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

  console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onError = function ( url ) {

  console.log( 'There was an error loading ' + url );

};

init();
animate();

function fadeOutEffect(target) {
    var fadeTarget = document.getElementById(target);
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 100);

    setInterval(function () {
        fadeTarget.remove();
    }, 1000);

}

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 3, 3);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(550));

  star.position.set(x, y, z-100);
  scene.add(star);
}


function init(){
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });

  // Lights
  directlLight = new THREE.DirectionalLight(0xffffff, 2, 200, Math.PI/2, 0.2, 2);
  directlLight.position.set(15, 0, 5);

  directlLight.castShadow = true;

  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(directlLight, ambientLight);

  // Background
  spaceTexture = new THREE.TextureLoader(manager).load('images/stars_milky_way.jpg');
  scene.background = spaceTexture;
  Array(250).fill().forEach(addStar);


  //document.addEventListener( 'mousemove', onDocumentMouseMove );

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(30);
  camera.position.setX(-3);

  r = 2.5;
  r2 = 4
  theta = 0;
  dTheta = 2 * Math.PI / 3000;
  dTheta2 = 2 * Math.PI / 3000;

  // Helpers

  // const lightHelper = new THREE.PointLightHelper(pointLight)
  // const gridHelper = new THREE.GridHelper(200, 50);
  // scene.add(lightHelper, gridHelper)

  // const controls = new OrbitControls(camera, renderer.domElement);

  //const earthMap = new THREE.TextureLoader(manager).load('images/earthMap1k.jpg');
  const earthDayMap = new THREE.TextureLoader(manager).load('images/earth_daymap.jpg');
  //const earthNightMap = new THREE.TextureLoader(manager).load('images/earth_nightmap.jpg');
  //const earthNormalMap = new THREE.TextureLoader(manager).load('images/earth_normal_map.tif');
  const earthSpecularMap = new THREE.TextureLoader(manager).load('images/earthspec1k.jpg');
  //const earthCloudsMap = new THREE.TextureLoader().load('earth_clouds.jpg');
  const earthCloudsMap = new THREE.TextureLoader(manager).load('images/earth_clouds.jpg');
  //const earthCloudsMapTransparent = new THREE.TextureLoader(manager).load('images/earthcloudmap.jpg');

  const earthBumpMap = new THREE.TextureLoader(manager).load('images/earthBumpMap.jpg');

  const moonMap = new THREE.TextureLoader(manager).load('images/moon1.jpg');
  const moonNormalMap = new THREE.TextureLoader(manager).load('images/moonNormal.jpg');
  const saturnTexture = new THREE.TextureLoader(manager).load('images/saturn.jpg');
  
  const marsTexture = new THREE.TextureLoader(manager).load('images/mars.jpg');
  const marsNormalTexture = new THREE.TextureLoader(manager).load('images/marsNormal.jpg');
  const marsBumpMap = new THREE.TextureLoader(manager).load('images/marsbump.jpg');


  earth = new THREE.Mesh(
    new THREE.SphereGeometry(2, 26, 26),
    new THREE.MeshPhongMaterial({
    map: earthDayMap,
    //normalMap: earthNormalMap,
    color: 0xaaaaaa,
    specular: 0x111111,
    specularMap: earthSpecularMap,
    bumpMap: earthBumpMap,
    bumpScale: 0.1,
    shininess: 23
    })
  );

  earth.position.z = 0;
  earth.position.x = 0;
  earth.rotation.z -= 0.1;
  earth.rotation.y += Math.PI *2;

  // Saturn
  saturn = new THREE.Mesh(
    new THREE.SphereGeometry(2, 26, 26),
    new THREE.MeshPhongMaterial({
      map: saturnTexture,
      color: 0xaaaaaa,
      specular: 0x333333,
      shininess: 20
    })
  );

  saturn.position.z = 0;
  saturn.position.x = 0;
  saturn.rotation.z -= 0.1;
  saturn.rotation.y += Math.PI *2;
  
  // Saturns Torus or rings
  const ringsTexture = new THREE.TextureLoader(manager).load('images/rings3.jpg');
  const torusGeometry = new THREE.TorusGeometry(7, 3, 2, 180);
  const torusMaterial = new THREE.MeshPhongMaterial({
      map: ringsTexture, 
      color: 0xfae5bf,
      specular: 0xffffff,
      transparent:true,
      opacity: 0.5,
      shininess: 25 
    });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  
  torus.position.z = 0;
  torus.position.x = 0;
  torus.rotation.x += 1.6;

// Mars
 mars = new THREE.Mesh(
  new THREE.SphereGeometry(2, 27, 27),
  new THREE.MeshPhongMaterial({
    map: marsTexture,
    color: 0xaaaaaa,
    specular: 0x333333,
    bumpMap: marsBumpMap,
    bumpScale: 0.1,
    shininess: 17
  })
);
  
  mars.position.z = 0;
  mars.position.x = 0;
  mars.rotation.z -= 0.1;
  mars.rotation.y += Math.PI *2;

// moon
  moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 10, 10),
    new THREE.MeshPhongMaterial({
      map: moonMap,
      normalMap: moonNormalMap,
      color: 0xaaaaaa,
      specular: new THREE.Color('grey'),
      shininess: 10
    })
  );

  moon.position.z = 45;
  moon.position.x = -3;
  moon.rotation.z -= 0.1;

  clouds = new THREE.Mesh(
      new THREE.SphereGeometry(2.01, 28, 28),
      new THREE.MeshPhongMaterial({
      map         : earthCloudsMap,
      transparent : true,
      opacity     : 0.4,
      depthWrite  : false,
      shininess: 25

    })
  );

  clouds.position.z = earth.position.z;
  clouds.position.x = earth.position.x;

  if (Math.random() >= 0.7){
    scene.add(clouds);
    scene.add(earth);
    scene.add(moon);
  }
  else{
    scene.add(saturn);
    scene.add(torus);
  }
  
  
  
    window.addEventListener( 'resize', onWindowResize );
}

// Scroll Animation

function moveCamera() {
  //const t = document.body.getBoundingClientRect().top;

  //moon.rotation.z += 0.2;


  //camera.position.z = t * -0.05;
  //camera.position.x = t * -0.002;
  //camera.rotation.y = t * -0.002;
}

//document.body.onscroll = moveCamera;
//moveCamera();

// Animation Loop




function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
/*
function onDocumentMouseMove( event ) {

  mouseX = ( event.clientX - windowHalfX ) / 100;
  mouseY = ( event.clientY - windowHalfY ) / 100;

}
*/

function animate() {
  requestAnimationFrame(animate);

  //camera.position.x += ( mouseX - camera.position.x ) * .05;
  //camera.position.y += ( - mouseY - camera.position.y ) * .05;

  earth.rotation.y += 0.0002;
  clouds.rotation.y += 0.0004;

  moon.rotation.x += 0.002;
  moon.rotation.y += 0.001;

  theta += dTheta;
  moon.position.x = r2 * Math.cos(-theta) + earth.position.x;
  moon.position.z = r2 * Math.sin(-theta) + earth.position.z;

  //moon.rotation.y -= 0.02;
  //moon.rotation.z -= 0.001;

  camera.position.x = r * Math.cos(theta) + earth.position.x;
  camera.position.z = r * Math.sin(theta) + earth.position.z;
  camera.position.y = r * Math.cos(theta);
  camera.lookAt(0, 0, 0);
  //moon.position.y = r2 * Math.cos(theta);


  // controls.update();
  renderer.clear();

  renderer.render(scene, camera);
}




/// Emailjs functionality////////////////////////////////////////////////////////////////////////*
(function($) {
  emailjs.init("user_DOyZXEt52dypmFFUwlq7D");
var myform = $("#contactForm");
myform.submit(function(event){
event.preventDefault();

// Change to your service ID, or keep using the default service
var service_id = "service_guth87n";
var template_id = "template_33SrHbDo";

myform.find("#send").text("Sending...");
emailjs.sendForm(service_id,template_id,myform[0]).then(
  function(){ 
    //alert("Sent!");
    $("#contactForm div .namefield").fadeOut();
    $("#contactForm div .messagefield").fadeOut();
    $("#contactForm div .submitbutton").fadeOut();
    $("#contactForm div .namefield").remove();
    $("#contactForm div .messagefield").remove();
    $("#contactForm div .submitbutton").remove();
    $("#contactForm div").prepend('<h2 style="width:100%; padding:25%; text-align:center;"><b>Thank You!</b><h2>');
  }, 
  function(err) {
    alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
    $("#send").text("Send Message");
  });
  return false;
});

})(jQuery);
