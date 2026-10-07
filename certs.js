// Single source of truth for certifications. Loaded by index.html (highlights)
// and credentials.html (full filterable list). Every entry links to the issuer's
// verification page. Don't quote a total count anywhere.
(function () {
  const CR = id => 'https://www.credly.com/badges/' + id + '/linked_in_profile';
  const LI = h => 'https://www.linkedin.com/learning/certificates/' + h;
  const CA = id => 'https://academy.claude.com/verify/' + id;
  const MS = c => 'https://learn.microsoft.com/api/achievements/share/en-us/JawadUlHadi-0198/' + c + '?sharingId=AFF773B6C8D61F92';
  // [topic, title, issuer, date, url, featured]
  // topics: C Anthropic & Claude · A Agentic AI & LLMs · D Cloud & data · M Microsoft · F Foundations
  window.JUH_CERTS = [
    ['C', 'Introduction to Model Context Protocol by Anthropic', 'LinkedIn Learning', 'Aug 2026', LI('7cc20704d76cef05f35241624338f0c3a88b522c69266e3b3536e7ecc43490f1'), 1],
    ['C', 'Claude Code 4: Agentic Coding for Professional Developers', 'LinkedIn Learning', 'Aug 2026', LI('0d8eecc5082ca07af8f771083ea29d4c274033e6b3bdc7ef6e7512e35c1a8a85'), 1],
    ['C', 'Claude Code in Action', 'Claude Academy · Anthropic', 'Aug 2026', CA('ff1b2c578e9794408a0ba9c5beedc928'), 1],
    ['A', 'Agentic AI Architecture Foundations: Designing Autonomous AI Systems', 'LinkedIn Learning', 'Aug 2026', LI('a7eb686b16f072c55ca832682ca0467ed7235f364d272e8f937813cce050cdc6'), 1],
    ['A', 'Agentic AI Solution Design Patterns', 'LinkedIn Learning', 'Aug 2026', LI('418db3170c778c6dd6faffc8aaa20934974fdde3790b23579f98e37f3dd464da'), 1],
    ['A', 'AI Solution Design Patterns: Data, Model Training, and Application Architectures', 'LinkedIn Learning', 'Aug 2026', LI('5153e8eb222a84ac8db4d0b35df23426e222f370fc51d77124ca896e77178853'), 1],
    ['A', 'Introduction to AI Orchestration with LangChain and LlamaIndex', 'LinkedIn Learning', 'Aug 2026', LI('b31067a6d48eff91faac35512ec9eafefafb76da400cc3355d28708d2ce24245'), 1],
    ['A', 'Gen AI: Beyond the Chatbot', 'Google Skills Boost', 'Aug 2026', 'https://www.skills.google/public_profiles/e7e2ac08-758d-47f5-af65-589153c6b873/badges/26965991', 1],
    ['M', 'Introduction to Generative AI and Agents', 'Microsoft Learn', 'Sep 2026', MS('FEGYP6TX'), 1],
    ['D', 'Containers & Kubernetes Essentials', 'IBM', 'Sep 2026', 'https://www.credly.com/badges/13300660-220e-4a01-ad7e-c4be671babf4', 1],
    ['D', 'Getting Started with Microservices with Istio and IBM Cloud Kubernetes Service', 'IBM', 'Sep 2026', 'https://www.credly.com/badges/ba36cf99-6006-4ad8-a43a-f5a479ae4024', 1],
    ['F', 'Certified Django Developer', 'e-smartdata.org', 'Oct 2025', null, 1],
    ['C', 'Build with AI: Leverage Claude Code Subagents in Software Projects', 'LinkedIn Learning', 'Aug 2026', LI('686155a8b791ce682068645f7623330b27ad95f43c049727ef9af7420d99a560')],
    ['C', 'Introduction to Agent Skills by Anthropic', 'LinkedIn Learning', 'Aug 2026', LI('3d52b14114566e0fdb14d584c77ea28aebb8268c712a9e66165787f10cfb3207')],
    ['C', 'Claude Platform 101', 'Claude Academy · Anthropic', 'Aug 2026', CA('a46195050c356de763f41c151bee30d1')],
    ['C', 'Claude Code 101', 'Claude Academy · Anthropic', 'Aug 2026', CA('f0b999570f254c062dbba8fb880ab4fe')],
    ['C', 'Claude 101', 'Claude Academy · Anthropic', 'Aug 2026', CA('172ea8fbee8244e56077f6eb5015b998')],
    ['C', 'Introduction to Claude Cowork', 'Claude Academy · Anthropic', 'Aug 2026', CA('16e3962cbe28431a9e8bf03e4968ad60')],
    ['C', 'AI Fluency: Framework & Foundations', 'Claude Academy · Anthropic', 'Aug 2026', CA('c89048831817ea71a606cafefec2b778')],
    ['C', 'AI Capabilities and Limitations', 'Claude Academy · Anthropic', 'Aug 2026', CA('6599e678fb2dfe18b544458d8581d23c')],
    ['A', 'Build AI Agents with GitHub Copilot by Microsoft Press', 'LinkedIn Learning', 'Aug 2026', LI('9f08ea367800cebf6c82e9487d7257f0bbc4016fc859559e84c86509fae19c91')],
    ['A', 'Building a Personalized Chatbot with OpenAI and LangChain', 'LinkedIn Learning', 'Aug 2026', LI('d76ecea6a0c9ae6d9eac1143c0023d574aa648ee35d2d074c7d93eec8b18c00e')],
    ['A', 'Advanced Quantization Techniques for Large Language Models', 'LinkedIn Learning', 'Aug 2026', LI('4d7d15d666e33fffc0484d434341dc4f8ad4bceddd8d6cdacdcdf278ebc7241c')],
    ['A', 'Building AI Products: Implementing Responsible AI', 'LinkedIn Learning', 'Aug 2026', LI('24016fe8759c43e6b2997a9f0c0059fe524647f5a9c892de7b3a229323c35833')],
    ['A', 'Introduction to Multimodal Prompting for Generative AI', 'LinkedIn Learning', 'Aug 2026', LI('d7bd1ec1c8e2eb1c1a1c2d103d0bf2c4c4a9bb23b080132b2b21a92d600f3ab8')],
    ['A', 'Introduction to Prompt Engineering for Generative AI', 'LinkedIn Learning', 'Aug 2026', LI('b7156a3b1d734660c446d32481ca978a7c2c8b40bb319d16e9927a4891f5af41')],
    ['A', 'Artificial Intelligence Foundations: Machine Learning', 'LinkedIn Learning', 'Aug 2026', LI('67a724f3ca88244c58ab3cc24e540138b817e0ef20ecbbb607dafb7c4bfa62bf')],
    ['A', 'Artificial Intelligence Foundations: Neural Networks', 'LinkedIn Learning', 'Aug 2026', LI('c2bceee32e9f413d8546a2b3eab43d53902c487ffab8c8b3ce79e0650cd83632')],
    ['A', 'Machine Learning with Python: Foundations', 'LinkedIn Learning', 'Aug 2026', LI('cbf2a10d5df1e56235b6176b95457be6d671de6cc09ff18d9548c0fcb88d0eb7')],
    ['A', 'How to Build Your First AI Agent with ChatGPT', 'LinkedIn Learning', 'Aug 2026', LI('891cea008560a7a74abc4396055f64a5a4e96cb2f1a96bd064f32dff4e00f73a')],
    ['A', 'Create Your First Gemini Enterprise Application', 'Gemini Gear', 'Aug 2026', CR('f158ced5-5067-46a0-9f9c-2479bf31cff6')],
    ['A', 'Introduction to Generative AI', 'Coursera', 'Jan 2026', 'https://www.coursera.org/account/accomplishments/verify/G3A7L84CRV82'],
    ['A', 'Artificial Intelligence Fundamentals', 'IBM SkillsBuild', 'Feb 2026', CR('37f8ca56-518e-4ffc-8b70-dd29db910bab')],
    ['M', 'Introduction to AI Concepts', 'Microsoft Learn', 'Sep 2026', MS('WM5FRA6N')],
    ['M', 'Introduction to Natural Language Processing Concepts', 'Microsoft Learn', 'Sep 2026', MS('8VSNEQTW')],
    ['M', 'Introduction to AI Speech Concepts', 'Microsoft Learn', 'Sep 2026', MS('NQLXKEEF')],
    ['M', "What Is Microsoft Copilot? An Overview of Microsoft's AI Tools", 'LinkedIn Learning', 'Aug 2026', LI('58904718f5d955ce64f2f56f0b6118b7eff6961d328e1a73e09bd7be08771c19')],
    ['D', 'Introduction to Containers, Kubernetes, and OpenShift', 'Cognitive Class', 'Sep 2026', 'https://courses.cognitiveclass.ai/certificates/7e5838e4e64d4f96b129f7a79d5671a9'],
    ['D', 'Big Data Foundations, Level 1', 'IBM', 'Aug 2026', CR('dcfadd4e-959b-4e1d-b17d-b2f9f0467a18')],
    ['D', 'Data Science Foundations, Level 1', 'IBM', 'Sep 2026', CR('c010bf5b-e655-4a5a-b203-25ccf1db87aa')],
    ['D', 'Python for Data Science', 'IBM', 'Aug 2026', CR('96c841b8-592c-4d0e-9756-ac37bbaa431d')],
    ['D', 'Cloud Computing Fundamentals', 'IBM SkillsBuild', 'Feb 2026', CR('1da9246d-550e-4463-8926-4dd9b0661602')],
    ['D', 'Data Fundamentals', 'IBM SkillsBuild', 'Mar 2026', CR('dc86df62-aa4b-4aba-96b0-eb15d734e6d0')],
    ['F', 'AI for Senior Leaders: Driving Strategy, Innovation, and Business Transformation', 'LinkedIn Learning', 'Aug 2026', LI('795b0f97dc40ba040309f80025937a970ff3e33eb9183052d362ee7061bab974')],
    ['F', 'Cybersecurity Fundamentals', 'IBM SkillsBuild', 'Feb 2026', CR('50af0df4-e762-4d0e-8e0a-71eb809c9588')],
    ['F', 'Web Development Fundamentals', 'IBM SkillsBuild', 'Feb 2026', CR('8200cfe4-fd0b-4f9f-b31d-06569ab8f445')],
    ['F', 'Information Technology Fundamentals', 'IBM SkillsBuild', 'Feb 2026', CR('fb520a68-f279-4351-b67e-5dddea39b21e')],
    ['F', 'Explore Emerging Tech', 'IBM SkillsBuild', 'Mar 2026', CR('6ed16143-e785-413f-8b7e-77b7466b3c09')],
    ['F', 'A Standalone Project: Create a Website for Online Burger Orders Using React.js', 'LinkedIn Learning', 'Aug 2026', LI('c64dce7dfd4e3428b7076230c539848725efbfbb27caae97e7918bc7a4932d56')],
    ['F', 'Be the Problem-Solver No Team Can Afford to Lose', 'LinkedIn Learning', 'Aug 2026', LI('b34b223c9bb5f875173f923d94f0c20c979b8562783b16cf67e5435024dd82a8')],
    ['F', 'Working in a Digital World: Professional Skills', 'IBM SkillsBuild', 'Feb 2026', CR('056c5fb0-f12b-4d81-ba66-68eba97b211b')],
    ['F', 'Open to Work: Building Key Career Skills in the Age of AI', 'LinkedIn Learning', 'Aug 2026', LI('760b77c72122181307e3333fe28bcaf5af9aa4c99d874730252860020e79583e')],
    ['F', 'Job Application Essentials', 'IBM SkillsBuild', 'Mar 2026', CR('a074c7cf-3c79-434f-bacb-4d3473525a31')]
  ];
  window.JUH_CERT_FILTERS = [['featured', 'Featured'], ['C', 'Anthropic & Claude'], ['A', 'Agentic AI & LLMs'], ['D', 'Cloud & data'], ['M', 'Microsoft'], ['F', 'Foundations'], ['all', 'All']];
  // The certifications listed on the résumé, shown as highlights on the main page.
  window.JUH_CERT_HIGHLIGHTS = [
    'Claude Code in Action',
    'Containers & Kubernetes Essentials',
    'Gen AI: Beyond the Chatbot',
    'Introduction to Generative AI and Agents',
    'Certified Django Developer'
  ];
})();
