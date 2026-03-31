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

var dot=document.getElementById('c-dot'),ring=document.getElementById('c-ring');
var mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function anim(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(anim)})();
document.querySelectorAll('a,button,.pc,.cc,.pill,.oi-wrap').forEach(function(el){
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
    document.body.classList.add('page-ready');
    initNameEffect();
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

// NAME PARTICLE REVEAL — full viewport scatter
function initNameEffect(){
  var cvs=document.getElementById('name-ptcl');
  if(!cvs)return;
  function run(){
    var ctx=cvs.getContext('2d');
    if(!ctx)return;
    var isLt=document.documentElement.classList.contains('light');
    var W=window.innerWidth,H=window.innerHeight;
    var dpr=Math.min(window.devicePixelRatio||1,2);
    // Make canvas full viewport
    cvs.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;opacity:1;';
    cvs.width=W*dpr; cvs.height=H*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    // Off-screen canvas — render name at hero center position
    var off=document.createElement('canvas');
    off.width=W*dpr; off.height=H*dpr;
    var octx=off.getContext('2d');
    octx.setTransform(dpr,0,0,dpr,0,0);
    var fs1=Math.min(Math.floor(W*0.135),105);
    var fs2=Math.min(Math.floor(W*0.112),88);
    var ny=H*0.37;
    octx.fillStyle='#fff';
    octx.textAlign='center'; octx.textBaseline='top';
    octx.font='800 '+fs1+'px "Clash Display",sans-serif';
    octx.fillText('Dhanya',W/2,ny);
    octx.font='700 '+fs2+'px "Clash Display",sans-serif';
    octx.fillText('Sukanth',W/2,ny+fs1*1.08);
    var imgData=octx.getImageData(0,0,W*dpr,H*dpr).data;
    var coords=[],step=Math.ceil(4*dpr);
    for(var i=0;i<imgData.length;i+=step*4){
      if(imgData[i+3]>128)coords.push({x:((i/4)%(W*dpr))/dpr,y:Math.floor((i/4)/(W*dpr))/dpr});
    }
    if(!coords.length)return;
    for(var j=coords.length-1;j>0;j--){var k=Math.floor(Math.random()*(j+1));var tmp=coords[j];coords[j]=coords[k];coords[k]=tmp;}
    var C=isLt?[18,86,180]:[79,172,254];
    var pts=[];
    for(var m=0;m<coords.length;m++){
      var sp=Math.random()*5+3;
      // scatter origin = entire visible viewport
      pts.push({x:Math.random()*W,y:Math.random()*H,vx:0,vy:0,tx:coords[m].x,ty:coords[m].y,sp:sp,f:sp*0.05,cw:0,cbr:Math.random()*0.02+0.005});
    }
    var alpha=1,fading=false,startTime=Date.now(),animId;
    function frame(){
      var now=Date.now();
      ctx.globalAlpha=0.16;
      ctx.fillStyle=isLt?'#f0f4f8':'#040610';
      ctx.fillRect(0,0,W,H);
      for(var i=0;i<pts.length;i++){
        var p=pts[i];
        var dx=p.tx-p.x,dy=p.ty-p.y;
        var dist=Math.sqrt(dx*dx+dy*dy)||0.001;
        var prox=dist<80?dist/80:1;
        var tx=(dx/dist)*p.sp*prox,ty=(dy/dist)*p.sp*prox;
        var sx=tx-p.vx,sy=ty-p.vy;
        var sm=Math.sqrt(sx*sx+sy*sy)||0.001;
        p.vx+=(sx/sm)*p.f; p.vy+=(sy/sm)*p.f;
        p.x+=p.vx; p.y+=p.vy;
        p.vx*=0.9; p.vy*=0.9;
        if(p.cw<1)p.cw=Math.min(p.cw+p.cbr,1);
        ctx.globalAlpha=p.cw*alpha;
        ctx.fillStyle='rgb('+C[0]+','+C[1]+','+C[2]+')';
        ctx.fillRect(p.x,p.y,2,2);
      }
      ctx.globalAlpha=1;
      if(!fading&&now-startTime>1600)fading=true;
      if(fading){
        alpha=Math.max(0,alpha-0.018);
        cvs.style.opacity=alpha;
        if(alpha<=0){cancelAnimationFrame(animId);cvs.style.display='none';return;}
      }
      animId=requestAnimationFrame(frame);
    }
    animId=requestAnimationFrame(frame);
  }
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(run);}else{setTimeout(run,120);}
}

// FLOW FIELD BACKGROUND — exact NeuralBackground algorithm (hero area)
(function(){
  var cvs=document.getElementById('webgl-bg');
  if(!cvs)return;
  var ctx=cvs.getContext('2d');
  if(!ctx)return;
  var W,H,dpr=1,particles=[],animId,resizeTimer,paused=false;
  var mouse={x:-1000,y:-1000};
  var speed=1;

  function isLt(){return document.documentElement.classList.contains('light');}
  function pColor(){return isLt()?'rgba(79,100,220,0.55)':'rgba(129,140,248,0.65)';}
  function tColor(){return isLt()?'rgba(240,244,248,0.15)':'rgba(0,0,0,0.15)';}
  function pCount(){return W<768?150:W<1200?350:600;}

  // Exact NeuralBackground Particle
  function Particle(){
    this.x=Math.random()*W; this.y=Math.random()*H;
    this.vx=0; this.vy=0;
    this.age=0; this.life=Math.random()*200+100;
  }
  Particle.prototype.update=function(){
    // EXACT src angle formula
    var angle=(Math.cos(this.x*0.005)+Math.sin(this.y*0.005))*Math.PI;
    this.vx+=Math.cos(angle)*0.2*speed;
    this.vy+=Math.sin(angle)*0.2*speed;
    // Mouse repulsion — exact src
    var dx=mouse.x-this.x,dy=mouse.y-this.y;
    var dist=Math.sqrt(dx*dx+dy*dy),ir=150;
    if(dist<ir){var f=(ir-dist)/ir;this.vx-=dx*f*0.05;this.vy-=dy*f*0.05;}
    this.x+=this.vx; this.y+=this.vy;
    this.vx*=0.95; this.vy*=0.95;
    this.age++;
    if(this.age>this.life){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=0;this.vy=0;this.age=0;this.life=Math.random()*200+100;}
    if(this.x<0)this.x=W; if(this.x>W)this.x=0;
    if(this.y<0)this.y=H; if(this.y>H)this.y=0;
  };
  Particle.prototype.draw=function(){
    // Exact src: fade in/out based on age
    ctx.globalAlpha=Math.max(0,1-Math.abs((this.age/this.life)-0.5)*2);
    ctx.fillRect(this.x,this.y,1.5,1.5);
  };

  function setupCanvas(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    W=window.innerWidth; H=window.innerHeight;
    cvs.width=W*dpr; cvs.height=H*dpr;
    cvs.style.width=W+'px'; cvs.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function init(){
    setupCanvas();
    particles=[];
    var n=pCount();
    for(var i=0;i<n;i++)particles.push(new Particle());
  }
  function animate(){
    if(paused){animId=requestAnimationFrame(animate);return;}
    ctx.fillStyle=tColor();
    ctx.globalAlpha=1;
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle=pColor();
    for(var i=0;i<particles.length;i++){particles[i].update();particles[i].draw();}
    ctx.globalAlpha=1;
    animId=requestAnimationFrame(animate);
  }

  // Pause when scrolled well past hero to save battery
  window.addEventListener('scroll',function(){paused=window.scrollY>H*1.2;},{passive:true});

  window._setWebGLTheme=function(){ctx.clearRect(0,0,W,H);};

  window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;});
  document.addEventListener('mouseleave',function(){mouse.x=-1000;mouse.y=-1000;});
  window.addEventListener('touchmove',function(e){
    if(e.touches&&e.touches[0]){mouse.x=e.touches[0].clientX;mouse.y=e.touches[0].clientY;}
  },{passive:true});
  window.addEventListener('touchend',function(){mouse.x=-1000;mouse.y=-1000;},{passive:true});
  window.addEventListener('resize',function(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(function(){
      setupCanvas();
      var n=pCount();
      while(particles.length>n)particles.pop();
      while(particles.length<n)particles.push(new Particle());
    },150);
  });

  init();
  animate();
})();
