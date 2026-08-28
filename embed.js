// embed.js - 自动检测内嵌模式（iframe / ?embed=true / #embed）
(function() {
  function checkEmbed() {
    try {
      const isIframe = window.self !== window.top;
      const urlParams = new URLSearchParams(window.location.search);
      const isEmbedQuery = urlParams.get('embed') === 'true' || urlParams.get('clean') === 'true' || urlParams.get('view') === 'embed';
      const isEmbedHash = window.location.hash === '#embed';

      if (isIframe || isEmbedQuery || isEmbedHash) {
        document.documentElement.classList.add('embed-mode');
        if (document.body) {
          document.body.classList.add('embed-mode');
        }
      } else {
        document.documentElement.classList.remove('embed-mode');
        if (document.body) {
          document.body.classList.remove('embed-mode');
        }
      }
    } catch (e) {
      // 跨域 iframe 安全回退
      document.documentElement.classList.add('embed-mode');
      if (document.body) {
        document.body.classList.add('embed-mode');
      }
    }
  }

  // 页面初次加载时执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkEmbed);
  } else {
    checkEmbed();
  }

  // 监听 SPA 单页跳转与 Hash / History 变动
  window.addEventListener('popstate', checkEmbed);
  window.addEventListener('hashchange', checkEmbed);

  // 针对 Mintlify Next.js 路由跳转的 DOM 变动监听
  const observer = new MutationObserver(function() {
    checkEmbed();
  });
  
  if (document.documentElement) {
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
})();
