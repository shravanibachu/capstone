async function getQueryIndexJson(jsonURL,val){
    let pathname=null;
    if(val){
        pathname=jsonURL;
    }else{
        pathname=new URL(jsonURL);
    }

    const resp=await fetch(pathname);
    const json=await resp.json();
    return json.data;
}

function getTitle(page){
    return page.title;
}

function getDate(page){
    const timestamp=page.lastModified;
    const date=new Date(timestamp*1000);

    const options = {
        weekday: 'long',
        day: '2-digit',
        month: 'short', 
        year: 'numeric' 
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    const parts = formattedDate.split(' ');
    parts[2]=parts[2].replace(',','');
    const finalFormattedDate = `${parts[0].toUpperCase()} ${parts[1]} ${parts[2].toUpperCase()} ${parts[3]}`;
    return finalFormattedDate;
}

function createHTMLForBlock(json){
    const unorderedList=document.createElement('ul');
    const allListItems=[];
    json.forEach(page => {
        if(page.path.startsWith('/magazine/') && page.path!='/magazine/'){
            const listItem=document.createElement('li');
            const anchorTag=document.createElement('a');
            const titleSpan=document.createElement('span');
            titleSpan.classList.add('pageTitle');
            const dateSpan=document.createElement('span');
            dateSpan.classList.add('pageDate');

            titleSpan.innerHTML=getTitle(page);
            dateSpan.innerHTML=getDate(page);

            anchorTag.append(titleSpan);
            anchorTag.append(dateSpan);

            anchorTag.href='https://main--capstone--shravanibachu.hlx.live'+page.path;

            listItem.append(anchorTag);
           allListItems.push(listItem);
        }
    });

    const extractDate = (li) => {
        const dateText = li.querySelector('.pageDate').textContent.trim();
        return new Date(dateText);
      };

    allListItems.sort((a, b) => extractDate(b) - extractDate(a));
    allListItems.forEach(item => {
        unorderedList.append(item);
    });
    return unorderedList;
}
export default async function decorate(block){
    const articles=block.querySelector('a[href$=".json"]');
    const json=await getQueryIndexJson(articles.href,null);
    block.innerHTML='';
    const blockHTML=createHTMLForBlock(json);
    block.append(blockHTML);
}