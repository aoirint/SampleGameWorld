/*

  Tabise - Semi-auto tab interpreter -

-----

The MIT License (MIT)
Copyright (c) 2016 Kanomiya

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

-----

  ### Dependencies
  - JQuery


  ### How-to-Install

  1. Add script tag to the head tag, and setup it to load this js file.


  ### Usage
  
  1. Create a container tag(div, etc). And add an attribute 'data-tab-container' to it.
  2. Create tab tags(div, etc) in the container tag, add an attribute 'data-tab' to it, and set the attribute value as the name of the tab.
  3. Finish.
  
*/

var Tabise = {};

$(function()
{
  $('head').append($('<style>').text(Tabise.css));
  
  var observer = new MutationObserver(function(mutations)
  {
    $(mutations).each(function()
    {
      var target = this.target;
      
      $(this.addedNodes).each(function()
      {
        if (this.dataset.tab != undefined)
        {
          var id = target.dataset.tabCount;
          
          var tabListElm = $('<li>').text(this.dataset.tab).attr('data-tab-id-for', id)[0];
          $(target).children('[data-tab-list]').append(tabListElm);

          if (id == 0)
          {
            this.dataset.tabSelected = '';
            tabListElm.dataset.tabSelectedFor = '';
          }
          
          this.dataset.tabId = id;
          
          target.dataset.tabCount ++;
        }
      });
      
      $(this.removedNodes).each(function()
      {
        if (this.dataset.tab != undefined)
        {
          var id = this.dataset.tabId;
          
          $(target).children('[data-tab-list]').children('[data-tab-id-for=' + id + ']').remove();
        
          target.dataset.tabCount --;
          
          var i = 0;
          var tabElms = $(target).children('[data-tab-id]');
          
          tabElms.each(function()
          {
            this.dataset.tabId = i;
            i++;
          });
          
          i = 0;
          
          var tabList = $(target).children('[data-tab-list]').children('[data-tab-id-for]');
          tabList.each(function()
          {
            if (this.dataset.tabIdFor == id) return;
            
            this.dataset.tabIdFor = i;
            i++;
          });
          
          i = id;
          var done = false;
          
          while (0 <= id && ! done)
          {
            if (i < tabList.length)
            {
              tabList.removeAttr('data-tab-selected-for');
              tabElms.removeAttr('data-tab-selected');
              
              $(tabList[i]).attr('data-tab-selected-for', '');
              $(tabElms[i]).attr('data-tab-selected', '');
              
              done = true;
              break;
            }
            
            i --;
          }
        }
        
      });
    });
  });
  
  var config =
  {
    childList: true,
    subtree: true,
  };
  
  Tabise.parse(observer, config);
  
  $(document).on('click', '[data-tab-list] li', function()
  {
    var tabContainer = $(this).closest('[data-tab-container]');
    var tabElms = tabContainer.children('[data-tab]');
    $(tabElms).removeAttr('data-tab-selected');
    tabContainer.children('[data-tab-list]').children().removeAttr('data-tab-selected-for');
    
    tabElms[this.dataset.tabIdFor].dataset.tabSelected = '';
    this.dataset.tabSelectedFor = '';
  });
  
});

{
Tabise.css = String.raw`
/* Tabise Auto Insertion Style */


[data-tab]
{
  display: none;
  margin: 1em;
  flex: auto;
}

[data-tab-selected]
{
  display: inherit;
}

[data-tab-container]
{
  border-width: 2px;
  border-style: groove;
  border-color: threedface;
}

[data-tab-container="vertical"]:not([data-tab])
{
  display: flex;
}

[data-tab-container="vertical"][data-tab-selected]
{
  display: flex;
}

[data-tab-list]
{
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: small;
  background: #eee;
}

[data-tab-container="horizontal"] > [data-tab-list]
{
  display: flex;
  border-bottom: 2px solid threedface;
}

[data-tab-container="vertical"] > [data-tab-list]
{
  border-right: 2px solid threedface;
  width: 15%;
  flex-shrink: 2;
}

[data-tab-id-for]
{
  border: 1px solid gray;
  cursor: pointer;
  padding: 0.2em 0.2em;
}

[data-tab-container="horizontal"] > [data-tab-list] [data-tab-id-for]
{
  display: inline-block;
  flex: auto;
  max-width: 15%;
}

[data-tab-container="vertical"] > [data-tab-list] [data-tab-id-for]
{
  display: block;
}

[data-tab-selected-for]
{
  background: white;
}

`;
}

Tabise.TabType = {
  HORIZONTAL: 0,
  VERTICAL: 1,
  
  reverse: function()
  {
    reved = {};
    for (key in Tabise.TabType)
    {
      reved[Tabise.TabType[key]] = key;
    }
    
    return reved;
  },
  
  fromString: function(string)
  {
    var upp = string.toUpperCase();
    if (upp in Tabise.TabType) return Tabise.TabType[upp];
    console.log("FOUND unknown string of Tabise.TabType: " + string);
  },
  
  toString: function(tabType)
  {
    return Tabise.TabType.reverse()[tabType].toLowerCase();
  },
};


Tabise.parse = function(observer, config)
{
  $(document).find('[data-tab-container]').each(function()
  {
    Tabise.parseContainer(this);
    
    if (observer != undefined) observer.observe(this, config);
  });
  
};

Tabise.parseContainer = function(container)
{
  var tabType = Tabise.TabType.HORIZONTAL;
  if (container.dataset.tabContainer)
  {
    var tmp = Tabise.TabType.fromString(container.dataset.tabContainer);
    if (tmp != undefined)
    {
      tabType = tmp;
    }
  }
  
  container.dataset.tabContainer = Tabise.TabType.toString(tabType);

  var tabElms = $(container).children('[data-tab]');
  
  var tabList = $('<ul>')[0];
  tabList.dataset.tabList = '';
  
  var i = 0;
  var len = tabElms.length;
  
  tabElms.each(function()
  {
    if ($(this).parent('[data-tab-ignore]').length != 0) return;
    
    this.dataset.tabId = i;
    
    var tabListElm = $('<li>').text(this.dataset.tab).attr('data-tab-id-for', i);
    $(tabList).append(tabListElm);
    
    ++i;
  });
  
  if (tabElms[0] != undefined)
  {
    $(tabElms[0]).before(tabList);
    tabElms[0].dataset.tabSelected = '';
    tabList.children[0].dataset.tabSelectedFor = '';
  } else
  {
    $(container).prepend(tabList);
  }
  
  container.dataset.tabCount = i;
};
