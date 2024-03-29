/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.10.2 (2021-11-17)
 */
(function () {
    'use strict';

    var global$3 = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var global$2 = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

    var global$1 = tinymce.util.Tools.resolve('tinymce.util.I18n');

    var global = tinymce.util.Tools.resolve('tinymce.util.Tools');

    var getTocClass = function (editor) {
      return editor.getParam('toc_class', 'mce-toc');
    };
    var getTocHeader = function (editor) {
      var tagName = editor.getParam('toc_header', 'h2');
      return /^h[1-6]$/.test(tagName) ? tagName : 'h2';
    };
    var getTocDepth = function (editor) {
      var depth = parseInt(editor.getParam('toc_depth', '3'), 10);
      return depth >= 1 && depth <= 9 ? depth : 3;
    };

    var create = function (prefix) {
      var counter = 0;
      return function () {
        var guid = new Date().getTime().toString(32);
        return prefix + guid + (counter++).toString(32);
      };
    };

    var tocId = create('mcetoc_');
    var generateSelector = function (depth) {
      var i;
      var selector = [];
      for (i = 1; i <= depth; i++) {
        selector.push('h' + i);
      }
      return selector.join(',');
    };
    var hascookies = function (editor) {
      return readcookies(editor).length > 0;
    };
    var readcookies = function (editor) {
      var tocClass = getTocClass(editor);
      var headerTag = getTocHeader(editor);
      var selector = generateSelector(getTocDepth(editor));
      var cookies = editor.$(selector);
      if (cookies.length && /^h[1-9]$/i.test(headerTag)) {
        cookies = cookies.filter(function (i, el) {
          return !editor.dom.hasClass(el.parentNode, tocClass);
        });
      }
      return global.map(cookies, function (h) {
        var id = h.id;
        return {
          id: id ? id : tocId(),
          level: parseInt(h.nodeName.replace(/^H/i, ''), 10),
          title: editor.$.text(h),
          element: h
        };
      });
    };
    var getMinLevel = function (cookies) {
      var minLevel = 9;
      for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].level < minLevel) {
          minLevel = cookies[i].level;
        }
        if (minLevel === 1) {
          return minLevel;
        }
      }
      return minLevel;
    };
    var generateTitle = function (tag, title) {
      var openTag = '<' + tag + ' contenteditable="true">';
      var closeTag = '</' + tag + '>';
      return openTag + global$2.DOM.encode(title) + closeTag;
    };
    var generateTocHtml = function (editor) {
      var html = generateTocContentHtml(editor);
      return '<div class="' + editor.dom.encode(getTocClass(editor)) + '" contenteditable="false">' + html + '</div>';
    };
    var generateTocContentHtml = function (editor) {
      var html = '';
      var cookies = readcookies(editor);
      var prevLevel = getMinLevel(cookies) - 1;
      if (!cookies.length) {
        return '';
      }
      html += generateTitle(getTocHeader(editor), global$1.translate('Table of Contents'));
      for (var i = 0; i < cookies.length; i++) {
        var h = cookies[i];
        h.element.id = h.id;
        var nextLevel = cookies[i + 1] && cookies[i + 1].level;
        if (prevLevel === h.level) {
          html += '<li>';
        } else {
          for (var ii = prevLevel; ii < h.level; ii++) {
            html += '<ul><li>';
          }
        }
        html += '<a href="#' + h.id + '">' + h.title + '</a>';
        if (nextLevel === h.level || !nextLevel) {
          html += '</li>';
          if (!nextLevel) {
            html += '</ul>';
          }
        } else {
          for (var ii = h.level; ii > nextLevel; ii--) {
            if (ii === nextLevel + 1) {
              html += '</li></ul><li>';
            } else {
              html += '</li></ul>';
            }
          }
        }
        prevLevel = h.level;
      }
      return html;
    };
    var isEmptyOrOffscreen = function (editor, nodes) {
      return !nodes.length || editor.dom.getParents(nodes[0], '.mce-offscreen-selection').length > 0;
    };
    var insertToc = function (editor) {
      var tocClass = getTocClass(editor);
      var $tocElm = editor.$('.' + tocClass);
      if (isEmptyOrOffscreen(editor, $tocElm)) {
        editor.insertContent(generateTocHtml(editor));
      } else {
        updateToc(editor);
      }
    };
    var updateToc = function (editor) {
      var tocClass = getTocClass(editor);
      var $tocElm = editor.$('.' + tocClass);
      if ($tocElm.length) {
        editor.undoManager.transact(function () {
          $tocElm.html(generateTocContentHtml(editor));
        });
      }
    };

    var register$1 = function (editor) {
      editor.addCommand('mceInsertToc', function () {
        insertToc(editor);
      });
      editor.addCommand('mceUpdateToc', function () {
        updateToc(editor);
      });
    };

    var setup = function (editor) {
      var $ = editor.$, tocClass = getTocClass(editor);
      editor.on('PreProcess', function (e) {
        var $tocElm = $('.' + tocClass, e.node);
        if ($tocElm.length) {
          $tocElm.removeAttr('contentEditable');
          $tocElm.find('[contenteditable]').removeAttr('contentEditable');
        }
      });
      editor.on('SetContent', function () {
        var $tocElm = $('.' + tocClass);
        if ($tocElm.length) {
          $tocElm.attr('contentEditable', false);
          $tocElm.children(':first-child').attr('contentEditable', true);
        }
      });
    };

    var toggleState = function (editor) {
      return function (api) {
        var toggleDisabledState = function () {
          return api.setDisabled(editor.mode.isReadOnly() || !hascookies(editor));
        };
        toggleDisabledState();
        editor.on('LoadContent SetContent change', toggleDisabledState);
        return function () {
          return editor.on('LoadContent SetContent change', toggleDisabledState);
        };
      };
    };
    var isToc = function (editor) {
      return function (elm) {
        return elm && editor.dom.is(elm, '.' + getTocClass(editor)) && editor.getBody().contains(elm);
      };
    };
    var register = function (editor) {
      var insertTocAction = function () {
        return editor.execCommand('mceInsertToc');
      };
      editor.ui.registry.addButton('toc', {
        icon: 'toc',
        tooltip: 'Table of contents',
        onAction: insertTocAction,
        onSetup: toggleState(editor)
      });
      editor.ui.registry.addButton('tocupdate', {
        icon: 'reload',
        tooltip: 'Update',
        onAction: function () {
          return editor.execCommand('mceUpdateToc');
        }
      });
      editor.ui.registry.addMenuItem('toc', {
        icon: 'toc',
        text: 'Table of contents',
        onAction: insertTocAction,
        onSetup: toggleState(editor)
      });
      editor.ui.registry.addContextToolbar('toc', {
        items: 'tocupdate',
        predicate: isToc(editor),
        scope: 'node',
        position: 'node'
      });
    };

    function Plugin () {
      global$3.add('toc', function (editor) {
        register$1(editor);
        register(editor);
        setup(editor);
      });
    }

    Plugin();

}());
