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
  Tabise.parse();
});

{
Tabise.css = String.raw`
/* Tabise Auto-Inserting Style */

[data-tab-container]
{
  border-width: 2px;
  border-style: groove;
  border-color: threedface;
  border-collapse: collapse;
  
  display: table;
}

[data-tab-list]
{
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: small;
  border-bottom: 2px solid threedface;
}

[data-tab-id-for]
{
  display: inline-block;
  border: 1px solid gray;
  padding: 0.25em 2.5em;
  cursor: pointer;
  background: #eee;
}

[data-tab-selected-for]
{
  background: white;
}

[data-tab]
{
  display: none;
  margin: 1em;
}

[data-tab-selected]
{
  display: inherit;
}

`;
}

Tabise.parse = function()
{
  $(document).find('[data-tab-container]').each(function()
  {
    Tabise.parseContainer(this);
  });
};

Tabise.parseContainer = function(container)
{
  var tabElms = $(container).children('[data-tab]');
  
  var tabList = $('<ul>')[0];
  tabList.dataset.tabList = '';
  
  $(container).prepend(tabList);
  
  var i = 0;
  var len = tabElms.length;
  
  tabElms.each(function()
  {
    this.dataset.tabId = i;
    
    var tabListElm = $('<li>')[0];
    tabListElm.innerText = this.dataset.tab;
    tabListElm.dataset.tabIdFor = i;
    
    $(tabList).append(tabListElm);
    
    $(tabListElm).on('click', function()
    {
      tabElms.each(function()
      {
        this.removeAttribute('data-tab-selected');
      });

      $(tabList).children().each(function()
      {
        this.removeAttribute('data-tab-selected-for');
      });
      
      tabElms[this.dataset.tabIdFor].dataset.tabSelected = '';
      this.dataset.tabSelectedFor = '';
    });
    
    ++i;
  });

  tabElms[0].dataset.tabSelected = '';
  tabList.children[0].dataset.tabSelectedFor = '';
  container.dataset.tabCount = i;
};
