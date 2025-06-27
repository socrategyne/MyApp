// DOM Elements
const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');
const content = document.getElementById('content');
const appHeader = document.getElementById('app-header');

// App state
let currentUser = null;
const appState = {
  currentPage: 'home'
};

// Initialize the app
function init() {
  // Check if user is already logged in (from localStorage)
  const savedUser = localStorage.getItem('cyberone_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateHeader();
    showMainApp();
    loadPage(appState.currentPage);
  }
  
  // Add event listeners
  document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      if (authScreen.style.display !== 'none') {
        if (document.getElementById('login-box').style.display !== 'none') {
          login();
        } else {
          register();
        }
      }
    }
  });
}

// Update header with user info
function updateHeader() {
  appHeader.innerHTML = `
    <h2>🌐 Cyber One Schools</h2>
    <nav>
      <ul>
        <li><a href="#" onclick="navigate('home')">Nyumbani</a></li>
        <li><a href="#" onclick="navigate('masomo')">Masomo</a></li>
        <li><a href="#" onclick="navigate('kuhusu')">Kuhusu</a></li>
        <li><a href="#" onclick="navigate('wasiliana')">Wasiliana</a></li>
        <li><a href="#" onclick="logout()">Logout (${currentUser?.username || 'Mgeni'})</a></li>
      </ul>
    </nav>
  `;
}

// Toggle password visibility
function togglePassword() {
  const passwordField = document.getElementById('password');
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
  } else {
    passwordField.type = 'password';
  }
}

function toggleRegPassword() {
  const passwordField = document.getElementById('reg-password');
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
  } else {
    passwordField.type = 'password';
  }
}

// Toggle between login and register forms
function showRegisterForm() {
  document.getElementById('login-box').style.display = 'none';
  document.getElementById('register-box').style.display = 'block';
}

function showLoginForm() {
  document.getElementById('register-box').style.display = 'none';
  document.getElementById('login-box').style.display = 'block';
}

// Register new user
function register() {
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const confirmPassword = document.getElementById('reg-confirm-password').value.trim();

  // Validate inputs
  if (!username || !email || !password || !confirmPassword) {
    showNotification('Tafadhali jaza sehemu zote', 'error');
    return;
  }

  if (password.length < 6) {
    showNotification('Nenosiri lazima liwe na herufi 6 au zaidi', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showNotification('Nenosiri hazifanani', 'error');
    return;
  }

  // Check if username already exists
  const existingUsers = JSON.parse(localStorage.getItem('cyberone_users')) || [];
  const userExists = existingUsers.some(user => user.username === username);
  
  if (userExists) {
    showNotification('Jina la mtumiaji limeshatumika', 'error');
    return;
  }

  // Create new user
  const newUser = {
    username,
    email,
    password, // NOTE: In production, never store plain passwords!
    createdAt: new Date().toISOString()
  };

  // Save user
  existingUsers.push(newUser);
  localStorage.setItem('cyberone_users', JSON.stringify(existingUsers));
  localStorage.setItem('cyberone_user', JSON.stringify({
    username,
    lastLogin: new Date().toISOString()
  }));

  // Show success and login
  showNotification('Akaunti imeundwa kikamilifu!', 'success');
  currentUser = { username };
  updateHeader();
  showMainApp();
  loadPage('home');
  
  // Reset forms
  document.getElementById('reg-username').value = '';
  document.getElementById('reg-email').value = '';
  document.getElementById('reg-password').value = '';
  document.getElementById('reg-confirm-password').value = '';
}

// Login function
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    showNotification('Tafadhali jaza sehemu zote', 'error');
    return;
  }

  // Check against registered users
  const existingUsers = JSON.parse(localStorage.getItem('cyberone_users')) || [];
  const user = existingUsers.find(u => u.username === username);
  
  if (!user) {
    showNotification('Jina la mtumiaji halipo', 'error');
    return;
  }

  if (user.password !== password) { // NOTE: In production, use proper password hashing!
    showNotification('Nenosiri si sahihi', 'error');
    return;
  }

  // Simulate loading
  const loginBtn = document.querySelector('#login-box button');
  loginBtn.disabled = true;
  loginBtn.textContent = 'Inaload...';

  setTimeout(() => {
    currentUser = {
      username,
      lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('cyberone_user', JSON.stringify(currentUser));
    updateHeader();
    showMainApp();
    loadPage('home');
    
    loginBtn.disabled = false;
    loginBtn.textContent = 'Ingia';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    showNotification('Umefanikiwa kuingia', 'success');
  }, 1500);
}

// Logout function
function logout() {
  localStorage.removeItem('cyberone_user');
  currentUser = null;
  
  authScreen.style.display = 'flex';
  mainApp.style.display = 'none';
  showLoginForm();
  
  showNotification('Umefanikiwa kutoka', 'success');
}

