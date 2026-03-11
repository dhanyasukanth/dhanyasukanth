// THEME TOGGLE — defaults to dark (better loader experience; light on explicit toggle)
function getTheme(){return localStorage.getItem('theme')||'dark';}
function applyTheme(t){
  document.body.classList.toggle('light',t==='light');
  // sync all toggle indicators
  var balls=document.querySelectorAll('#mob-tog-ball,#mob-tog-ball2');
  balls.forEach(function(b){b.style.transform=t==='light'?'translateX(18px)':'';b.style.background=t==='light'?'var(--accent2)':'var(--accent)';});
  localStorage.setItem('theme',t);
}
function toggleTheme(){applyTheme(getTheme()==='dark'?'light':'dark');}
applyTheme(getTheme());
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
document.getElementById('ham').addEventListener('click',function(){document.getElementById('mobn').classList.toggle('open')});
function closeMob(){document.getElementById('mobn').classList.remove('open')}

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
var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('on')})},{threshold:.08,rootMargin:'0px 0px -50px 0px'});
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
    ios.unobserve(el);
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
