(function(){

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Particle network background ---------- */
  if(!reduceMotion){
    var canvas = document.getElementById('particles');

    if(canvas){
      var ctx = canvas.getContext('2d');
      var w, h, particles = [];
      var mouse = { x:null, y:null };
      var COUNT = window.innerWidth < 700 ? 34 : 68;
      var LINK_DIST = 150;

      function resize(){
        w = canvas.width = window.innerWidth;
        h = canvas.height = document.documentElement.scrollHeight;
      }

      function initParticles(){
        particles = [];

        for(var i=0;i<COUNT;i++){
          particles.push({
            x: Math.random()*w,
            y: Math.random()*h,
            vx:(Math.random()-0.5)*0.25,
            vy:(Math.random()-0.5)*0.25,
            r:Math.random()*1.6+0.6
          });
        }
      }

      function step(){

        ctx.clearRect(0,0,w,h);

        for(var i=0;i<particles.length;i++){

          var p = particles[i];

          p.x += p.vx;
          p.y += p.vy;

          if(p.x < 0 || p.x > w) p.vx *= -1;
          if(p.y < 0 || p.y > h) p.vy *= -1;

          if(mouse.x !== null){

            var dx = p.x - mouse.x;
            var dy = p.y - mouse.y;
            var d = Math.sqrt(dx*dx + dy*dy);

            if(d < 130){
              var f = ((130-d)/130)*0.03;
              p.vx += (dx/d)*f;
              p.vy += (dy/d)*f;
            }
          }

          p.vx *= 0.995;
          p.vy *= 0.995;

          ctx.beginPath();
          ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle='rgba(120,190,255,0.55)';
          ctx.fill();
        }


        for(var i=0;i<particles.length;i++){

          for(var j=i+1;j<particles.length;j++){

            var a = particles[i];
            var b = particles[j];

            var dx = a.x-b.x;
            var dy = a.y-b.y;
            var dist = Math.sqrt(dx*dx+dy*dy);

            if(dist < LINK_DIST){

              ctx.beginPath();
              ctx.moveTo(a.x,a.y);
              ctx.lineTo(b.x,b.y);

              ctx.strokeStyle =
              'rgba(90,160,255,' +
              (0.16*(1-dist/LINK_DIST)) +
              ')';

              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        requestAnimationFrame(step);
      }


      resize();
      initParticles();

      window.addEventListener('resize',function(){
        resize();
        initParticles();
      });

      requestAnimationFrame(step);


      window.addEventListener('mousemove',function(e){
        mouse.x=e.clientX;
        mouse.y=e.clientY+window.scrollY;
      });

      window.addEventListener('mouseleave',function(){
        mouse.x=null;
        mouse.y=null;
      });

    }
  }



  /* ---------- Cursor glow + buttons + tilt ---------- */

  var cursorGlow=document.getElementById('cursorGlow');

  document.addEventListener('mousemove',function(e){

    document.body.classList.add('has-mouse');

    if(cursorGlow){

      cursorGlow.style.setProperty(
        '--cx',
        e.clientX+'px'
      );

      cursorGlow.style.setProperty(
        '--cy',
        (e.clientY+window.scrollY)+'px'
      );

    }

  });



  if(!reduceMotion){

    document.querySelectorAll('.tilt-card')
    .forEach(function(card){

      card.addEventListener('mousemove',function(e){

        var rect=card.getBoundingClientRect();

        var x=e.clientX-rect.left;
        var y=e.clientY-rect.top;

        var cx=x/rect.width;
        var cy=y/rect.height;

        var rotX=(0.5-cy)*8;
        var rotY=(cx-0.5)*8;


        card.style.transform =
        'perspective(700px) rotateX('+
        rotX+
        'deg) rotateY('+
        rotY+
        'deg) translateY(-4px)';


        card.style.setProperty('--mx',(cx*100)+'%');
        card.style.setProperty('--my',(cy*100)+'%');

      });


      card.addEventListener('mouseleave',function(){
        card.style.transform='';
      });


    });



    document.querySelectorAll('.cta-btn.filled')
    .forEach(function(btn){

      btn.addEventListener('mousemove',function(e){

        var rect=btn.getBoundingClientRect();

        var x=e.clientX-rect.left-rect.width/2;
        var y=e.clientY-rect.top-rect.height/2;


        btn.style.transform =
        'translate('+
        (x*0.18)+
        'px,'+
        (y*0.35)+
        'px)';

      });


      btn.addEventListener('mouseleave',function(){

        btn.style.transform='';

      });

    });

  }



  /* ---------- Scroll reveal ---------- */

  var revealEls=document.querySelectorAll('.reveal');


  revealEls.forEach(function(el){
    el.style.pointerEvents='none';
  });


  if('IntersectionObserver' in window){

    var io=new IntersectionObserver(function(entries){

      entries.forEach(function(entry){

        if(entry.isIntersecting){

          entry.target.classList.add('in');

          entry.target.style.pointerEvents='auto';

          io.unobserve(entry.target);

        }

      });

    },{
      threshold:0.15
    });


    revealEls.forEach(function(el){
      io.observe(el);
    });


  } else {

    revealEls.forEach(function(el){

      el.classList.add('in');
      el.style.pointerEvents='auto';

    });

  }





  /* ---------- Count-up stats ---------- */

  var statsBar=document.getElementById('statsBar');

  var counted=false;


  function runCount(){

    if(counted)return;

    counted=true;


    document.querySelectorAll('.stat .num')
    .forEach(function(el){

      var target=parseInt(
        el.getAttribute('data-count'),
        10
      );

      var suffix=
      el.getAttribute('data-suffix') || '';

      var dur=1200;
      var start=null;


      function frame(ts){

        if(!start)start=ts;

        var progress=Math.min(
          (ts-start)/dur,
          1
        );

        var eased=
        1-Math.pow(1-progress,3);


        el.textContent=
        Math.round(target*eased)+suffix;


        if(progress<1){
          requestAnimationFrame(frame);
        }

      }


      requestAnimationFrame(frame);

    });

  }



  if(statsBar){

    if('IntersectionObserver' in window){

      var io2=new IntersectionObserver(function(entries){

        entries.forEach(function(entry){

          if(entry.isIntersecting){

            runCount();

            io2.disconnect();

          }

        });

      },{
        threshold:0.4
      });


      io2.observe(statsBar);

    }else{

      runCount();

    }

  }





  /* ---------- Mobile menu toggle ---------- */

  var menuToggle=document.querySelector('.menu-toggle');
  var navLinks=document.querySelector('.nav-links');


  if(menuToggle && navLinks){

    navLinks.id = navLinks.id || 'primary-navigation';
    menuToggle.setAttribute('aria-controls', navLinks.id);
    menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('open') ? 'true' : 'false');

    menuToggle.addEventListener('click',function(){

      var isOpen = navLinks.classList.toggle('open');
      menuToggle.textContent = isOpen ? '✕' : '☰';
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');

    });


    navLinks.querySelectorAll('a')
    .forEach(function(link){

      link.addEventListener('click',function(){

        navLinks.classList.remove('open');
        menuToggle.textContent='☰';
        menuToggle.setAttribute('aria-expanded','false');
        menuToggle.setAttribute('aria-label','Open menu');

      });

    });

  }



  /* ---------- Accessibility + SEO foundation ---------- */

  document.documentElement.classList.toggle('reduce-motion', reduceMotion);

  ['bg-fx','particles','cursorGlow'].forEach(function(id){
    var decorative=document.getElementById(id);
    if(decorative) decorative.setAttribute('aria-hidden','true');
  });

  var main=document.querySelector('main');
  if(main){
    main.id=main.id || 'main-content';
    var skip=document.createElement('a');
    skip.className='skip-link';
    skip.href='#'+main.id;
    skip.textContent='Skip to main content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  var style=document.createElement('style');
  style.textContent='\n    .skip-link{position:fixed;left:12px;top:12px;z-index:1000;padding:10px 14px;background:#fff;color:#000;border-radius:6px;font-weight:700;transform:translateY(-160%);transition:transform .15s ease}.skip-link:focus{transform:translateY(0);outline:3px solid #4A9EFF;outline-offset:2px}\n    :focus-visible{outline:3px solid #4A9EFF;outline-offset:3px}\n    .reduce-motion *, .reduce-motion *::before, .reduce-motion *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}\n    .nav-links a:focus-visible,.nav-cta:focus-visible,.cta-btn:focus-visible,.product-link:focus-visible,.menu-toggle:focus-visible{border-radius:5px}\n  ';
  document.head.appendChild(style);

  /* Give navigation controls a meaningful accessible name/state. */
  if(menuToggle){
    menuToggle.setAttribute('type','button');
    menuToggle.setAttribute('aria-label', navLinks && navLinks.classList.contains('open') ? 'Close menu' : 'Open menu');
  }

  /* The resource filters behave as tabs. Expose their state to assistive technology. */
  var filterButtons=document.querySelectorAll('.resource-filter button');
  if(filterButtons.length){
    filterButtons.forEach(function(button){
      button.setAttribute('role','tab');
      button.setAttribute('aria-selected',button.classList.contains('active') ? 'true' : 'false');
      button.setAttribute('tabindex',button.classList.contains('active') ? '0' : '-1');
      button.addEventListener('click',function(){
        filterButtons.forEach(function(b){
          b.setAttribute('aria-selected','false');
          b.setAttribute('tabindex','-1');
        });
        button.setAttribute('aria-selected','true');
        button.setAttribute('tabindex','0');
      });
    });
  }

  /* Add useful form autocomplete hints without changing the form's behavior. */
  var nameInput=document.getElementById('name');
  var emailInput=document.getElementById('email');
  if(nameInput) nameInput.setAttribute('autocomplete','name');
  if(emailInput) emailInput.setAttribute('autocomplete','email');

  /* Make contact details actionable for keyboard and mobile users. */
  document.querySelectorAll('.contact-info-card .row').forEach(function(row){
    var text=(row.textContent||'').trim();
    var span=row.querySelector('span');
    if(!span || span.querySelector('a')) return;
    if(/^info@toastidtech\.com$/i.test(text)){
      span.innerHTML='<a href="mailto:info@toastidtech.com">info@toastidtech.com</a>';
    }else if(/^\(479\) 339-1504$/.test(text)){
      span.innerHTML='<a href="tel:+14793391504">(479) 339-1504</a>';
    }
  });

  /* ---------- Structured data ---------- */
  var path=window.location.pathname.replace(/\/+$/,'') || '/';
  var pageData={
    '/':{title:'Toastid Tech, LLC | AI Consulting & PWA Development',description:'AI consulting, custom Progressive Web App development, business automation, and practical technology solutions for small businesses and solopreneurs.'},
    '/index.html':{title:'Toastid Tech, LLC | AI Consulting & PWA Development',description:'AI consulting, custom Progressive Web App development, business automation, and practical technology solutions for small businesses and solopreneurs.'},
    '/products.html':{title:'Products & Services | Toastid Tech',description:"Explore Toastid Tech's AI-powered apps, Progressive Web Apps, business automation tools, and technology consulting services."},
    '/resources.html':{title:'Resources & Blog | PWA, AI & Business Automation | Toastid Tech',description:'Practical guides about Progressive Web Apps, business audits, AI strategy, and business automation for small businesses and solopreneurs.'},
    '/about.html':{title:'About Toastid Tech | AI & Technology Consulting',description:'Learn about Toastid Tech, a founder-built technology company focused on AI consulting, PWA development, automation, and practical digital solutions.'},
    '/contact.html':{title:'Contact Toastid Tech | AI Consulting & App Development',description:'Talk with Toastid Tech about AI consulting, custom PWA development, business audits, automation, or your next digital product.'},
    '/disclaimer.html':{title:'Cope Disclaimer | Toastid Tech',description:'Important information and limitations for the Cope emotional wellness app.'},
    '/scribe-vs-tango-vs-power-automate.html':{title:'Scribe vs. Tango vs. Power Automate | Honest Comparison',description:'Compare Scribe, Tango, and Power Automate across workflow documentation, automation, integrations, pricing, and use cases.'}
  };
  var data=pageData[path] || pageData[path.replace(/\.html$/,'')];
  var absoluteUrl='https://toastidtech.com'+(path==='/'?'/':path);

  function upsertMeta(attr,name,content){
    if(!content) return;
    var selector='meta['+attr+'="'+name+'"]';
    var el=document.head.querySelector(selector);
    if(!el){
      el=document.createElement('meta');
      el.setAttribute(attr,name);
      document.head.appendChild(el);
    }
    el.setAttribute('content',content);
  }
  function upsertLink(rel,href){
    var el=document.head.querySelector('link[rel="'+rel+'"]');
    if(!el){
      el=document.createElement('link');
      el.setAttribute('rel',rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href',href);
  }

  if(data){
    document.title=data.title;
    upsertMeta('name','description',data.description);
  }
  upsertMeta('name','robots','index, follow, max-image-preview:large');
  upsertMeta('name','author','Toastid Tech, LLC');
  upsertLink('canonical',absoluteUrl);
  upsertMeta('property','og:title',data ? data.title : document.title);
  upsertMeta('property','og:description',data ? data.description : 'Toastid Tech builds practical AI-powered tools, Progressive Web Apps, and business automation solutions.');
  upsertMeta('property','og:type',path==='/resources.html' || path==='/scribe-vs-tango-vs-power-automate.html' ? 'article' : 'website');
  upsertMeta('property','og:url',absoluteUrl);
  upsertMeta('property','og:site_name','Toastid Tech, LLC');
  upsertMeta('property','og:image','https://toastidtech.com/assets/logos/shield-logo.jpg');
  upsertMeta('name','twitter:card','summary_large_image');
  upsertMeta('name','twitter:title',data ? data.title : document.title);
  upsertMeta('name','twitter:description',data ? data.description : 'Practical AI consulting, PWA development, and business automation from Toastid Tech.');
  upsertMeta('name','twitter:image','https://toastidtech.com/assets/logos/shield-logo.jpg');

  var existingSchema=document.getElementById('toastid-schema');
  if(!existingSchema){
    var schema=document.createElement('script');
    schema.type='application/ld+json';
    schema.id='toastid-schema';
    var graph=[
      {'@type':'Organization','@id':'https://toastidtech.com/#organization','name':'Toastid Tech, LLC','url':'https://toastidtech.com/','logo':{'@type':'ImageObject','url':'https://toastidtech.com/assets/logos/shield-logo.jpg'},'description':'AI consulting, Progressive Web App development, business automation, and practical technology solutions for small businesses and solopreneurs.','email':'info@toastidtech.com','telephone':'+1-479-339-1504','sameAs':['https://www.youtube.com/@ToastidTechLLC']},
      {'@type':'WebSite','@id':'https://toastidtech.com/#website','url':'https://toastidtech.com/','name':'Toastid Tech, LLC','publisher':{'@id':'https://toastidtech.com/#organization'}},
      {'@type':'BreadcrumbList','@id':absoluteUrl+'#breadcrumb','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':'https://toastidtech.com/'}]}
    ];
    if(path==='/products.html'){
      graph.push({'@type':'ItemList','name':'Toastid Tech Products & Services','itemListElement':[
        {'@type':'ListItem','position':1,'name':'Cope','url':'https://toastidtech.github.io/Cope/'},
        {'@type':'ListItem','position':2,'name':'BiteFact','url':'https://toastidtech.github.io/BiteFact/'},
        {'@type':'ListItem','position':3,'name':'28-Day Walking Tai Chi','url':'https://toastidtech.github.io/28-Day-Tai-Chi-Walking/'},
        {'@type':'ListItem','position':4,'name':'Micro Habits','url':'https://toastidtech.github.io/micro-habits/'},
        {'@type':'ListItem','position':5,'name':'CanvasFlow','url':'https://toastidtech.github.io/CanvasFlow/'},
        {'@type':'ListItem','position':6,'name':'SOPilot','url':'https://toastidtech.com/products.html#apps'},
        {'@type':'ListItem','position':7,'name':'Pulse Matrix','url':'https://toastidtech.com/products.html#apps'}
      ]});
      graph.push({'@type':'Service','name':'AI Consulting and Business Technology Audits','provider':{'@id':'https://toastidtech.com/#organization'},'serviceType':'AI consulting, business technology audits, workflow automation, and PWA development','areaServed':'Worldwide'});
    }
    if(path==='/resources.html'){
      graph.push({'@type':'Blog','name':'Toastid Tech Resources & Blog','url':absoluteUrl,'publisher':{'@id':'https://toastidtech.com/#organization'}});
    }
    if(path==='/scribe-vs-tango-vs-power-automate.html'){
      graph.push({'@type':'Article','headline':'Scribe vs. Tango vs. Power Automate | Honest Comparison','description':data.description,'url':absoluteUrl,'mainEntityOfPage':absoluteUrl,'author':{'@id':'https://toastidtech.com/#organization'},'publisher':{'@id':'https://toastidtech.com/#organization'},'image':'https://toastidtech.com/assets/logos/shield-logo.jpg'});
    }
    if(path==='/about.html'){
      graph.push({'@type':'AboutPage','name':'About Toastid Tech','url':absoluteUrl,'mainEntity':{'@id':'https://toastidtech.com/#organization'}});
    }
    if(path==='/contact.html'){
      graph.push({'@type':'ContactPage','name':'Contact Toastid Tech','url':absoluteUrl,'mainEntity':{'@id':'https://toastidtech.com/#organization'}});
    }
    schema.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph});
    document.head.appendChild(schema);
  }

})();



/* ---------- Service worker registration ---------- */

if('serviceWorker' in navigator){

  window.addEventListener('load',function(){

    navigator.serviceWorker
    .register('/sw.js')
    .catch(function(err){

      console.log(
        'SW registration failed:',
        err
      );

    });

  });

}