// Show main app
function showMainApp() {
  authScreen.style.display = 'none';
  mainApp.style.display = 'flex';
}

// Navigation function
function navigate(page) {
  appState.currentPage = page;
  loadPage(page);
  
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('onclick')?.includes(page)) {
      link.classList.add('active');
    }
  });
}

// Load page content
function loadPage(page) {
  let pageContent = '';
  
  switch (page) {
    case 'home':
      pageContent = `
        <div class="page-content">
          <div class="card glow">
            <h3>Karibu Cyber One Schools</h3>
            <p>Mfumo wa kisasa wa kujifunza teknolojia ya kisasa na mafunzo ya programu.</p>
            <p>Jina la mtumiaji: <strong>${currentUser?.username || 'Mgeni'}</strong></p>
          </div>
          
          <div class="card">
            <h3>🔥 Kozi Zinazopendwa</h3>
            <ul>
              <li>Programu ya Web (HTML, CSS, JavaScript)</li>
              <li>Programu ya Simu (Android, iOS)</li>
              <li>Usalama wa Mtandao/Cybersecurity</li>
              
            </ul>
          </div>
        </div>
      `;
      break;
      
    case 'masomo':
      pageContent = `
        <div class="page-content">
          <div class="card">
            <h3>📚 Masomo Yote</h3>
            <p>Chagua somo la kujifunza:</p>
            
            <div class="course-grid">
              <div class="course-card" onclick="showCourse('linux')">
                <h4>🐧 Linux</h4>
                <p>Jifunze mfumo wa uendeshaji wa Linux</p>
              </div>
              
              <div class="course-card" onclick="showCourse('networking')">
                <h4>🌐 Networking</h4>
                <p>Misingi ya mtandao na mawasiliano</p>
              </div>
              
              <div class="course-card" onclick="showCourse('c')">
                <h4>🔤 C Programming</h4>
                <p>Lugha ya programu ya C</p>
              </div>
              
              <div class="course-card" onclick="showCourse('cpp')">
                <h4>➕ C++</h4>
                <p>Programu ya kitu-oriented kwa C++</p>
              </div>
              
              <div class="course-card" onclick="showCourse('csharp')">
                <h4>🎵 C#</h4>
                <p>Programu ya .NET na C#</p>
              </div>
              
              <div class="course-card" onclick="showCourse('java')">
                <h4>☕ Java</h4>
                <p>Programu ya Java na Android</p>
              </div>
              
              <div class="course-card" onclick="showCourse('python')">
                <h4>🐍 Python</h4>
                <p>Programu ya Python kwa wataalamu</p>
              </div>
              
              <div class="course-card" onclick="showCourse('reverse')">
                <h4>🔃 Reverse Engineering</h4>
                <p>Kuchambua na kubadilisha programu</p>
              </div>
              
              <div class="course-card" onclick="showCourse('electronics')">
                <h4>💡 Electronics</h4>
                <p>Misingi ya umeme na elektroniki</p>
              </div>
              
              <div class="course-card" onclick="showCourse('hacking')">
                <h4>🔐 Ethical Hacking</h4>
                <p>Usalama wa mtandao na penetration testing</p>
              </div>
            </div>
          </div>
        </div>
      `;
      break;
      
    case 'kuhusu':
      pageContent = `
        <div class="page-content">
          <div class="card">
            <h3>ℹ️ Kuhusu Cyber One</h3>
            <p>Cyber One Schools ni mfumo wa kisasa wa kujifunza teknolojia kwa wanafunzi na wataalamu.</p>
            
            <h4>Mawazo ya Msingi</h4>
            <ul>
              <li>Elimu ya hali ya juu kwa wote</li>
              <li>Mbinu za kisasa za kufundisha</li>
              <li>Mazingira salama ya kujifunza</li>
            </ul>
          </div>
        </div>
      `;
      break;
      
    case 'wasiliana':
      pageContent = `
        <div class="page-content">
          <div class="card">
            <h3>📩 Wasiliana Nasi</h3>
            <p>Tuma ujumbe kwetu kupitia fomu hii:</p>
            
            <form id="contact-form">
              <input type="text" placeholder="Jina lako" required>
              <input type="email" placeholder="Barua pepe" required>
              <textarea placeholder="Ujumbe wako" rows="4" required></textarea>
              <button type="submit">Tuma Ujumbe</button>
            </form>
          </div>
        </div>
      `;
      break;
  }
  
  content.innerHTML = pageContent;
  
  if (page === 'wasiliana') {
    document.getElementById('contact-form').addEventListener('submit', function(e) {
      e.preventDefault();
      showNotification('Ujumbe wako umetumwa kikamilifu', 'success');
      this.reset();
    });
  }
}

