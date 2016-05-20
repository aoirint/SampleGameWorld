
var XMLise = {};

$(function()
{
  $('head').append($('<style>').text(XMLise.css));
  
  XMLise.parseInstanceButton();
  XMLise.parseRemoveButton();
});

{
XMLise.css = String.raw`
/* XMLise Auto Insertion Style */

[data-xml-templete]
{
  display: none;
}

`;
}

XMLise.asXML = function(container, ns, rootName)
{
  var xml = document.implementation.createDocument(ns, rootName);
  var root = xml.documentElement;
  
  XMLise.fillXML(container, xml, root);
  
  return xml;
};

XMLise.fillXML = function(domElm, xml, xmlElm)
{
  $(domElm).children('[data-xml-name]').each(function()
  {
    var nElm = xml.createElement(this.dataset.xmlName);
    $(nElm).text($(this).val());
    $(xmlElm).append(nElm);
    
    $(this).children(':not([data-xml-templete])').each(function()
    {
      XMLise.fillXML(this, xml, nElm);
    });
  });
  
  $(domElm).children(':not([data-xml-name]):not([data-xml-templete])').each(function()
  {
    $(this).children(':not([data-xml-templete])').each(function()
    {
      XMLise.fillXML(this, xml, xmlElm);
    });
  });
  
};


XMLise.parseInstanceButton = function()
{
  $(document).find('[data-xml-append-instance-of]').each(function()
  {
    var btnElm = this;
    var templateName = btnElm.dataset.xmlAppendInstanceOf;
    var template = $(btnElm).parent().find('[data-xml-templete=' + templateName + ']')[0];
    var target = $(btnElm).parent();
    
    if ($(btnElm).attr('data-xml-append-instance-for'))
    {
      target = $('[data-xml-name=' + $(btnElm).attr('data-xml-append-instance-for') + ']')[0];
    }
    
    if (template == undefined)
    {
      console.log('FOUND unknown/unreachable template reference: ' + templateName);
      return ;
    }
    
    if (target == undefined)
    {
      console.log('FOUND unknown/unreachable target reference: ' + $(btnElm).attr('data-xml-append-instance-for'));
      return ;
    }
    
    $(btnElm).on('click', function()
    {
      $(target).append($(template).clone(true).removeAttr('data-xml-templete').children());
    });
  });
  
};

XMLise.parseRemoveButton = function()
{
  if (Tabise)
  {
    $(document).on('click', '[data-xml-remove-selected-tab-of]', function(e)
    {
      var btnElm = e.target;
      var tabContainer = $(btnElm).parent().children('[data-tab-container][data-xml-name=' + btnElm.dataset.xmlRemoveSelectedTabOf + ']')[0];
      var selectedTab = $(tabContainer).children('[data-tab-selected]')[0];
      
      if (selectedTab) $(selectedTab).remove();
    });
    
  } else
  {
    console.log('Invalid operation: Not Found Tabise');
  }
  
};




/*
XMLise.fillXML = function(container, xml, xmlElm)
{
  $(container).children().each(function()
  {
      var nElm = xmlElm;
      
      if (this.dataset.group)
      {
        nElm = xml.createElement(this.dataset.group);
        xmlElm.appendChild(nElm);
      }
      
      XMLise.fillXML(this, xml, nElm);
  });

  if (container.dataset.name)
  {
      var nElm = xml.createElement(container.dataset.name);
      nElm.textContent = container.value;
      xmlElm.appendChild(nElm);
  }

  if (container.dataset.attr)
  {
      xmlElm.setAttribute(container.dataset.attr, container.value);
  }
};


XMLise.fromXMLText = function(container, xmlText)
{
  var xprs = new DOMParser();
  var xml = xprs.parseFromString(xmlText, 'text/xml');
  XMLise.fromXML(container, xml);
  
  return xml;
}

XMLise.fromXML = function(container, xml)
{
  var root = xml.documentElement;
  
  // XMLise.fillFromXML(container, xml, root);
  XMLise.fillFromXMLGroup(container, root, 'general');
}

XMLise.fillFromXML = function(docElm, xml, xmlElm)
{
  $(docElm).children().each(function()
  {
      var nElm = xmlElm;
      
      if (this.dataset.group)
      {
        var docThis = this;
        var grp = docThis.dataset.group;
        
        nElm = $(xmlElm).children(grp)[0];
      }
      
      if (nElm) XMLise.fillFromXML(this, xml, nElm);
    });

  if (docElm.dataset.name == xmlElm.tagName)
  {
    $(docElm).text(xmlElm.textContent);
  }
  
  if (docElm.dataset.attr && xmlElm.hasAttribute(docElm.dataset.attr))
  {
      $(docElm).val(xmlElm.getAttribute(docElm.dataset.attr));
  }
  
  
}

XMLise.fillFromXMLGroup = function(container, xmlContainer, groupName)
{
  var group = $(container).find('[data-group="' + groupName + '"]');
  
  $(xmlContainer).find(groupName).each(function()
  {
    $(this).children().each(function()
    {
      var tagName = this.tagName;
      var xmlElm = this;
      
      group.find("[data-name]").each(function()
      {
        if (this.dataset.name && this.dataset.name == tagName)
        {
          $(this).val(xmlElm.textContent);
        }
      });
    });
  });
  
}

*/