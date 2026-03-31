// Force scroll to top on every load/refresh
if(history.scrollRestoration)history.scrollRestoration='manual';
window.scrollTo(0,0);

// THEME TOGGLE — always starts white (ignores any saved preference)
var _theme='light';
function getTheme(){return _theme;}
function applyTheme(t){_theme=t;document.body.classList.toggle('light',t==='light');document.documentElement.classList.toggle('light',t==='light');if(window._setWebGLTheme)window._setWebGLTheme(t==='light');}
function toggleTheme(){applyTheme(getTheme()==='dark'?'light':'dark');}
applyTheme('light');
var tBtn=document.getElementById('theme-toggle');
if(tBtn)tBtn.addEventListener('click',toggleTheme);
var tBtnMob=document.getElementById('theme-toggle-mob');
if(tBtnMob)tBtnMob.addEventListener('click',toggleTheme);
var tBtnMob2=document.getElementById('theme-toggle-mob2');
if(tBtnMob2)tBtnMob2.addEventListener('click',toggleTheme);

// AURORA BOREALIS LOADER
(function(){
  var c=document.getElementById('aurora-canvas');
  if(!c)return;
  var gl=c.getContext('webgl')||c.getContext('experimental-webgl');
  if(!gl)return;

  var vs='attribute vec2 pos;void main(){gl_Position=vec4(pos,0.,1.);}';
  var fs=[
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform float uT;uniform vec2 uR;uniform vec2 uM;',
    'float rnd(vec2 s){return fract(sin(dot(s,vec2(12.9898,78.233)))*43758.5453);}',
    'float ns(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);',
    '  return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+vec2(1,1)),u.x),u.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*ns(p);p*=2.;a*=.5;}return v;}',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy-.5*uR)/uR.y;',
    '  vec2 m=(uM-.5*uR)/uR.y;',
    '  float t=uT*.18;',
    '  vec2 p=uv;p.y+=.55;',
    '  float f=fbm(vec2(p.x*1.8,p.y+t));',
    '  float cur=smoothstep(.08,.55,f)*(1.1-p.y);',
    '  cur=clamp(cur,0.,1.);',
    '  float d=length(uv-m);',
    '  float fl=smoothstep(.28,.0,d)*0.9;',
    '  vec3 c1=vec3(.05,.85,.48),c2=vec3(.75,.15,.9),c3=vec3(.1,.5,1.);',
    '  float blend=fbm(vec2(p.x*.9,p.y*.8+t*.5));',
    '  vec3 col=mix(mix(c1,c3,blend),c2,p.y*0.7)*cur*1.15;',
    '  col+=vec3(.9,1.,.85)*fl*cur*2.2;',
    '  col+=vec3(.5,.2,.9)*smoothstep(.5,.8,fbm(vec2(p.x*3.,p.y*2.+t*1.3)))*cur*.4;',
    '  gl_FragColor=vec4(col,1.);',
    '}'
  ].join('\n');

  function mkS(type,src){
    var s=gl.createShader(type);
    if(!s)return null;
    gl.shaderSource(s,src);gl.compileShader(s);
    return s;
  }
  var vs_=mkS(gl.VERTEX_SHADER,vs),fs_=mkS(gl.FRAGMENT_SHADER,fs);
  if(!vs_||!fs_)return;
  var prog=gl.createProgram();
  if(!prog)return;
  gl.attachShader(prog,vs_);gl.attachShader(prog,fs_);
  gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS))return;
  gl.useProgram(prog);

  var buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  var pl=gl.getAttribLocation(prog,'pos');
  gl.enableVertexAttribArray(pl);
  gl.vertexAttribPointer(pl,2,gl.FLOAT,false,0,0);

  var uTL=gl.getUniformLocation(prog,'uT');
  var uRL=gl.getUniformLocation(prog,'uR');
  var uML=gl.getUniformLocation(prog,'uM');
  var mx=-100,my=-100,raf;

  function getWH(){
    return{
      w:Math.max(document.documentElement.clientWidth||window.innerWidth,1),
      h:Math.max(document.documentElement.clientHeight||window.innerHeight,1)
    };
  }
  function resize(){
    var dpr=Math.min(window.devicePixelRatio||1,2);
    var d=getWH();
    c.width=d.w*dpr;c.height=d.h*dpr;
    c.style.width=d.w+'px';c.style.height=d.h+'px';
    gl.viewport(0,0,c.width,c.height);
  }
  resize();
  window.addEventListener('resize',resize);
  window.addEventListener('orientationchange',function(){setTimeout(resize,350);});
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',resize);
  }

  function onMove(e){
    var dpr=Math.min(window.devicePixelRatio||1,2);
    var touch=e.touches?e.touches[0]:e;
    mx=touch.clientX*dpr;
    my=c.height-touch.clientY*dpr;
  }
  window.addEventListener('mousemove',onMove);
  window.addEventListener('touchmove',onMove,{passive:true});

  function draw(ts){
    gl.uniform1f(uTL,(ts||0)*.001);
    gl.uniform2f(uRL,c.width,c.height);
    gl.uniform2f(uML,mx,my);
    gl.drawArrays(gl.TRIANGLES,0,6);
    raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);

  window._stopAurora=function(){
    cancelAnimationFrame(raf);
    window.removeEventListener('resize',resize);
    window.removeEventListener('mousemove',onMove);
    window.removeEventListener('touchmove',onMove);
  };
})();