// Show course details
function showCourse(course) {
  let courseContent = '';
  
  switch (course) {
    case 'linux':
      courseContent = `
        <h3>🐧 Linux Operating System</h3>
        <p>Linux ni mfumo wa uendeshaji wa bure na wazi (open source) unaotumika katika server, kompyuta za kibinafsi, vifaa vya IoT, na zaidi.</p>
        
        <div class="topic-card">
          <h5>⛳ Misingi ya Linux</h5>
          <ul>
            <li>Historia ya Linux na Unix</li>
            <li>Kufunga Linux (Ubuntu, Fedora, etc.)</li>
            <li>Terminal na amri za msingi</li>
            <li>Mfumo wa faili na folda</li>
          </ul>
        </div>
        
        <div class="manual-notes">
          <h4>✍lesson 1:</h4>
          
          <div class="note">
            <p><strong>Historia ya linux:</strong></p>
               
      <li>

👉1.Mwanzo wa UNIX (1969 – 1971)

Mwaka 1969, watafiti watatu kutoka Bell Labs:

Ken Thompson,Dennis Ritchie, naRudd Canaday, 

walitengeneza mfumo wa uendeshaji (operating system) walioupa jina la UNIX.
Walitumia lugha ya assembly na baadae Dennis Ritchie akaanzisha lugha mpya aitwayo C (1972) – lugha hii ikawa msingi wa kuandika UNIX upya.
UNIX ilikuwa portable, yaani ingeweza kuhamishwa kwa urahisi kati ya kompyuta tofauti – jambo lililokuwa la ajabu kipindi hicho.

👉2.UNIX Kusambaa Duniani (1970s – 1980s)

UNIX ilianza kusambaa kwa mashirika ya kielimu (vyuo vikuu), hasa kupitia University of California, Berkeley, ambapo toleo la BSD (Berkeley Software Distribution) lilizaliwa.
Toleo hili lilikuja na maboresho kama:

TCP/IP stack,Virtual memory,Na zana nyingi za developer. 

Wakati huo pia kampuni kama IBM, Sun Microsystems, HP, na AT&T zilitoa matoleo yao ya UNIX.

👉3.Tatizo la Leseni na Hitaji la Mfumo Huru (1980s)

UNIX ikawa ya kibiashara, hivyo watu waliokuwa wanahitaji mfumo wa uendeshaji huru walikumbana na vikwazo. Hapo ndipo mtu aitwaye:

Richard Stallman, mwaka 1983, alizindua mradi wa GNU (GNU's Not Unix) – mradi wa kutengeneza UNIX-like OS huru kabisa. 

Mradi huu ulifanikiwa kuunda tools nyingi za msingi kama:

Compiler (GCC),Editor (Emacs),Shell (bash), lakini bado ulikosa kernel. 

👉4.Kuzaliwa kwa LINUX (1991)

Mwaka 1991, mwanafunzi kutoka Finland aliyeitwa Linus Torvalds alichoshwa na mfumo wa Minix (UNIX-like OS ya elimu).
Akaamua kuunda kernel yake mwenyewe, akaipakia kwenye internet akisema:

“Hii si kitu kikubwa, siyo professional, ni project ya hobby...”

Aliiita Linux (mchanganyiko wa Linus + Unix).
Kwa bahati nzuri, akaruhusu watu wote kutumia, kuisambaza na kuibadilisha.

👉5.Kuunganishwa kwa GNU + Linux = GNU/Linux

Linux ilipopatikana, ilichukua nafasi ya kernel iliyokuwa ikikosekana kwenye GNU.
Hivyo Linux + GNU tools = GNU/Linux — mfumo wa uendeshaji kamili.

Mfano wa distros (toleo kamili la OS):

Debian (1993)Red Hat (1995)Ubuntu (2004)Kali Linux (2013) 

👉6.Linux Leo Hii
Leo hii, Linux ni nguzo ya teknolojia duniani, ikiendesha:

Servers 90%+,Supercomputers zote 500 bora,Simu nyingi (kupitia Android),IoT Devices,Cloud platforms (AWS, GCP, Azure) 

💡 Hata Windows inaruhusu kutumia Linux kupitia WSL (Windows Subsystem for Linux).



Hitimisho

Linux ni zao la mapinduzi ya uhuru wa teknolojia yaliyopikwa kutoka UNIX.
Kutoka kwa wazo dogo la mwanafunzi aliyechoshwa, hadi kuwa moyo wa internet, simu, server, na AI — Linux imethibitisha kuwa nguvu ya maarifa ya wazi (open source) inaweza kutikisa

 </li>
            
          </div>
          
          <div class="note">
            <p><strong>kusakinisha kali linux:</strong></p>
            <li>Kuna njia kuu mbili za kupakua na kusanikisha kali linux kwenye computer,👉kwa virtual box au 👉kwa direct installation
            </li><👉Virtual box steps during installation:
           

 Vitu Vinavyohitajika Kabla ya Kuanza

VirtualBox – Programu ya virtualization.Kali Linux ISO – Faili ya mfumo wa Kali (kutoka https://www.kali.org).(Hiari) VirtualBox Extension Pack – Kwa support ya USB 2.0/3.0 nk. 

 Hatua za Kuweka Kali Linux kwenye VirtualBox

🥇 1. Pakua na Install VirtualBox

Nenda https://www.virtualbox.orgPakua toleo la Windows/Linux/Mac kulingana na OS yakoInstall kama programu ya kawaida 

🥈 2. Pakua Kali Linux ISO

Nenda https://www.kali.org/get-kali/Chagua Installer ISO (si live)Pakua toleo la 64-bit (amd64) 

🧰 3. Tengeneza Virtual Machine Mpya (VM)

Fungua VirtualBox kisha fuata haya:

+ Bonyeza: New

Name: Kali LinuxType: LinuxVersion: Debian (64-bit)Bonyeza Next 

🧠 Allocate RAM

Weka 2GB au zaidi (inapendekezwa 4GB)Bonyeza Next 

 Hard Disk

Chagua: Create a virtual hard disk nowBonyeza CreateFormat: VDIStorage: Dynamically allocatedSize: 20GB au zaidiBonyeza Create 

 4. Weka Kali ISO kwenye VM

Chagua VM yako kwenye VirtualBoxBonyeza Settings > StorageBonyeza icon ya CD upande wa kuliaChagua: Choose a disk fileChagua ISO ya Kali uliyoipakuaBonyeza OK 

 5. Run & Install Kali Linux

Bonyeza Start kuanzisha VMSubiri mpaka ifungue kwa kutumia ISO 

Chagua:

 Graphical Install

Halafu fuata hizi hatua:

Select Language → English au Swahili

Location → Tanzania

Configure Keyboard → American English au yako

Set Hostname → kali

Set Domain Name → Acha tupu au andika local

Set Username → chagua jina lako

Set Password → andika password utakayokumbuka

Partition Disks

Chagua: Guided - use entire diskChagua: All files in one partitionBonyeza Finish partitioning → Yes 

Install GRUB bootloader → chagua Yes

Chagua /dev/sda kama inahitajika

Subiri ikamilishe installation

 6. Reboot na Anza Kutumia Kali

Baada ya installation, VM itataka kufanya rebootOndoa ISO kwa kwenda Settings > Storage > Remove disk from virtual driveVM itaanza moja kwa moja kwenye Kali iliyowekwa 

Login Credentials (Default)

Username: ile uliyochaguaPassword: ile uliyoandika 


</li>

          </div>
        </div>
      `;
      break;
      
    case 'python':
      courseContent = `
        <h3>🐍 Python Programming</h3>
        <p>Lugha ya programu ya kiwango cha juu inayotumika katika nyanja nyingi.</p>
        
        <div class="topic-card">
          <h5>📊 Python ya Msingi</h5>
          <ul>
            <li>Syntax na data structures</li>
            <li>Functions na modules</li>
            <li>File handling</li>
            <li>Object-oriented programming</li>
          </ul>
        </div>
        
        <div class="manual-notes">
          <h4>📚 Maelezo Muhimu:</h4>
          
          <div class="note">
            <p><strong>Aina za Data:</strong></p>
            <ul>
              <li>Nambari: <code>int</code>, <code>float</code></li>
              <li>Mkondo: <code>str</code></li>
              <li>Orodha: <code>list</code></li>
              <li>Kamusi: <code>dict</code></li>
            </ul>
          </div>
          
          <div class="note">
            <p><strong>Mifano ya Code:</strong></p>
            <pre><code># Function ya kusalamu
def salamu(jina):
    print(f"Habari {jina}!")
    
salamu("Jamal")

# Kuhesabu mraba wa nambari
mraba = lambda x: x ** 2
print(mraba(5))  # 25</code></pre>
          </div>
        </div>
      `;
      break;
      
    // ... (weka maelezo sawa kwa masomo mengine)
  }
  
  content.innerHTML = `
    <div class="page-content">
      <div class="card">
        <button class="back-button" onclick="navigate('masomo')">
          <span>←</span> Rudi kwenye Masomo
        </button>
        ${courseContent}
      </div>
    </div>
  `;
}

// Share app function
function shareApp() {
  if (navigator.share) {
    navigator.share({
      title: 'Cyber One Schools',
      text: 'Jifunze programu na teknolojia ya kisasa',
      url: window.location.href,
    })
    .catch(err => {
      showNotification('Kushiriki kumesitishwa', 'error');
    });
  } else {
    showNotification('Kushiriki kumechangia kwenye clipboard', 'success');
    navigator.clipboard.writeText(window.location.href);
  }
}

// Show notification
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);w