(function () {
  if (typeof window === 'undefined') return;

  // 仅在 /standalone/ 独立模型文档路径下生效，不影响常规文档页面的侧栏与预加载
  function isStandalonePage() {
    return window.location.pathname.includes('/standalone/');
  }

  if (!isStandalonePage()) return;

  // -------------------------------------------------------------
  // 1. 拦截 IntersectionObserver：阻断 Next.js Link 预取监听
  // -------------------------------------------------------------
  if (window.IntersectionObserver) {
    const originalObserve = IntersectionObserver.prototype.observe;
    IntersectionObserver.prototype.observe = function (target) {
      if (
        target &&
        target.closest &&
        (target.closest('#sidebar') ||
          target.closest('#sidebar-content') ||
          target.closest('#navigation') ||
          target.closest('#mobile-nav') ||
          target.closest('nav'))
      ) {
        // 属于隐藏的侧栏或导航节点，直接丢弃，不予注册监听
        return;
      }
      return originalObserve.apply(this, arguments);
    };
  }

  // -------------------------------------------------------------
  // 2. 提取当前页面模型标识，用于放行当前模型自身的资源
  // -------------------------------------------------------------
  function getCurrentModelSlug() {
    const segments = window.location.pathname.replace(/\/$/, '').split('/');
    return segments.pop() || '';
  }

  // -------------------------------------------------------------
  // 3. 全局拦截 fetch：阻断针对其它模型的预拉取与数据请求
  // -------------------------------------------------------------
  if (window.fetch) {
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
      try {
        const url = typeof input === 'string' ? input : input?.url || '';
        const currentSlug = getCurrentModelSlug();

        // (1) 检查是否携带预取特征头
        const headers = init?.headers;
        let isPrefetch = false;

        if (headers) {
          if (headers instanceof Headers) {
            isPrefetch =
              headers.get('Purpose') === 'prefetch' ||
              headers.get('Sec-Purpose') === 'prefetch' ||
              headers.has('Next-Router-Prefetch') ||
              headers.has('x-nextjs-data');
          } else if (typeof headers === 'object') {
            isPrefetch =
              headers['Purpose'] === 'prefetch' ||
              headers['Sec-Purpose'] === 'prefetch' ||
              headers['Next-Router-Prefetch'] ||
              headers['x-nextjs-data'];
          }
        }

        if (
          !isPrefetch &&
          input instanceof Request &&
          (input.headers.get('Purpose') === 'prefetch' ||
            input.headers.get('Next-Router-Prefetch') ||
            input.headers.get('x-nextjs-data'))
        ) {
          isPrefetch = true;
        }

        if (isPrefetch) {
          // 静默挂起预取请求，避免控制台抛红且彻底阻止网络发包
          return new Promise(() => {});
        }

        // (2) 阻断非当前模型的 standalone 页面或 OpenAPI JSON 请求
        const isModelDataRequest =
          (url.includes('/standalone/') || url.includes('/api-reference/')) &&
          !url.endsWith('.js') &&
          !url.endsWith('.css') &&
          !url.endsWith('.woff') &&
          !url.endsWith('.woff2');

        if (isModelDataRequest && currentSlug && !url.includes(currentSlug)) {
          return new Promise(() => {});
        }
      } catch (e) {
        // 异常回退到原生 fetch，确保主流程可用
      }
      return originalFetch.apply(this, arguments);
    };
  }

  // -------------------------------------------------------------
  // 4. 清理侧栏与导航 DOM 节点
  // -------------------------------------------------------------
  function removeSidebarElements() {
    const selectors = [
      '#sidebar',
      '#sidebar-content',
      '#navigation',
      '#mobile-nav',
    ];
    selectors.forEach((selector) => {
      const el = document.querySelector(selector);
      if (el) {
        el.innerHTML = '';
        el.remove();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeSidebarElements);
  } else {
    removeSidebarElements();
  }

  // 针对 React / Next.js Hydration 动态挂载进行实时清理
  const observer = new MutationObserver(function () {
    removeSidebarElements();
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // 页面完全载入并稳定后断开 MutationObserver，释放性能
  setTimeout(function () {
    removeSidebarElements();
    observer.disconnect();
  }, 3000);
})();
