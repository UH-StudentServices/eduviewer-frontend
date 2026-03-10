/*
 * This file is part of Eduviewer-frontend.
 *
 * Eduviewer-frontend is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Eduviewer-frontend is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Eduviewer-frontend.  If not, see <http://www.gnu.org/licenses/>.
 */
import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { componentOnReady } from '../utils';

/**
 * Combines web-component owned classes (e.g. "hydrated") with React-controlled classes.
 *
 * This hook is only needed when `postMountClassName` can change after mount.
 *
 * If your class names are static and do not change after mount, prefer a normal
 * `className` prop without this hook.
 *
 * @param {Object} ref - Web component ref.
 * @param {string} postMountClassName - React-controlled classes.
 * @returns {string} - Merged web-component + React class names.
 *
 * @example
 * const ref = useRef(null);
 * const className = useWebComponentClassName(
 *   ref,
 *   condition ? 'my-class' : 'my-other-class'
 * );
 * return <eduviewer-ds-component ref={ref} className={className} />;
 */
const useWebComponentClassName = (ref, postMountClassName = '') => {
  const [mountedClassName, setMountedClassName] = useState('');

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const el = ref?.current;
      if (!el) return;

      await componentOnReady(el);
      if (cancelled) return;

      setMountedClassName(el.className || el.classList?.toString() || '');
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [ref]);

  return useMemo(
    () =>
      (mountedClassName ? classNames(mountedClassName, postMountClassName) : ''),
    [mountedClassName, postMountClassName]
  );
};

export default useWebComponentClassName;
