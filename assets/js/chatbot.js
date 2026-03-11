// Chatbot knowledge base
var kb={
  skills:"Dhanya's core expertise is in Azure, AWS, and Terraform. He also works extensively with Ubuntu Linux, Grafana, Prometheus, OpenSearch, CloudWatch, and ServiceNow, alongside scripting in Python and Shell.",
  certs:"Dhanya currently holds three active certifications:\n\u2022 AWS Certified Cloud Practitioner (CLF-C02)\n\u2022 Microsoft Azure Fundamentals (AZ-900)\n\u2022 HashiCorp Terraform Associate 003\nAll are verified on Credly or Microsoft Learn.",
  open:"Yes, he is. Dhanya is open to new cloud and DevOps opportunities and would be pleased to connect. Feel free to message him on <a href='https://www.linkedin.com/in/dhanya-sukanth-b-k' target='_blank' style='color:var(--accent2);text-decoration:underline'>LinkedIn</a> or drop him an <a href='mailto:dhanyasukanth@gmail.com' style='color:var(--accent);text-decoration:underline'>email</a>.",
  contact:"He would be glad to hear from you. You can reach Dhanya directly on <a href='https://www.linkedin.com/in/dhanya-sukanth-b-k' target='_blank' style='color:var(--accent2);text-decoration:underline'>LinkedIn</a> or send an email to <a href='mailto:dhanyasukanth@gmail.com' style='color:var(--accent);text-decoration:underline'>dhanyasukanth@gmail.com</a>. He typically replies promptly.",
  connect:"It is great that you would like to connect. The best way to reach him for a quick chat is through <a href='https://www.linkedin.com/in/dhanya-sukanth-b-k' target='_blank' style='color:var(--accent2);text-decoration:underline'>LinkedIn</a>. For formal inquiries, sending an <a href='mailto:dhanyasukanth@gmail.com' style='color:var(--accent);text-decoration:underline'>email</a> works perfectly.",
  exp:"Dhanya is currently a <strong>Senior Cloud Engineer at Microland</strong> (March 2024 \u2013 present), managing GE's global MyApps infrastructure across Azure and AWS.\nPreviously, he worked as an <strong>IoT Engineer at Knowx Solutions</strong>, building connected solutions with AWS IoT Core.",
  edu:"He holds a <strong>Bachelor of Engineering in Electronics & Communication (B.E. ECE)</strong> from Visvesvaraya Technological University (VTU) in Bengaluru, India.",
  projects:"A few of his notable GitHub projects include:\n\u2022 <strong>Cloud Infra Automation</strong> (Terraform modules)\n\u2022 <strong>Monitoring Stack Setup</strong> (Grafana/Prometheus/OpenSearch)\n\u2022 <strong>IoT with AWS IoT Core</strong>\nYou can review his code at <a href='https://github.com/dhanyasukanth' target='_blank' style='color:var(--accent3);text-decoration:underline'>github.com/dhanyasukanth</a>.",
  bio:"Dhanya is a Senior Cloud Engineer based in Bengaluru, India. He specializes in Azure and AWS infrastructure, DevOps automation, Terraform IaC, and observability. He is always happy to connect and discuss cloud technologies.",
  location:"Dhanya is currently based in <strong>Bengaluru, India</strong>. He is also open to remote work opportunities.",
  hey:"Hello! I am Dhanya\u2019s portfolio assistant. How can I help you today? I can share information about his skills, experience, projects, or how to get in touch.",
  thanks:"You are very welcome. Please let me know if there is anything else I can assist you with. Have a wonderful day!",
  how_are_you:"I am doing well, thank you for asking. I am here and ready to help you learn more about Dhanya\u2019s work. What can I assist you with?",
  def:"I am happy to help. I can share details about Dhanya\u2019s skills, certifications, work experience, projects, or contact information. What would you like to know?"
};

function reply(m){
  var q=m.toLowerCase();
  if(q.match(/^(hey|hi|hello|good)/))return kb.hey;
  if(q.includes('thank'))return kb.thanks;
  if(q.includes('how are you'))return kb.how_are_you;
  if(q.includes('skill')||q.includes('tech')||q.includes('stack')||q.includes('tool'))return kb.skills;
  if(q.includes('cert')||q.includes('badge')||q.includes('aws')||q.includes('azure')||q.includes('terraform'))return kb.certs;
  if(q.includes('hire')||q.includes('open')||q.includes('job')||q.includes('opportunit')||q.includes('available')||q.includes('recruit'))return kb.open;
  if(q.includes('project')||q.includes('github')||q.includes('repo'))return kb.projects;
  if(q.includes('edu')||q.includes('degree')||q.includes('college')||q.includes('university')||q.includes('vtu')||q.includes('study'))return kb.edu;
  if(q.includes('connect')||q.includes('reach')||q.includes('dm'))return kb.connect;
  if(q.includes('contact')||q.includes('email')||q.includes('linkedin')||q.includes('gmail'))return kb.contact;
  if(q.includes('exp')||q.includes('work')||q.includes('microland')||q.includes('career')||q.includes('role'))return kb.exp;
  if(q.includes('locat')||q.includes('where')||q.includes('bengaluru')||q.includes('india'))return kb.location;
  if(q.includes('who')||q.includes('about')||q.includes('bio')||q.includes('dhanya'))return kb.bio;
  return kb.def;
}

function toggleChat(){document.getElementById('chatwin').classList.toggle('open')}

function addMsg(t,f){
  var m=document.getElementById('chm'),d=document.createElement('div');
  d.className='msg '+f;
  if(f==='bot'){d.innerHTML=t.replace(/\n/g,'<br>');}
  else{d.textContent=t;}
  m.appendChild(d);m.scrollTop=m.scrollHeight;
}

function showTyp(){
  var m=document.getElementById('chm'),d=document.createElement('div');
  d.className='msg bot typ';d.id='typ';
  d.innerHTML='<span></span><span></span><span></span>';
  m.appendChild(d);m.scrollTop=m.scrollHeight;
}

function sendMsg(){
  var inp=document.getElementById('chinp'),t=(inp.value||'').trim();
  if(!t)return;
  addMsg(t,'usr');
  inp.value='';
  document.getElementById('chq').style.display='none';
  showTyp();
  setTimeout(function(){var ti=document.getElementById('typ');if(ti)ti.remove();addMsg(reply(t),'bot');},750);
}

function qa(q){
  document.getElementById('chq').style.display='none';
  addMsg(q,'usr');
  showTyp();
  setTimeout(function(){var ti=document.getElementById('typ');if(ti)ti.remove();addMsg(reply(q),'bot');},750);
}

// Quick replies
document.addEventListener('DOMContentLoaded',function(){
  var qbEducation=document.createElement('button');
  qbEducation.className='qb';qbEducation.textContent='Education';
  qbEducation.onclick=function(){qa('Tell me about his education');};
  var chq=document.getElementById('chq');
  if(chq)chq.appendChild(qbEducation);
});
