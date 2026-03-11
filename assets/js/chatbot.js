// Chatbot knowledge base
var kb={
  skills:"Dhanya's core stack: Azure, AWS, Terraform, Ubuntu Linux, Grafana, Prometheus, OpenSearch, CloudWatch, ServiceNow, ITIL, Shell scripting, Python, LDAP, Zscaler, DNS/VPN configuration, Wireshark, MQTT, C, Fiddler, HAR analysis.",
  certs:"Dhanya holds three active certifications:\n\u2022 AWS Certified Cloud Practitioner (CLF-C02)\n\u2022 Microsoft Azure Fundamentals (AZ-900)\n\u2022 HashiCorp Terraform Associate 003\nAll verified on Credly or Microsoft Learn. He's actively expanding his certification portfolio \u2014 more coming soon!",
  open:"Absolutely! Dhanya is actively open to cloud and DevOps opportunities, including international roles. Feel free to reach out on <a href='https://www.linkedin.com/in/dhanya-sukanth-b-k' target='_blank' style='color:var(--accent2)'>LinkedIn</a> or drop him an <a href='mailto:dhanyasukanth@gmail.com' style='color:var(--accent)'>email</a> \u2014 he'd love to connect!",
  contact:"You can reach Dhanya on <a href='https://www.linkedin.com/in/dhanya-sukanth-b-k' target='_blank' style='color:var(--accent2)'>LinkedIn</a> or via email at <a href='mailto:dhanyasukanth@gmail.com' style='color:var(--accent)'>dhanyasukanth@gmail.com</a>. He typically responds promptly!",
  connect:"The easiest way is a message on <a href='https://www.linkedin.com/in/dhanya-sukanth-b-k' target='_blank' style='color:var(--accent2)'>LinkedIn</a> for a quick chat, or an <a href='mailto:dhanyasukanth@gmail.com' style='color:var(--accent)'>email</a> for anything more detailed. Both are in the Contact section below!",
  exp:"Dhanya is currently a <strong>Senior Cloud Engineer at Microland</strong> (March 2024 \u2013 present), managing GE's global MyApps infrastructure across Azure & AWS \u2014 including ServiceNow operations, Terraform IaC, Grafana/Prometheus monitoring, and LDAP/Zscaler support.\nPreviously, he was an <strong>IoT Engineer at Knowx Solutions</strong> (Dec 2023 \u2013 Apr 2024), building AWS IoT Core + MQTT solutions with C and Python.",
  edu:"Dhanya holds a <strong>Bachelor of Engineering in Electronics & Communication (B.E. ECE)</strong> from Visvesvaraya Technological University (VTU), Bengaluru, India.",
  projects:"Notable GitHub projects:\n\u2022 <strong>Cloud Infra Automation</strong> \u2014 Terraform modules for Azure & AWS provisioning\n\u2022 <strong>Monitoring Stack Setup</strong> \u2014 Grafana + Prometheus + OpenSearch observability\n\u2022 <strong>IoT with AWS IoT Core</strong> \u2014 MQTT connected-device solutions (C + Python)\nSee more at <a href='https://github.com/dhanyasukanth' target='_blank' style='color:var(--accent3)'>github.com/dhanyasukanth</a>.",
  bio:"Dhanya Sukanth B.K. is a Senior Cloud Engineer based in Bengaluru, India. He specialises in Azure & AWS infrastructure, DevOps automation, Terraform IaC, monitoring, and ITSM \u2014 with a background in IoT and embedded systems. He holds three active cloud certifications and is open to international cloud/DevOps opportunities.",
  location:"Dhanya is based in <strong>Bengaluru, India</strong> and is open to remote or relocation opportunities, including international roles.",
  hey:"Hey, thanks for stopping by \u2014 hope you're having a great day! \ud83d\ude0a I'm Dhanya's portfolio assistant. I can tell you about his skills, certifications, experience, or how to get in touch. What would you like to know?",
  def:"Happy to help! I can share details about Dhanya's skills, certifications, work experience, education, projects, or contact info. What are you curious about?"
};

function reply(m){
  var q=m.toLowerCase();
  if(q.match(/^(hey|hi|hello|good)/))return kb.hey;
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
