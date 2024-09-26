import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
 
// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 100px)');
 
function closedOnEscape(e) {
  if (e.code === 'Escape') {
    const utility = document.getElementById('utility');
    const navUtility= utility.querySelector('.nav-utility');
    const languageExpanded = lang.querySelector('[aria-expanded="true"]');
    if (languageExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAlllangSections(lang);
      languageExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      togglesMenu(utility, navUtility);
      utility.querySelector('button').focus();
    }
  }
}
 
function opensOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAlllangSections(focused.closest('.lang-nav'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}
 
function focuslangSection() {
  document.activeElement.addEventListener('keydown', opensOnKeydown);
}
 
/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}
function toggleAlllangSections(sections, expanded = false) {
  sections.querySelectorAll('.lang-nav > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}
 
/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
 
}
 
function togglesMenu(utility, lang, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : utility.getAttribute('aria-expanded') === 'true';
  const button = utility.querySelector('.nav-drop');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  utility.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAlllangSections(lang, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
 
  // enable nav dropdown keyboard accessibility
  const navDrops = lang.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focuslangSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focuslangSection);
    });
  }
 
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closedOnEscape);
  } else {
    window.removeEventListener('keydown', closedOnEscape);
  }
}
 
 
/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
 
  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  let totalChildren = fragment.childElementCount;
 
while (fragment.firstElementChild && totalChildren > 2) {
    nav.append(fragment.firstElementChild);
    totalChildren--;
}
 
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });
 
  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }
  const brandImg = navBrand.firstElementChild.firstElementChild;
  const anchorBrandNode = document.createElement('a');
  anchorBrandNode.href = '/';
  anchorBrandNode.append(brandImg);
  navBrand.firstElementChild.append(anchorBrandNode);
 
 
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }
 
 
  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
 
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
 
  const regForm=document.createElement('div');
  regForm.id='regForm';
 
  regForm.append(fragment.lastElementChild.previousElementSibling);
 
  regForm.firstElementChild.style.display='none';
 
 
  const utility = document.createElement('div');
  utility.append(fragment.lastElementChild);
  utility.id='utility';
  utility.firstElementChild.classList.add('nav-utility');
 
  const navUtility=utility.querySelector('.nav-utility');
  const signin=navUtility.querySelector('p');
  if (signin){
    signin.className='signin';
  }
  signin.addEventListener('click', (event) => {
    event.stopPropagation();
    if (isDesktop.matches) {
        regForm.firstElementChild.style.display =
            regForm.firstElementChild.style.display === 'block' ? 'none' : 'block';
    }
});
  const lang=navUtility.querySelector('ul');
  if (lang){
    lang.parentElement.className='lang-nav';
 
  }
  if (lang) {
    lang.querySelectorAll('.lang-nav > ul > li').forEach((language) => {
      if (language.querySelector('ul')) language.classList.add('nav-drop');
      language.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = language.getAttribute('aria-expanded') === 'true';
          toggleAlllangSections(lang);
          language.setAttribute('aria-expanded', expanded ? 'false' : 'true');
         
        }
      });
    });
  }
  window.addEventListener('click', (event) => {
    if (regForm.firstElementChild.style.display === 'block' && !regForm.contains(event.target)) {
 
        regForm.firstElementChild.style.display = 'none';
    }
    const isExpanded = lang.firstElementChild.getAttribute('aria-expanded') === 'true';
    if (isExpanded && !lang.firstElementChild.contains(event.target)) {
        lang.firstElementChild.setAttribute('aria-expanded', 'false');
       
    }
  });
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
   
    if (window.scrollY > 0) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
 
  //nav-tools
  const searchBox=nav.querySelector('.nav-tools');
  const searchContainer=document.createElement('div');
  searchContainer.classList.add('search-container');
  searchContainer.innerHTML=`<form action="https://www.google.com/search" method="get"><input type="text" name="q" placeholder="SEARCH" required></form>`
  searchBox.append(searchContainer);
 
 
  block.prepend(utility);
  block.append(regForm);
  nav.setAttribute('aria-expanded', 'false');
  decorateIcons(block);
  block.append(nav);
 
}