// CURSOR
var dot=document.getElementById('c-dot'),ring=document.getElementById('c-ring');
var mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function anim(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(anim)})();
document.querySelectorAll('a,button,.pc,.cc,.pill').forEach(function(el){
  el.addEventListener('mouseenter',function(){ring.classList.add('hovering')});
  el.addEventListener('mouseleave',function(){ring.classList.remove('hovering')});
});

// LOADER
function dismissLoader(){
  var l=document.getElementById('loader');
  if(!l){document.body.classList.add('page-ready');return;}
  l.classList.add('out');
  setTimeout(function(){
    l.style.display='none';
    if(window._stopAurora)window._stopAurora();
    document.body.classList.add('page-ready');
  },700);
}
setTimeout(dismissLoader,2000);
// absolute fallback — always show portfolio even if something fails
setTimeout(function(){
  document.body.classList.add('page-ready');
  var l=document.getElementById('loader');
  if(l){l.classList.add('out');l.style.display='none';}
  if(window._stopAurora)window._stopAurora();
},5000);

// MOBILE NAV
var hamBtn=document.getElementById('ham');if(hamBtn)hamBtn.addEventListener('click',function(){var mn=document.getElementById('mobn');if(mn)mn.classList.toggle('open')});
function closeMob(){var mn=document.getElementById('mobn');if(mn)mn.classList.remove('open')}

// ACTIVE NAV
var secIds=['about','experience','certs','projects','contact'];
var navLinks=document.querySelectorAll('.n-lnk[data-sec]');
var ioN=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting){navLinks.forEach(function(l){l.classList.toggle('act',l.dataset.sec===e.target.id)})}});
},{threshold:.2,rootMargin:'-80px 0px -35% 0px'});
secIds.forEach(function(id){var el=document.getElementById(id);if(el)ioN.observe(el)});

// TYPING EFFECT
var phr=['Cloud Infrastructure','Monitoring & Alerting','DevOps Automation','Terraform IaC','Azure & AWS Ops'];
var pi=0,ci=0,del=false;
function type(){
  var el=document.getElementById('typed');if(!el)return;
  var p=phr[pi];
  if(!del){el.textContent=p.slice(0,++ci);if(ci===p.length){del=true;setTimeout(type,2000);return;}setTimeout(type,62);}
  else{el.textContent=p.slice(0,--ci);if(ci===0){del=false;pi=(pi+1)%phr.length;setTimeout(type,360);return;}setTimeout(type,36);}
}
setTimeout(type,3000);

// SCROLL REVEAL
var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');}else{e.target.classList.remove('on');}});},{threshold:.08,rootMargin:'0px 0px -20px 0px'});
document.querySelectorAll('.rv,.rvl,.rvr,.rvs').forEach(function(el){io.observe(el)});

// TIMELINE DOTS
var dotIO=new IntersectionObserver(function(entries){
  entries.forEach(function(e){e.target.classList.toggle('pulsing',e.isIntersecting)});
},{threshold:.5});
document.querySelectorAll('.exp-dot').forEach(function(d){dotIO.observe(d)});

// STATS COUNTERS
var ios=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(!e.isIntersecting)return;
    var el=e.target,target=+el.dataset.target,suf=el.dataset.suffix||'';
    var cur=0,step=Math.max(1,Math.ceil(target/60));
    var t=setInterval(function(){cur=Math.min(cur+step,target);el.textContent=cur+suf;if(cur>=target)clearInterval(t)},20);
  });
},{threshold:.6});
document.querySelectorAll('.stn[data-target]').forEach(function(el){ios.observe(el)});

