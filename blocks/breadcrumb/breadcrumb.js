import ffetch from '../../scripts/ffetch.js';
import { createElementWithClasses } from '../../scripts/utils.js';


function generatePathArray(path) {
    const parts = path.split('/');
    let pathArray = [];
    let currentPath = ''; 

    parts.forEach((part) => {
        if (part) { 
            currentPath += `/${part}`;
            pathArray.push(`${currentPath}/`);
        }
    });

    return pathArray;

}


async function getItems() {
  let itemPaths = generatePathArray(window.location.pathname);
  itemPaths[itemPaths.length - 1] = itemPaths[itemPaths.length - 1].replace(/\/$/, '');
  itemPaths = itemPaths.length > 0 ? itemPaths : [];
  const pages = await ffetch('/query-index.json')
    .filter((page) => itemPaths.includes(page.path))
    .all();
  const items = itemPaths.map((itemPath) => {
    // get the title from the pages, based on its path
    const page = pages.find((entry) => entry.path === itemPath);
    let title = page && page.title !== '' ? page.title : page.title;
    return {
      title,
      url: `${itemPath}`,
    };
  });

  return items;
}


export default async function decorate(block) {
  const breadcrumbs = createElementWithClasses('nav');
  breadcrumbs.className = 'breadcrumbs';
  const items = await getItems();
  block.innerHTML = '';
  const ol = createElementWithClasses('ol');
  ol.append(
    ...items.map((item) => {
      const li = createElementWithClasses('li');
      if (item.url === window.location.pathname) {
        li.classList.add('active');
        li.setAttribute('aria-current', 'page');
      }
      if (item.url && item.url !== window.location.pathname) {
        const a = createElementWithClasses('a');
        a.href = item.url;
        a.textContent = item.title;
        li.append(a);
      } else {
        li.textContent = item.title;
      }
      return li;
    }),
  );


  breadcrumbs.append(ol);
  block.append(breadcrumbs);
}