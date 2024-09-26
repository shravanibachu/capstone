export async function decorate(block) {
    const formAnchor = block.querySelector('a[href$=".json"]');
    const formURL = formAnchor ? formAnchor.href : 'https://main--eds-training--eds-kunal.hlx.page/registration-form.json';
  
    async function fetchFormData(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
      }
    }
  
    function createSelect(fd) {
      const select = document.createElement('select');
      select.id = fd.Field;
      if (fd.Placeholder) {
        const ph = document.createElement('option');
        ph.textContent = fd.Placeholder;
        ph.setAttribute('selected', '');
        ph.setAttribute('disabled', '');
        select.append(ph);
      }
      fd.Options.split(',').forEach((o) => {
        const option = document.createElement('option');
        option.textContent = o.trim();
        option.value = o.trim();
        select.append(option);
      });
      if (fd.Mandatory === 'true') {
        select.setAttribute('required', 'required');
      }
      return select;
    }
  
    function createInput(fd) {
      const input = document.createElement('input');
      input.type = fd.Type;
      input.id = fd.Field;
      input.setAttribute('placeholder', fd.Placeholder);
      if (fd.Mandatory === 'true') {
        input.setAttribute('required', 'required');
      }
      return input;
    }
  
    function createLabel(fd) {
      const label = document.createElement('label');
      label.setAttribute('for', fd.Field);
      label.textContent = fd.Label;
      if (fd.Mandatory === 'true') {
        label.classList.add('required');
      }
      return label;
    }
  
    function createTextArea(fd) {
      const textarea = document.createElement('textarea');
      textarea.id = fd.Field;
      textarea.setAttribute('placeholder', fd.Placeholder);
      if (fd.Mandatory === 'true') {
        textarea.setAttribute('required', 'required');
      }
      return textarea;
    }
  
    function createButton(fd) {
      const buttonContainer = document.createElement('p');
      buttonContainer.classList.add('button-container');
      const horizontalLine=document.createElement('hr');
      const italics=document.createElement('em');
      const button = document.createElement('button');
      button.textContent = fd.Label;
      button.classList.add('button');
      button.classList.add('secondary');
      italics.append(button);
      buttonContainer.append(italics);
      buttonContainer.append(horizontalLine);
      return buttonContainer;
    }
  
    function createHeading(fd, level) {
      const heading = document.createElement(level);
      heading.textContent = fd.Label;
      return heading;
    }
  
    async function createFormFromData(json) {
      const form = document.createElement('form');
      json.data.forEach((fd) => {
        const fieldWrapper = document.createElement('div');
        fieldWrapper.className = 'field-wrapper';
        
        switch (fd.Type) {
          case 'select':
            fieldWrapper.append(createLabel(fd));
            fieldWrapper.append(createSelect(fd));
            break;
          case 'text-area':
            fieldWrapper.append(createLabel(fd));
            fieldWrapper.append(createTextArea(fd));
            break;
          case 'checkbox':
            fieldWrapper.append(createInput(fd));
            fieldWrapper.append(createLabel(fd));
            break;
          case 'plaintext':
            fieldWrapper.append(createHeading(fd, 'h4'));
            break;
          case 'submit':
            fieldWrapper.append(createButton(fd));
            break;
          default:
            fieldWrapper.append(createLabel(fd));
            fieldWrapper.append(createInput(fd));
        }
        form.append(fieldWrapper);
      });
      return form;
    }
  
    const jsonData = await fetchFormData(formURL);
  
    if (jsonData) {
      const form = await createFormFromData(jsonData);
      block.innerHTML = '';
      block.appendChild(form);
    } else {
      block.innerHTML = '<p>Error loading form data. Please try again later.</p>';
    }
  }
  
  export default decorate;
  