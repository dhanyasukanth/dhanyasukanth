/* Portfolio assistant: an offline, rule-based assistant with a friendly voice.
   - Facts come from Dhanya's résumé; the jokes are its own.
   - No network calls, no storage: everything runs in the visitor's browser.
   - Replies are built with DOM nodes and textContent only (no innerHTML anywhere),
     so nothing a visitor types can ever be interpreted as markup.
   - Matching: weighted keyword/phrase scoring with light stemming and typo tolerance. */
(function () {
  'use strict';

  var RESUME = './Dhanya_Sukanth_Resume.pdf';
  var LINKEDIN = 'https://www.linkedin.com/in/dhanya-sukanth-b-k';
  var GITHUB = 'https://github.com/dhanyasukanth';
  var EMAIL = 'dhanyasukanth@gmail.com';

  // Reusable action buttons
  var ACT = {
    download: { t: 'Download résumé', h: RESUME, dl: 'Dhanya_Sukanth_Resume.pdf' },
    view: { t: 'Open résumé', h: RESUME, x: 1 },
    email: { t: 'Send an email', h: 'mailto:' + EMAIL },
    linkedin: { t: 'LinkedIn', h: LINKEDIN, x: 1 },
    github: { t: 'GitHub', h: GITHUB, x: 1 },
    secExp: { t: 'See experience', h: '#experience' },
    secSkills: { t: 'See skills', h: '#about' },
    secCerts: { t: 'See certifications', h: '#certs' },
    secProjects: { t: 'See projects', h: '#projects' }
  };

  // Chip labels for follow-up suggestions
  var LABEL = {
    about: 'About Dhanya', current: 'Current role', ge: 'GE MyApps role', iot: 'IoT role',
    experience: 'Experience', years: 'Years of experience', skills: 'Skills', certs: 'Certifications',
    contact: 'Contact', resume: 'Résumé', waf: 'Application security', monitoring: 'Monitoring',
    aws: 'AWS', azure: 'Azure', terraform: 'Terraform', linux: 'Linux', ssl: 'SSL/TLS', dns: 'DNS',
    network: 'Networking', itsm: 'ServiceNow and ITSM', debug: 'Troubleshooting', support: 'Support',
    scripting: 'Scripting', edu: 'Education', open: 'Availability', location: 'Location',
    projects: 'Projects', strengths: 'Key strengths', clients: 'Clients', topics: 'All topics', joke: 'Tell me a joke'
  };

  /* ---------- Knowledge base ----------
     Facts come from the résumé; the tone is warm and a little playful.
     p: paragraphs, v: rotating variants for the first paragraph, l: bullet list,
     a: action buttons, n: suggested next topics */
  var KB = {
    about: {
      p: ['Dhanya Sukanth B.K. is a Cloud Administrator at Microland in Bengaluru, with over two years in cloud infrastructure, application security and production support.', 'He has kept things running for global names like General Electric and Baker Hughes, and picked up AWS, Azure and Terraform certifications along the way. Not bad for someone who started out wiring up IoT devices!'],
      n: ['current', 'experience', 'skills', 'contact']
    },
    current: {
      p: ['Right now Dhanya is a Cloud Administrator at Microland, looking after application security for Baker Hughes since September 2026. Think of him as the friendly doorman for web applications:'],
      l: ['Manages the Akamai, Imperva Cloud WAF and SecureSphere platforms across cloud and on-premises environments', 'Onboards and decommissions applications in a secure, compliant way', 'Manages SSL/TLS certificates and troubleshoots DNS', 'Resolves application traffic, DNS and WAF issues with infrastructure and security teams'],
      a: [ACT.secExp], n: ['ge', 'waf', 'skills', 'contact']
    },
    ge: {
      p: ['Before that, Dhanya spent two and a half years (March 2024 to August 2026) as a Senior Cloud Engineer at Microland, keeping General Electric’s MyApps global infrastructure healthy across production and stage. The highlights:'],
      l: ['Built and maintained the monitoring stack: OpenSearch, Alert Manager and Grafana, with Prometheus as the data source', 'Server health checks, patching, updates and security maintenance', 'AWS monitoring with the Management Console, CloudTrail, AWS Config and CloudWatch', 'Zscaler proxy, VPN and DNS troubleshooting', 'ServiceNow incidents, changes and requests, including compliance audits', 'Escalation handling and client communication with clear SLA ownership'],
      a: [ACT.secExp], n: ['current', 'monitoring', 'aws', 'iot']
    },
    iot: {
      p: ['Every cloud engineer starts on the ground! Dhanya began as an IoT Engineer at Knowx Solutions in Bengaluru, from December 2023 to March 2024:'],
      l: ['Worked on embedded systems using C and Python', 'Integrated devices with AWS IoT Core, MQTT and Blynk', 'Built solutions to client requirements and delivered them on schedule with the team'],
      n: ['ge', 'current', 'skills']
    },
    experience: {
      p: ['Here is the journey so far, newest first:'],
      l: ['Cloud Administrator, Microland (client: Baker Hughes), September 2026 to present', 'Senior Cloud Engineer, Microland (client: General Electric), March 2024 to August 2026', 'IoT Engineer, Knowx Solutions, December 2023 to March 2024'],
      a: [ACT.secExp, ACT.download], n: ['current', 'ge', 'iot', 'skills']
    },
    years: {
      p: ['Over two years in cloud roles at Microland (since March 2024), plus an IoT engineering role before that, from December 2023. Long enough to learn that when something breaks, it is usually DNS.'],
      n: ['experience', 'current', 'skills']
    },
    clients: {
      p: ['Through Microland, Dhanya has looked after two global enterprises:'],
      l: ['Baker Hughes: application security with Akamai, Imperva Cloud WAF and SecureSphere (September 2026 to present)', 'General Electric: the MyApps global infrastructure (March 2024 to August 2026)'],
      n: ['current', 'ge', 'skills']
    },
    skills: {
      p: ['Quite a toolbox! Here is what Dhanya works with:'],
      l: ['Cloud and infrastructure: AWS, Microsoft Azure, Terraform, on-premises data centres', 'Application security: Akamai, Imperva Cloud WAF, SecureSphere', 'Monitoring: Grafana, Prometheus, Alert Manager, OpenSearch', 'Networking: Zscaler / Private PZEN, DNS, VPN', 'Systems and scripting: Linux (Ubuntu), Python, shell scripting, Docker', 'ITSM and debugging: ServiceNow, ITIL, Wireshark, Fiddler, HAR analysis'],
      a: [ACT.secSkills], n: ['waf', 'monitoring', 'aws', 'certs']
    },
    aws: {
      p: ['AWS is home turf. On GE MyApps, Dhanya monitored resources with the AWS Management Console, CloudTrail and AWS Config, and managed alerts and log data with CloudWatch. In his IoT days he worked with AWS IoT Core too.', 'He is also an AWS Certified Cloud Practitioner (CLF-C02), so it is official.'],
      n: ['azure', 'terraform', 'monitoring', 'certs']
    },
    azure: {
      p: ['Azure is in the toolkit too: it is listed among Dhanya’s cloud skills, and he holds the Microsoft Azure Fundamentals (AZ-900) certification.', 'I will be honest, though: most of the hands-on production stories on his résumé are AWS ones. For Azure specifics, he is the best person to ask.'],
      n: ['aws', 'terraform', 'certs', 'contact']
    },
    terraform: {
      p: ['Dhanya is a HashiCorp Certified Terraform Associate (004), and Terraform sits among his core infrastructure skills. Infrastructure as code: because clicking the same button forty times is nobody’s hobby.'],
      n: ['aws', 'certs', 'skills']
    },
    linux: {
      p: ['Linux (Ubuntu) is daily business for Dhanya. On GE MyApps that meant health checks, patching, updates, security maintenance and the occasional disk clean-up to keep production and stage happy. Servers are a bit like houseplants: they do better with regular care.'],
      n: ['monitoring', 'scripting', 'support']
    },
    monitoring: {
      p: ['Now you are talking! Monitoring is one of Dhanya’s strongest areas. On GE MyApps he:'],
      l: ['Built and maintained a stack of OpenSearch, Alert Manager and Grafana', 'Used Prometheus as the data source for Grafana dashboards', 'Set up alerts for proactive issue detection', 'Moved Prometheus Alert Manager alerts into Grafana dashboards for better readability', 'Managed log data with AWS CloudWatch'],
      n: ['aws', 'linux', 'itsm']
    },
    waf: {
      p: ['Application security is Dhanya’s current focus. For Baker Hughes he manages three platforms across cloud and on-premises environments: Akamai, Imperva Cloud WAF and SecureSphere.', 'That covers onboarding and decommissioning applications, SSL/TLS certificates, and untangling traffic, DNS and WAF issues with infrastructure and security teams. When suspicious traffic knocks, he is the one who checks the guest list.'],
      n: ['ssl', 'dns', 'current']
    },
    ssl: {
      p: ['Dhanya handles SSL/TLS certificate management for applications behind Akamai and Imperva, so the padlock in the browser stays locked and nobody gets a scary expiry warning on a Monday morning.'],
      n: ['waf', 'dns', 'current']
    },
    dns: {
      p: ['Ah, DNS. It is always DNS! Dhanya troubleshoots DNS resolution in his current role, and on GE MyApps he validated DNS configurations and worked with DNS teams on domain setup and resolution issues.'],
      n: ['network', 'waf', 'debug']
    },
    network: {
      p: ['On the networking side, Dhanya has:'],
      l: ['Troubleshot Zscaler proxy issues', 'Managed URL classification policies (Zscaler / Private PZEN) through Policy Admin', 'Maintained web proxies and VPN connections', 'Validated DNS configurations with DNS teams'],
      n: ['dns', 'debug', 'waf']
    },
    docker: {
      p: ['Docker is on Dhanya’s résumé under automation and CI/CD tools. The résumé keeps the details in a container (sorry!), so he is the best person to ask about specific projects.'],
      a: [ACT.email], n: ['skills', 'scripting', 'contact']
    },
    scripting: {
      p: ['Dhanya scripts in Python and shell, and wrote C and Python for embedded systems in his IoT days. If a task has to be done twice, there is a good chance a script does it the third time.'],
      n: ['linux', 'iot', 'skills']
    },
    itsm: {
      p: ['Dhanya knows his way around ServiceNow and ITIL, the process that keeps production calm:'],
      l: ['Incident, change, problem and request handling', 'Incident response plans and change management', 'SLA tracking and ownership', 'Audits of incidents, changes and requests for accuracy and compliance', 'Server decommissions tracked through problem incidents'],
      n: ['support', 'monitoring', 'experience']
    },
    debug: {
      p: ['When something breaks, Dhanya reaches for Wireshark, Fiddler, HAR files and application logs, and follows the packets until the culprit owns up.'],
      n: ['network', 'dns', 'support']
    },
    support: {
      p: ['Dhanya has provided L3 production support, which means the tricky ones land on his desk:'],
      l: ['Handling escalations and client communication with clear SLA ownership', 'Working with L4 advisors to meet SLAs', 'Writing documentation and knowledge base articles for L1, L1.5 and L2 teams'],
      n: ['itsm', 'debug', 'experience']
    },
    certs: {
      p: ['Three shiny ones! Dhanya holds:'],
      l: ['AWS Certified Cloud Practitioner (CLF-C02)', 'Microsoft Azure Fundamentals (AZ-900)', 'HashiCorp Certified: Terraform Associate (004)'],
      a: [ACT.secCerts], n: ['aws', 'azure', 'terraform', 'edu']
    },
    edu: {
      p: ['Dhanya holds a Bachelor of Engineering (B.E.) in Electronics and Communication from Visvesvaraya Technological University (VTU), Bengaluru, from August 2019 to June 2023. From circuits to clouds!'],
      n: ['certs', 'experience', 'skills']
    },
    strengths: {
      p: ['Happy to brag on his behalf! A few things that stand out:'],
      l: ['Production experience with two global enterprises, GE and Baker Hughes', 'Breadth across cloud operations, monitoring, application security and networking', 'Disciplined ITSM practice: SLA ownership, audits and clear documentation', 'Three certifications across AWS, Azure and Terraform'],
      a: [ACT.download], n: ['experience', 'skills', 'contact']
    },
    open: {
      p: ['Good news: Dhanya is open to hearing about new opportunities in cloud infrastructure, application security and DevOps. A quick email or LinkedIn message is the best way to start the conversation.'],
      a: [ACT.email, ACT.linkedin, ACT.download], n: ['location', 'strengths', 'experience']
    },
    terms: {
      p: ['That is one for Dhanya himself. Compensation, notice period and work authorisation are best discussed with him directly, and he is always happy to talk.'],
      a: [ACT.email, ACT.linkedin], n: ['open', 'location', 'resume']
    },
    location: {
      p: ['Dhanya is based in Bengaluru, India, and is open to discussing relocation and international roles. The cloud does not mind where you log in from!'],
      a: [ACT.email], n: ['open', 'contact', 'experience']
    },
    contact: {
      p: ['He would love to hear from you! Reach Dhanya at ' + EMAIL + ' or on LinkedIn. LinkedIn is great for a quick hello; email works better for the detailed stuff.'],
      a: [ACT.email, ACT.linkedin], n: ['resume', 'open', 'location']
    },
    phone: {
      p: ['Email or LinkedIn is the best first step, and Dhanya will happily set up a call from there.'],
      a: [ACT.email, ACT.linkedin], n: ['resume', 'open']
    },
    resume: {
      p: ['Here you go! Dhanya’s résumé as a PDF. Download saves it wherever your browser normally keeps downloads, or you can open it in a new tab to read first.'],
      a: [ACT.download, ACT.view], n: ['experience', 'skills', 'contact']
    },
    projects: {
      p: ['Dhanya’s code lives on GitHub. The projects section of this page highlights infrastructure automation, a monitoring stack, and IoT with AWS IoT Core. Have a look around!'],
      a: [ACT.github, ACT.secProjects], n: ['skills', 'iot', 'contact']
    },
    site: {
      p: ['Handmade! This site is plain HTML, CSS and JavaScript: no frameworks, no third-party code, and every file is served from the site itself. Simple, fast and nothing to break.'],
      n: ['privacy', 'projects', 'about']
    },
    privacy: {
      p: ['Your secrets are safe with me. This site sets no cookies, uses no trackers and makes no third-party requests. I run entirely in your browser, so nothing you type goes anywhere.'],
      n: ['site', 'about', 'contact']
    },
    bot: {
      p: ['I am a small, friendly, rule-based assistant, not an AI model. I know Dhanya’s résumé by heart and not much else, and I live entirely in your browser. Small brain, big enthusiasm!'],
      n: ['about', 'skills', 'joke']
    },
    hobbies: {
      p: ['Outside work, Dhanya enjoys building side projects (this portfolio is one of them) and has a soft spot for cars. For everything else, you will have to ask him over a coffee.'],
      n: ['projects', 'about', 'contact']
    },
    joke: {
      v: [
        'Why did the engineer bring a ladder to work? To reach the cloud. ☁️',
        'Why do programmers prefer dark mode? Because light attracts bugs!',
        'A DNS joke walks into a bar… it may take up to 48 hours for everyone to get it.',
        'I would tell you a UDP joke, but you might not get it.',
        'There are only two hard things in IT: naming things, cache invalidation, and off-by-one errors.',
        'Why was the firewall so calm? It had excellent boundaries.'
      ],
      n: ['joke', 'about', 'skills']
    },
    greet: {
      v: ['Hello there! 👋 Lovely to meet you. What would you like to know about Dhanya?', 'Hey! Great to see you. Ask away: experience, skills, certifications, or shall I warm up with a joke?'],
      n: ['current', 'skills', 'certs', 'joke']
    },
    howru: {
      p: ['Running at 100% uptime, thank you for asking! I hope your day is going well too. What can I tell you about Dhanya?'],
      n: ['current', 'skills', 'certs', 'joke']
    },
    thanks: {
      v: ['You are very welcome! Anything else I can dig up for you?', 'My pleasure! That is what I am here for. Anything else?', 'Any time! Happy to help.'],
      n: ['resume', 'contact', 'joke']
    },
    no: {
      p: ['No problem at all! I will be right here if you think of something.'],
      n: ['resume', 'contact']
    },
    bye: {
      p: ['Thanks for stopping by, it was lovely chatting! If you would like to follow up, Dhanya is just an email or a LinkedIn message away. 👋'],
      a: [ACT.email, ACT.linkedin], n: ['resume']
    },
    topics: {
      p: ['Here is everything I can help with. Pick a topic, or just ask in your own words, like “What does he do at Baker Hughes?” or “Does he know Grafana?”'],
      n: ['about', 'current', 'experience', 'skills', 'certs', 'edu', 'open', 'location', 'resume', 'contact', 'joke']
    },
    fallback: {
      v: ['Hmm, that one is beyond me! I only know what is on Dhanya’s résumé. Try one of these, or ask him directly.', 'Good question, but I am stumped. My knowledge begins and ends with Dhanya’s résumé. Maybe one of these?', 'You have found the edge of my little brain! I can help with the topics below, or you can ask Dhanya himself.'],
      a: [ACT.email], n: ['about', 'experience', 'skills', 'certs', 'contact']
    }
  };

  // First message: a warm welcome that matches the visitor's time of day.
  function intro() {
    var h = new Date().getHours();
    var hello = h < 5 ? 'Hello, night owl' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    return {
      p: [hello + '! 👋 Welcome. I am Dhanya’s portfolio assistant, and I promise I am friendlier than most firewalls.', 'Ask me about his experience, skills or certifications, or how to reach him. I also know a few cloud jokes, if you are feeling brave.'],
      n: ['current', 'skills', 'certs', 'resume', 'joke']
    };
  }

  /* ---------- Intent keywords: [intent, base weight, 'phrase|phrase|...'] ----------
     A phrase scores base + 1 for each extra word, so specific phrases beat single words.
     Order matters only for ties (earlier wins). Pronouns are normalised to he/his/him first. */
  var RULES = [
    ['current', 3, 'baker hughes|baker|current role|current job|current position|currently|right now|these days|latest role|cloud administrator|administrator|what does he do|where does he work|where is he working|work at|works at|working at|present role|day to day'],
    ['ge', 3, 'ge|general electric|myapps|my apps|senior cloud engineer|previous role|previous job|last role|earlier role|before that|before'],
    ['iot', 3, 'iot|knowx|embedded|mqtt|blynk|iot core|firmware|first job|internet of things'],
    ['years', 3, 'how many years|how long|years of experience|year of experience|total experience|how experienced|years'],
    ['clients', 3, 'client|customer|which companies|worked for|enterprise'],
    ['certs', 3, 'certification|certified|cert|credential|badge|exam|clf|clf-c02|az-900|az900|cloud practitioner|practitioner|fundamentals|terraform associate'],
    ['certs', 2, 'certificate'],
    ['aws', 3, 'aws|amazon|amazon web services|cloudtrail|aws config'],
    ['azure', 3, 'azure|microsoft azure|microsoft'],
    ['terraform', 3, 'terraform|hashicorp|iac|infrastructure as code'],
    ['linux', 3, 'linux|ubuntu|server|patching|patch|operating system|sysadmin'],
    ['monitoring', 3, 'grafana|prometheus|alertmanager|alert manager|opensearch|cloudwatch|monitoring|observability|dashboard|alerting|alert|logging'],
    ['waf', 3, 'akamai|imperva|securesphere|sphere|waf|firewall|web application firewall|application security|appsec|onboarding|decommissioning|decommission'],
    ['waf', 2, 'security'],
    ['ssl', 3, 'ssl|tls|https|certificate management|ssl certificate|tls certificate'],
    ['dns', 3, 'dns|domain|domain name'],
    ['network', 3, 'zscaler|pzen|proxy|vpn|network|networking|url policy|url classification'],
    ['docker', 3, 'docker|container|ci/cd|cicd|pipeline'],
    ['scripting', 3, 'python|shell|bash|scripting|script|programming|coding|programming language'],
    ['itsm', 3, 'servicenow|service now|itil|itsm|incident|change management|sla|ticket|ticketing|problem management|audit|compliance'],
    ['debug', 3, 'wireshark|fiddler|har|debug|debugging|troubleshoot|troubleshooting|packet'],
    ['support', 3, 'l3|l2|l1|l4|production support|support|escalation|on call|on-call|documentation|knowledge base'],
    ['edu', 3, 'education|degree|college|vtu|university|study|studied|graduate|graduated|graduation|qualification|b.e|btech|b.tech|visvesvaraya|electronics'],
    ['strengths', 3, 'why hire|why should|strength|strongest|stand out|best at|unique|achievement|accomplishment'],
    ['skills', 2, 'skill|tech stack|stack|tool|technology|technologies|expertise|good at|tech|specialise|specialize|speciality|specialty|devops|cloud|know'],
    ['experience', 2, 'experience|career|work history|background|timeline|job|role|worked|employment|company|employer|microland|history|position'],
    ['resume', 3, 'resume|cv|pdf|download|curriculum vitae'],
    ['phone', 3, 'phone|call|mobile|whatsapp|telephone|phone number'],
    ['contact', 3, 'contact|reach|email|e-mail|mail|gmail|linkedin|get in touch|connect|message|dm'],
    ['terms', 3, 'salary|ctc|compensation|notice period|notice|package|visa|sponsorship|expected pay|work authorisation|work authorization'],
    ['open', 3, 'hire|hiring|open to work|opportunity|opportunities|recruit|recruiter|recruiting|recruitment|interview|available|availability|vacancy|opening|job offer|looking for'],
    ['location', 3, 'relocate|relocation|remote|location|located|where|bengaluru|bangalore|india|city|based|timezone|time zone|hybrid|onsite|abroad|international'],
    ['projects', 3, 'project|github|repo|repository|repositories|open source|side project|source code'],
    ['site', 3, 'website|site|this page|portfolio|how was this built|framework'],
    ['privacy', 3, 'privacy|cookie|tracking|tracker|stored|personal data'],
    ['bot', 3, 'who are you|what are you|your name|are you ai|are you a bot|are you human|are you real|chatgpt|llm|ai|bot|robot|gpt'],
    ['hobbies', 3, 'hobby|hobbies|free time|spare time|weekend|outside work|interest|car'],
    ['joke', 3, 'joke|funny|pun|laugh|another one|one more|make me smile|cheer me up'],
    ['about', 3, 'who is he|about he|about him|summary|introduce|introduction|bio|overview|profile'],
    ['about', 1, 'about'],
    ['howru', 3, 'how are you|how r u|whats up|how is it going'],
    ['thanks', 2, 'thanks|thank you|thank|thx|appreciate|helpful|great|awesome|nice|cool|perfect|good'],
    ['bye', 2, 'bye|goodbye|see you|cya|exit|quit'],
    ['no', 2, 'no|nope|nah|nothing|never mind'],
    ['topics', 2, 'help|topic|what can you do|what can i ask|menu|option|more|yes|ok|okay|sure|anything else'],
    ['greet', 1, 'hi|hello|hey|hii|good morning|good afternoon|good evening|namaste|howdy|greetings']
  ];

  // Common technologies that are NOT on the résumé: answered honestly instead of guessed at.
  var UNLISTED = {
    containers: ['kubernetes', 'k8s', 'helm', 'openshift', 'argocd', 'eks', 'aks'],
    automation: ['jenkins', 'ansible', 'puppet', 'chef', 'gitlab', 'github actions', 'azure devops', 'cloudformation', 'pulumi', 'bicep'],
    cloud: ['gcp', 'google cloud', 'oracle cloud', 'oci', 'alibaba cloud'],
    monitoring: ['splunk', 'datadog', 'dynatrace', 'new relic', 'nagios', 'zabbix', 'elk', 'kibana'],
    security: ['cloudflare', 'f5', 'palo alto', 'fortinet', 'fortigate', 'checkpoint', 'crowdstrike', 'okta'],
    code: ['java', 'javascript', 'typescript', 'react', 'angular', 'node', 'node.js', 'golang', 'rust', 'c++', 'c#', '.net', 'php', 'ruby', 'powershell', 'sql', 'mysql', 'postgres', 'postgresql', 'mongodb', 'kafka', 'redis', 'windows server', 'active directory', 'ldap']
  };
  var NEAR = {
    containers: ['Docker is the container tool listed.', ['docker', 'skills', 'contact']],
    automation: ['The listed automation tools are Terraform, Docker, Python and shell scripting.', ['terraform', 'docker', 'scripting']],
    cloud: ['The listed cloud platforms are AWS and Microsoft Azure.', ['aws', 'azure', 'certs']],
    monitoring: ['The listed monitoring tools are Grafana, Prometheus, Alert Manager and OpenSearch.', ['monitoring', 'skills', 'contact']],
    security: ['The listed security platforms are Akamai, Imperva Cloud WAF and SecureSphere, plus Zscaler for proxy.', ['waf', 'network', 'contact']],
    code: ['The listed languages are Python and shell scripting, with C from his IoT work.', ['scripting', 'skills', 'contact']]
  };

  /* ---------- Matching engine ---------- */
  var STOP = ' there these those their where which would could should about being other after every thing think thank hello great please really still while never doing going having might quite right since under until using wants needs works does have with from that this what when your will been were they them than then some into only also just like much many more most such very know tell show give want need work role roles year years ';
  var compiled = [], known = {};
  RULES.forEach(function (r) {
    r[2].split('|').forEach(function (ph) {
      var words = ph.split(' ').length;
      compiled.push({ id: r[0], ph: ' ' + ph + ' ', raw: ph, w: r[1] + words - 1, single: words === 1 });
      if (words === 1) known[ph] = 1;
    });
  });
  STOP.trim().split(' ').forEach(function (w) { known[w] = 1; });

  function norm(text) {
    var s = String(text).toLowerCase();
    if (s.normalize) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return s
      .replace(/[‘’']/g, '')
      .replace(/[^a-z0-9+#./-]+/g, ' ')
      .replace(/[.\/-]+(?= |$)/g, '')
      .replace(/\b(she|they|dhanya|sukanth|dhanyas)\b/g, 'he')
      .replace(/\b(her|their|hes|theirs)\b/g, 'his')
      .replace(/\bthem\b/g, 'him')
      .replace(/\s+/g, ' ').trim();
  }
  function stem(w) { return w.length > 3 && /[^s]s$/.test(w) ? w.slice(0, -1) : w; }
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    var p = [], i, j, prev, t;
    for (j = 0; j <= b.length; j++) p[j] = j;
    for (i = 1; i <= a.length; i++) {
      prev = p[0]; p[0] = i;
      for (j = 1; j <= b.length; j++) {
        t = p[j];
        p[j] = Math.min(p[j] + 1, p[j - 1] + 1, prev + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
        prev = t;
      }
    }
    return p[b.length];
  }
  function close(a, b) {
    var d = lev(a, b);
    return d <= 1 || (d === 2 && a.length >= 8 && b.length >= 8);
  }

  function findUnlisted(hay) {
    for (var g in UNLISTED) {
      for (var i = 0; i < UNLISTED[g].length; i++) {
        if (hay.indexOf(' ' + UNLISTED[g][i] + ' ') > -1) return { term: UNLISTED[g][i], group: g };
      }
    }
    return null;
  }

  // Returns { id } for a knowledge-base entry, or a ready-made answer object.
  function match(text) {
    var q = norm(text);
    if (!q) return { id: 'topics' };
    if (q === 'he' || q === 'who is he') return { id: 'about' };
    var tokens = q.split(' '), stems = tokens.map(stem);
    var hay = ' ' + q + ' ', hay2 = ' ' + stems.join(' ') + ' ';
    var typos = stems.filter(function (t) { return t.length >= 5 && !known[t] && !known[t + 's']; });
    var score = {}, best = null, bestScore = 0;

    compiled.forEach(function (c) {
      var s = 0;
      if (hay.indexOf(c.ph) > -1 || hay2.indexOf(c.ph) > -1) s = c.w;
      else if (c.single && c.raw.length >= 5) {
        for (var i = 0; i < typos.length; i++) if (close(typos[i], c.raw)) { s = c.w * 0.7; break; }
      }
      if (s) score[c.id] = (score[c.id] || 0) + s;
    });
    RULES.forEach(function (r) {
      if (score[r[0]] > bestScore) { bestScore = score[r[0]]; best = r[0]; }
    });

    var miss = findUnlisted(hay);
    if (miss && bestScore < 4) {
      var near = NEAR[miss.group];
      return {
        key: 'unlisted',
        p: ['“' + miss.term + '” is not on Dhanya’s résumé, and I would rather be honest than make something up! ' + near[0], 'For anything beyond the résumé, he is the best person to ask.'],
        a: [ACT.email], n: near[1]
      };
    }
    return { id: best || 'fallback' };
  }

  /* ---------- UI ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function init() {
    var win = document.getElementById('chatwin'), fab = document.getElementById('chatfab');
    var log = document.getElementById('chm'), inp = document.getElementById('chinp');
    var quick = document.getElementById('chq'), send = document.getElementById('chsnd');
    var closeBtn = document.getElementById('chatclose'), clear = document.getElementById('chclear');
    if (!win || !fab || !log || !inp || !quick) return;
    var busy = false, timer = 0;

    function setOpen(open) {
      win.hidden = !open;
      fab.classList.toggle('open', open);
      fab.setAttribute('aria-expanded', String(open));
      fab.setAttribute('aria-label', open ? 'Close portfolio assistant' : 'Open portfolio assistant');
      // only auto-focus where it will not pop a virtual keyboard over the conversation
      if (open && window.matchMedia('(hover: hover) and (pointer: fine)').matches) inp.focus();
    }

    function push(node) {
      log.appendChild(node);
      while (log.children.length > 60) log.removeChild(log.firstChild);
    }

    function chips(ids) {
      while (quick.firstChild) quick.removeChild(quick.firstChild);
      (ids || []).forEach(function (id) {
        if (!KB[id] || !LABEL[id]) return;
        var b = el('button', 'qb', LABEL[id]);
        b.type = 'button';
        b.addEventListener('click', function () { ask(LABEL[id], id); });
        quick.appendChild(b);
      });
    }

    function action(a) {
      var link = el('a', 'ma', a.t);
      link.href = a.h;
      if (a.dl) link.setAttribute('download', a.dl);
      if (a.x) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      if (a.h.charAt(0) === '#') link.addEventListener('click', function () {
        // on small screens the chat covers the page, so get out of the way
        if (window.innerWidth < 700) setOpen(false);
      });
      return link;
    }

    function addBot(ans, key) {
      var d = el('div', 'msg bot');
      d.dataset.topic = key;
      (ans.p || []).forEach(function (t) { d.appendChild(el('p', '', t)); });
      if (ans.l) {
        var ul = el('ul');
        ans.l.forEach(function (t) { ul.appendChild(el('li', '', t)); });
        // keep a list directly under the sentence that introduces it
        d.insertBefore(ul, d.children[1] || null);
      }
      if (ans.a) {
        var row = el('div', 'msg-acts');
        ans.a.forEach(function (a) { row.appendChild(action(a)); });
        d.appendChild(row);
      }
      push(d);
      chips(ans.n);
      // show the start of a long answer rather than its end
      log.scrollTop = Math.max(0, d.offsetTop - 12);
    }

    function addUser(text) {
      push(el('div', 'msg usr', text)); // visitor input: always plain text
      log.scrollTop = log.scrollHeight;
    }

    // id is set when a suggestion chip was clicked (no matching needed)
    function ask(text, id) {
      text = (text || '').trim().slice(0, 200);
      if (!text || busy) return;
      busy = true;
      addUser(text);
      var res = id ? { id: id } : match(text);
      var ans = res.id ? KB[res.id] : res, key = res.id || res.key;
      if (ans.v) { // rotate through variants so repeat questions do not get the same line
        ans.i = (ans.i || 0) + 1;
        ans = { p: [ans.v[(ans.i - 1) % ans.v.length]].concat(ans.p || []), l: ans.l, a: ans.a, n: ans.n };
      }
      var typing = el('div', 'msg bot typ');
      typing.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < 3; i++) typing.appendChild(el('span'));
      push(typing);
      log.scrollTop = log.scrollHeight;
      timer = setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        addBot(ans, key);
        busy = false;
      }, 380 + Math.min(420, (ans.p[0] || '').length * 2));
    }

    function reset() {
      clearTimeout(timer);
      busy = false;
      while (log.firstChild) log.removeChild(log.firstChild);
      addBot(intro(), 'intro');
    }

    function submit() { ask(inp.value); inp.value = ''; }

    fab.addEventListener('click', function () { setOpen(win.hidden); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); fab.focus(); });
    if (clear) clear.addEventListener('click', function () { reset(); inp.focus(); });
    if (send) send.addEventListener('click', function () { submit(); inp.focus(); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); submit(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !win.hidden) { setOpen(false); fab.focus(); }
    });

    reset();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
