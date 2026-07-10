(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Particle network background ---------- */
  if(!reduceMotion){
    var canvas = document.getElementById('particles');
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
          vx: (Math.random()-0.5)*0.25,
          vy: (Math.random()-0.5)*0.25,
          r: Math.random()*1.6+0.6
        });
      }
    }
    function step(){
      ctx.clearRect(0,0,w,h);
      for(var i=0;i<particles.length;i++){
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > w) p.vx *= -1;
        if(p.y < 0 || p.y > h) p.vy *= -1;

        if(mouse.x !== null){
          var dx = p.x - mouse.x, dy = p.y - mouse.y;
          var d = Math.sqrt(dx*dx + dy*dy);
          if(d < 130){
            var f = (130 - d) / 130 * 0.03;
            p.vx += (dx/d) * f;
            p.vy += (dy/d) * f;
          }
        }
        p.vx *= 0.995; p.vy *= 0.995;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(120,190,255,0.55)';
        ctx.fill();
      }
      for(var i=0;i<particles.length;i++){
        for(var j=i+1;j<particles.length;j++){
          var a = particles[i], b = particles[j];
          var dx = a.x-b.x, dy = a.y-b.y;
          var dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < LINK_DIST){
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(90,160,255,' + (0.16*(1-dist/LINK_DIST)) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }
    resize(); initParticles();
    window.addEventListener('resize', function(){ resize(); initParticles(); });
    requestAnimationFrame(step);

    window.addEventListener('mousemove', function(e){
      mouse.x = e.clientX; mouse.y = e.clientY + window.scrollY;
    });
    window.addEventListener('mouseleave', function(){ mouse.x = null; mouse.y = null; });
  }

  /* ---------- Cursor glow + magnetic buttons + tilt/spotlight ---------- */
  var cursorGlow = document.getElementById('cursorGlow');
  document.addEventListener('mousemove', function(e){
    document.body.classList.add('has-mouse');
    if(cursorGlow){
      cursorGlow.style.setProperty('--cx', e.clientX + 'px');
      cursorGlow.style.setProperty('--cy', (e.clientY + window.scrollY) + 'px');
    }
  });

  if(!reduceMotion){
    document.querySelectorAll('.tilt-card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left, y = e.clientY - rect.top;
        var cx = x / rect.width, cy = y / rect.height;
        var rotX = (0.5 - cy) * 8;
        var rotY = (cx - 0.5) * 8;
        card.style.transform = 'perspective(700px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-4px)';
        card.style.setProperty('--mx', (cx*100) + '%');
        card.style.setProperty('--my', (cy*100) + '%');
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });

    document.querySelectorAll('.cta-btn.filled').forEach(function(btn){
      btn.addEventListener('mousemove', function(e){
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width/2;
        var y = e.clientY - rect.top - rect.height/2;
        btn.style.transform = 'translate(' + (x*0.18) + 'px,' + (y*0.35) + 'px)';
      });
      btn.addEventListener('mouseleave', function(){ btn.style.transform = ''; });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- Count-up stats ---------- */
  var statsBar = document.getElementById('statsBar');
  var counted = false;
  function runCount(){
    if(counted) return;
    counted = true;
    document.querySelectorAll('.stat .num').forEach(function(el){
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1200, start = null;
      function frame(ts){
        if(!start) start = ts;
        var progress = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if(progress < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }
  if(statsBar){
    if('IntersectionObserver' in window){
      var io2 = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){ runCount(); io2.disconnect(); }
        });
      }, { threshold: 0.4 });
      io2.observe(statsBar);
    } else { runCount(); }
  }

  /* ---------- Mobile menu toggle ---------- */
  var menuToggle = document.querySelector('.menu-toggle');
  var navLinks = document.querySelector('.nav-links');
  if(menuToggle && navLinks){
    menuToggle.addEventListener('click', function(){
      navLinks.classList.toggle('open');
      menuToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        navLinks.classList.remove('open');
        menuToggle.textContent = '☰';
      });
    });
  }
})();
/* ---------- Service worker registration ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function (err) {
      console.log('SW registration failed:', err);
    });
  });
}
