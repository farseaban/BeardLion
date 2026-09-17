import { useEffect, useState } from 'react';

// 주소창의 # 뒤를 화면 이름으로 씁니다. 예) #/day1, #/guide/bulguksa
function parse() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [page = 'home', param = ''] = raw.split('/');
  return { page: page || 'home', param };
}

export function navigate(page, param) {
  window.location.hash = param ? `#/${page}/${param}` : `#/${page}`;
}

export function useHashRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
