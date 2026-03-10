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
import React, { useRef } from 'react';
import { string } from 'prop-types';

import useWebComponentClassName from './useWebComponentClassName';
import renderWithRoot from '../../jest/utils/renderWithRoot';
import * as utils from '../utils';

function Host({ postMountClassName }) {
  const ref = useRef(null);
  const className = useWebComponentClassName(ref, postMountClassName);

  return (
    <eduviewer-ds-combobox
      ref={ref}
      data-testid="wc"
      className={className}
    />
  );
}

Host.propTypes = {
  postMountClassName: string.isRequired
};

function HostWithoutRefTarget({ postMountClassName }) {
  const ref = useRef(null);
  const className = useWebComponentClassName(ref, postMountClassName);

  return <div data-testid="no-ref-target" className={className} />;
}

HostWithoutRefTarget.propTypes = {
  postMountClassName: string.isRequired
};

describe('useWebComponentClassName', () => {
  /** @type {import('../../jest/utils/renderWithRoot').RenderWithRootApi} */
  let view;
  let componentOnReadySpy;

  beforeEach(() => {
    view = renderWithRoot();

    componentOnReadySpy = jest
      .spyOn(utils, 'componentOnReady')
      .mockImplementation(async (el) => {
        el.classList.add('hydrated');
        return el;
      });
  });

  afterEach(async () => {
    await view.unmount();
    jest.restoreAllMocks();
  });

  it('merges web-component class with React class after ready', async () => {
    await view.render(<Host postMountClassName="react-class" />);
    await view.flush();

    const el = view.queryByTestId('wc');
    expect(componentOnReadySpy).toHaveBeenCalledWith(el);
    expect(el.className).toContain('hydrated');
    expect(el.className).toContain('react-class');
  });

  it('updates postMountClassName while keeping mounted class', async () => {
    await view.render(<Host postMountClassName="first" />);
    await view.flush();

    await view.render(<Host postMountClassName="second" />);
    await view.flush();

    const el = view.queryByTestId('wc');
    expect(el.className).toContain('hydrated');
    expect(el.className).toContain('second');
    expect(el.className).not.toContain('first');
  });

  it('returns empty class and does not call componentOnReady when ref has no element', async () => {
    await view.render(<HostWithoutRefTarget postMountClassName="react-class" />);
    await view.flush();

    const el = view.queryByTestId('no-ref-target');
    expect(componentOnReadySpy).not.toHaveBeenCalled();
    expect(el.className).toBe('');
  });
});
