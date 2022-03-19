var density = 5;
var opacitySlow = 100;
var linkDistance = 60;
var linkOpacity = 0.4;
var mouseLinkDistance = 150;
var mouseLinkOpacity = 1;
var rayon = {
    max: 2,
    min: 1
};
var speed = {
    max: 0.07,
    min: 0.05
};




var canvas;
var particlesAmount = 100;
var particles = [];

var mouse = {
    enable: false,
    x: 0,
    y: 0,
}

function createCanvas(){
    console.log("creating canvas ...");
    var container = document.getElementById("canvas-container"); 
    canvas = document.createElement("canvas");
    container.appendChild(canvas);
    console.log("canvas added !");
    canvas.ctx = canvas.getContext("2d");
    resize();
    init();
    animate();

    
}
        
function resize() {
    canvas.width = 0;
    canvas.height = 0;
    canvas.width = document.body.scrollWidth;
    canvas.height = document.body.scrollHeight;
    particlesAmount = canvas.height * canvas.width*density/10000
}

function init(){
    for(var i = 0; i < particlesAmount; i++){
        particles.push(createParticle());
    }

    canvas.addEventListener('mousemove', e => {
        mouse.enable = true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
      
    canvas.addEventListener("mouseleave", e => {
        mouse.enable = false;
        mouse.x = 0;
        mouse.y = 0;
    
    });
}

function animate(){
    resize();
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(particles.length != particlesAmount){
        if(particles.length >= particlesAmount + 1){
            particles = particles.slice(0, particlesAmount);
        } else {
            for(var i = particles.length; i < particlesAmount; i++){
                particles.push(createParticle());
            }
        }
    }

    for(var i = 0; i < particles.length; i++){

        var particle = particles[i];
        particle.y += particle.velocity * Math.sin(particle.direction);
        particle.x += particle.velocity * Math.cos(particle.direction);

        if(particle.x <= 0 || particle.y <= 0 || particle.x >= canvas.width || particle.y >= canvas.height){
            particles[i] = createParticle();
        }

        particle.opacityUpper ? particle.opacity += particle.opacitySpeed : particle.opacity -= particle.opacitySpeed;     
        (particle.opacity >= 1 || particle.opacity <= 0) && (particle.opacityUpper = !particle.opacityUpper);

        drawParticle(particle);
        linkParticles(particle);
        mouse.enable && linkMouse(particle);
    }
    requestAnimationFrame(animate)
}
function createParticle(){
    var particle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.floor(Math.random() * (rayon.max - rayon.min + 1) + rayon.min),
        opacityUpper: Math.random() < 0.5,
        opacitySpeed: Math.random()/opacitySlow,
        opacity: Math.random(),
        direction: Math.random() * 360,
        velocity: Math.random() * (speed.max - speed.min + 1) + speed.min
    }
    return particle;
}

function drawParticle(particle){
    canvas.ctx.fillStyle = "rgba(255, 255, 255, " + particle.opacity + ")";
    canvas.ctx.beginPath();
    canvas.ctx.arc(particle.x, particle.y, particle.r, 0, 2 * Math.PI);
    canvas.ctx.fill();
    canvas.ctx.closePath();
}


function linkParticles(particle) {

    particles.forEach(part => {
        var x = particle.x - part.x;
        var y = particle.y - part.y;
        var distance = Math.sqrt(x*x + y*y);

        if(distance <= linkDistance){
            var opacity = linkOpacity - distance / (1 / linkOpacity) / linkDistance;
            canvas.ctx.strokeStyle = "rgba(255, 255, 255, " + opacity + ")";
            canvas.ctx.lineWidth = 1,
            canvas.ctx.beginPath(),
            canvas.ctx.moveTo(particle.x, particle.y),
            canvas.ctx.lineTo(part.x, part.y),
            canvas.ctx.stroke(),
            canvas.ctx.closePath();
        }
    });
}

function linkMouse(particle) {

    var x = particle.x - mouse.x;
    var y = particle.y - mouse.y;
    var distance = Math.sqrt(x*x + y*y);

    if(distance <= mouseLinkDistance){
        var opacity = mouseLinkOpacity - distance / (1 / mouseLinkOpacity) / mouseLinkDistance;
        canvas.ctx.strokeStyle = "rgba(255, 255, 255, " + opacity + ")";
        canvas.ctx.lineWidth = 1,
        canvas.ctx.beginPath(),
        canvas.ctx.moveTo(particle.x, particle.y),
        canvas.ctx.lineTo(mouse.x, mouse.y),
        canvas.ctx.stroke(),
        canvas.ctx.closePath();
    }
}