// CARD TILT
document.querySelectorAll('.cc,.pc').forEach(function(card){
  card.addEventListener('mousemove',function(e){
    var r=card.getBoundingClientRect();
    var x=((e.clientX-r.left)/r.width-.5)*8;
    var y=((e.clientY-r.top)/r.height-.5)*-8;
    card.style.transform='translateY(-8px) perspective(600px) rotateY('+x+'deg) rotateX('+y+'deg)';
  });
  card.addEventListener('mouseleave',function(){card.style.transform=''});
});

// EMAIL TOAST
function showMailToast(e){
  if(e)e.preventDefault();
  if(document.getElementById('mail-toast'))return;
  var t=document.createElement('div');
  t.id='mail-toast';
  t.style.cssText='position:fixed;bottom:88px;left:50%;transform:translateX(-50%);background:rgba(4,6,22,.96);border:1px solid rgba(79,172,254,.25);padding:14px 24px;border-radius:14px;font-family:JetBrains Mono,monospace;font-size:11.5px;color:#e8f4ff;z-index:9999;max-width:94vw;text-align:center;line-height:1.75;box-shadow:0 14px 48px rgba(0,0,0,.55);opacity:1;transition:opacity .5s';
  t.innerHTML='&#128236; No default mail app configured. Looks like we have to establish this connection the old-fashioned way: copy <strong style="color:#4facfe;user-select:all">dhanyasukanth@gmail.com</strong>';
  document.body.appendChild(t);
  setTimeout(function(){t.style.opacity='0';setTimeout(function(){if(t.parentNode)t.remove();},500);},7000);
}
// RESUME TOAST
function showResumeToast(e){
  if(e)e.preventDefault();
  var url=this&&this.href?this.href:'./Dhanya_Sukanth_Resume.pdf';
  if(document.getElementById('resume-toast')){
    window.open(url,'_blank');return;
  }
  var t=document.createElement('div');
  t.id='resume-toast';
  t.style.cssText='position:fixed;bottom:88px;left:50%;transform:translateX(-50%);background:rgba(4,6,22,.96);border:1px solid rgba(167,139,250,.3);padding:14px 24px;border-radius:14px;font-family:JetBrains Mono,monospace;font-size:11.5px;color:#e8f4ff;z-index:9999;max-width:94vw;text-align:center;line-height:1.75;box-shadow:0 14px 48px rgba(0,0,0,.55);opacity:1;transition:opacity .5s';
  var isMobile=window.innerWidth<=768;
  t.innerHTML='&#128196; <strong style="color:#a78bfa">Read-only view.</strong> '+(isMobile?'Grab the actual PDF by scrolling down to the bottom.':'Grab the actual PDF by scrolling down or clicking the Resume button above.');
  document.body.appendChild(t);
  setTimeout(function(){window.open(url,'_blank');},3000);
  setTimeout(function(){t.style.opacity='0';setTimeout(function(){if(t.parentNode)t.remove();},500);},3500);
}
document.addEventListener('DOMContentLoaded',function(){
  var mailEl=document.getElementById('mail-link');
  if(mailEl){mailEl.addEventListener('click',showMailToast);}
  // mail-chip is now a plain mailto: link on mobile — no toast intercept needed
  var resumeChip=document.getElementById('resume-chip');
  if(resumeChip){resumeChip.addEventListener('click',showResumeToast);}
});
// MODE TIP — shown once on page load when user is in light mode
document.addEventListener('DOMContentLoaded',function(){
  setTimeout(function(){
    if(getTheme()!=='dark')return;
    if(document.getElementById('theme-tip'))return;
    var tip=document.createElement('div');
    tip.id='theme-tip';
    var btn=document.getElementById('theme-toggle-mob');
    if(!btn||btn.offsetParent===null)btn=document.getElementById('theme-toggle');
    var bRect=btn?btn.getBoundingClientRect():{bottom:60,right:window.innerWidth-16,left:window.innerWidth-58};
    var tipRight=Math.round(window.innerWidth-bRect.right);
    var btnCenterOffset=Math.round((bRect.right-bRect.left)/2);
    tip.style.cssText='position:fixed;top:'+(Math.round(bRect.bottom)+8)+'px;right:'+tipRight+'px;background:rgba(4,6,22,.93);border:1px solid rgba(79,172,254,.28);padding:10px 14px;border-radius:10px;font-family:JetBrains Mono,monospace;font-size:11px;color:#c8daf0;z-index:9999;pointer-events:none;opacity:0;transition:opacity .45s;line-height:1.6;max-width:200px;box-shadow:0 8px 32px rgba(0,0,0,.4)';
    tip.innerHTML='<div style="position:absolute;top:-6px;right:'+Math.max(4,btnCenterOffset-6)+'px;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid rgba(79,172,254,.28)"></div>&#9790; Dark mode available<br><span style="color:#4facfe;font-size:10px">Toggle in the nav above &#8593;</span>';
    document.body.appendChild(tip);
    setTimeout(function(){tip.style.opacity='1';},50);
    setTimeout(function(){tip.style.opacity='0';setTimeout(function(){if(tip.parentNode)tip.remove();},450);},18000);
  },3500);
});

