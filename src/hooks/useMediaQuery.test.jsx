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
import React, { act } from 'react';
import { string } from 'prop-types';

import renderWithRoot from '../../jest/utils/renderWithRoot';
import useMediaQuery from './useMediaQuery';

function Host({ query }) {
  const matches = useMediaQuery(query);
  return <div data-testid="media-match">{String(matches)}</div>;
}

Host.propTypes = {
  query: string.isRequired
};

describe('useMediaQuery', () => {
  /** @type {import('../../jest/utils/renderWithRoot').RenderWithRootApi} */
  let view;
  /** @type {Map<string, (event: { matches: boolean, media: string }) => void>} */
  let listeners;
  /** @type {Record<string, boolean>} */
  let matchesByQuery;

  const queryA = '(max-width: 600px)';
  const queryB = '(min-width: 1000px)';

  beforeEach(() => {
    view = renderWithRoot();
    listeners = new Map();
    matchesByQuery = { [queryA]: true, [queryB]: false };

    globalThis.matchMedia.mockImplementation(
      /** @param {string} query */
      (query) => ({
        get matches() {
          return Boolean(matchesByQuery[query]);
        },
        media: query,
        addEventListener: (event, cb) => {
          if (event === 'change') listeners.set(query, cb);
        },
        removeEventListener: (event, cb) => {
          if (event === 'change' && listeners.get(query) === cb) listeners.delete(query);
        }
      })
    );
  });

  afterEach(async () => {
    await view.unmount();
    globalThis.matchMedia.mockReset();
  });

  it('returns initial match state', async () => {
    await view.render(<Host query={queryA} />);
    await view.flush();

    expect(view.queryByTestId('media-match').textContent).toBe('true');
  });

  it('updates when media query change event fires', async () => {
    await view.render(<Host query={queryB} />);
    await view.flush();

    expect(view.queryByTestId('media-match').textContent).toBe('false');

    matchesByQuery[queryB] = true;
    await act(async () => {
      listeners.get(queryB)?.({ matches: true, media: queryB });
    });
    await view.flush();

    expect(view.queryByTestId('media-match').textContent).toBe('true');
  });

  it('cleans old listener when query changes', async () => {
    await view.render(<Host query={queryA} />);
    await view.flush();

    await view.render(<Host query={queryB} />);
    await view.flush();

    matchesByQuery[queryA] = false;
    await act(async () => {
      listeners.get(queryA)?.({ matches: false, media: queryA });
    });
    await view.flush();
    expect(view.queryByTestId('media-match').textContent).toBe('false');

    matchesByQuery[queryB] = true;
    await act(async () => {
      listeners.get(queryB)?.({ matches: true, media: queryB });
    });
    await view.flush();
    expect(view.queryByTestId('media-match').textContent).toBe('true');
  });
});
