/* global hexo */

'use strict';

let cheerio;

hexo.extend.filter.register('after_post_render', data => {
  var config = hexo.config.auto_excerpt;
  // Exit if `auto_excerpt` option disable in NexT.
  if (!config || !config.enable || data.excerpt !== '') return;

  if (!cheerio) cheerio = require('cheerio');

  const $ = cheerio.load(data.content, { decodeEntities: false });
  const elements = $.root().children();
  if (!elements.length) return;

  var length = 0;
  const _$ = cheerio.load('', { decodeEntities: false });
  elements.each((i, o) => {
    if (length > config.length) {
      return;
    }
    length += $(o).text().length;
    _$.root().append($(o).remove());
  });

  if ($.root().children().length) {
    data.excerpt = _$.html();
    data.more = $.html();
    data.content = data.excerpt + '<a id="more"></a>' + data.more;
  } else {
    data.excerpt = '';
    data.more = data.content;
  }
}, 20);