// FLOW FIELD BACKGROUND
(function(){
  var cvs=document.getElementById('webgl-bg');
  if(!cvs)return;
  var ctx=cvs.getContext('2d');
  if(!ctx)return;
  var W,H,dpr=1,particles=[],animId,resizeTimer;
  var mouse={x:-9999,y:-9999};
  var lightVal=1,lightTarget=1,t=0;
  var dc=[160,170,255],lc=[90,110,230]; // dark/light particle base colors

  function pCount(){return W<768?150:W<1200?280:450;}

  function Particle(init){this.reset(init);}
  Particle.prototype.reset=function(init){
    this.x=Math.random()*W;this.y=Math.random()*H;
    this.vx=0;this.vy=0;
    this.age=init?Math.floor(Math.random()*300):0;
    this.life=Math.random()*250+150;
    this.seed=Math.random()*Math.PI*2; // unique random offset per particle
  };
  Particle.prototype.update=function(){
    // multi-frequency flow + time drift + per-particle seed = organic randomness
    var a=Math.sin(this.x*0.003+t*0.12+this.seed)*Math.PI
          +Math.cos(this.y*0.004-t*0.09+this.seed*0.7)*Math.PI*0.6
          +Math.sin((this.x+this.y)*0.002+t*0.06)*Math.PI*0.3;
    this.vx+=Math.cos(a)*0.12;this.vy+=Math.sin(a)*0.12;
    var dx=mouse.x-this.x,dy=mouse.y-this.y;
    var d=Math.sqrt(dx*dx+dy*dy),r=150;
    if(d<r){var f=(r-d)/r;this.vx-=dx*f*0.05;this.vy-=dy*f*0.05;}
    this.x+=this.vx;this.y+=this.vy;
    this.vx*=0.95;this.vy*=0.95;
    this.age++;
    if(this.age>this.life)this.reset(false);
    if(this.x<0)this.x=W;if(this.x>W)this.x=0;
    if(this.y<0)this.y=H;if(this.y>H)this.y=0;
  };
  Particle.prototype.draw=function(){
    var a=1-Math.abs((this.age/this.life)-0.5)*2;
    ctx.globalAlpha=Math.max(0,a);
    ctx.fillRect(this.x,this.y,1.0,1.0);
  };

  function setupCanvas(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    W=window.innerWidth;H=window.innerHeight;
    cvs.width=W*dpr;cvs.height=H*dpr;
    cvs.style.width=W+'px';cvs.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function init(){
    lightVal=lightTarget=document.documentElement.classList.contains('light')?1:0;
    setupCanvas();
    particles=[];
    var n=pCount();for(var i=0;i<n;i++)particles.push(new Particle(true));
  }

  function resize(){
    setupCanvas();
    var n=pCount();
    while(particles.length>n)particles.pop();
    while(particles.length<n)particles.push(new Particle(true));
  }

  function lerp3(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}

  function animate(){
    lightVal+=(lightTarget-lightVal)*0.04;
    ctx.globalAlpha=1;
    t+=0.016; // ~60fps time increment
    ctx.fillStyle=lightVal>0.5?'rgba(255,255,255,0.18)':'rgba(0,0,0,0.18)';
    ctx.fillRect(0,0,W,H);
    var c=lerp3(dc,lc,lightVal);
    var pa=lightVal>0.5?0.18:0.42; // much more subtle opacity
    ctx.fillStyle='rgba('+Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2])+','+pa+')';
    for(var i=0;i<particles.length;i++){particles[i].update();particles[i].draw();}
    ctx.globalAlpha=1;
    animId=requestAnimationFrame(animate);
  }

  window._setWebGLTheme=function(isLight){lightTarget=isLight?1:0;};

  window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;});
  document.addEventListener('mouseleave',function(){mouse.x=-9999;mouse.y=-9999;});
  window.addEventListener('touchmove',function(e){
    if(e.touches&&e.touches[0]){mouse.x=e.touches[0].clientX;mouse.y=e.touches[0].clientY;}
  },{passive:true});
  window.addEventListener('touchend',function(){mouse.x=-9999;mouse.y=-9999;},{passive:true});
  window.addEventListener('resize',function(){clearTimeout(resizeTimer);resizeTimer=setTimeout(resize,150);});

  init();
  animate();
})();
