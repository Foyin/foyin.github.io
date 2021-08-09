import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.130.0-WI96Ec9p8dZb5AMcOcgD/mode=imports,min/optimized/three.js';
//import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three-orbitcontrols@2.110.3/OrbitControls.min.js';

// Setup
let spaceTexture, scene, camera, renderer, spotLight, ambientLight, earth, moon, clouds;
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
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
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
  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(15, 0, 5);

  spotLight.castShadow = true;

  ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(spotLight, ambientLight);

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

  earth = new THREE.Mesh(
    new THREE.SphereGeometry(2, 30, 30),
    new THREE.MeshPhongMaterial({
    map: earthDayMap,
    //normalMap: earthNormalMap,
    color: 0xaaaaaa,
    specular: 0x87CEEB,
    specularMap: earthSpecularMap,
    bumpMap: earthBumpMap,
    bumpScale: 0.1,
    shininess: 25
    })
  );

  earth.position.z = 0;
  earth.position.x = 0;
  earth.rotation.z -= 0.1;
  earth.rotation.y += Math.PI ;


// jupiter
  moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 28, 28),
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
      new THREE.SphereGeometry(2.01, 32, 32),
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


  scene.add(clouds);

  scene.add(earth);
  scene.add(moon);


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

  earth.rotation.y += 0.002;
  clouds.rotation.y += 0.001;

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
  camera.lookAt(earth.position);
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
