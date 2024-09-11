import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent='';
  const footerDivContainer=document.createElement('div');
  const footerDivSpace=document.createElement('div');
  footerDivSpace.classList.add('blank-space');
  const footerClasses=['footer-nav','footer-text'];
  let index=0;
  while(fragment.firstElementChild){
    fragment.firstElementChild.classList.add(footerClasses[index]);
    footerDivContainer.append(fragment.firstElementChild)
    if(index==0){
      footerDivContainer.append(footerDivSpace);
    }
    index+=1;
  }
  block.append(footerDivContainer);
}