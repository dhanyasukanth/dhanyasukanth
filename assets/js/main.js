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

// STARS
(function(){
  var c=document.getElementById('star-canvas');
  function resize(){c.width=window.innerWidth;c.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  var ctx=c.getContext('2d');
  var stars=[];
  for(var i=0;i<280;i++){
    stars.push({
      x:Math.random()*window.innerWidth,
      y:Math.random()*window.innerHeight,
      r:Math.random()*1.6+.3,
      o:Math.random()*.9+.1,
      s:Math.random()*.8+.4
    });
  }
  var frame=0;
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    frame++;
    stars.forEach(function(s){
      ctx.beginPath();
      var twinkle=s.o*(0.6+0.4*Math.sin(frame*0.025*s.s+s.x));
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle='rgba(200,220,255,'+twinkle+')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
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
  if(!l)return;
  l.style.opacity='0';
  l.style.visibility='hidden';
  l.style.pointerEvents='none';
  setTimeout(function(){l.style.display='none'},600);
}
setTimeout(dismissLoader,3000);
setTimeout(function(){
  var l=document.getElementById('loader');
  if(l){l.style.display='none';}
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
setTimeout(type,3400);

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
  },1400);
});

// FLOW FIELD BACKGROUND
(function(){
  var cvs=document.getElementById('webgl-bg');
  if(!cvs)return;
  var ctx=cvs.getContext('2d');
  if(!ctx)return;
  var W,H,dpr=1,particles=[],animId,resizeTimer;
  var mouse={x:-9999,y:-9999};
  var lightVal=1,lightTarget=1;
  var dc=[129,140,248],lc=[79,100,220]; // dark/light particle base colors

  function pCount(){return W<768?200:W<1200?350:600;}

  function Particle(init){this.reset(init);}
  Particle.prototype.reset=function(init){
    this.x=Math.random()*W;this.y=Math.random()*H;
    this.vx=0;this.vy=0;
    this.age=init?Math.floor(Math.random()*300):0;
    this.life=Math.random()*200+100;
  };
  Particle.prototype.update=function(){
    var a=(Math.cos(this.x*0.005)+Math.sin(this.y*0.005))*Math.PI;
    this.vx+=Math.cos(a)*0.16;this.vy+=Math.sin(a)*0.16;
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
    ctx.fillRect(this.x,this.y,1.5,1.5);
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
    ctx.fillStyle=lightVal>0.5?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.12)';
    ctx.fillRect(0,0,W,H);
    var c=lerp3(dc,lc,lightVal);
    var pa=lightVal>0.5?0.45:0.85;
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
