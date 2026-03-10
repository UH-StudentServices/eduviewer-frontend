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
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Render function for the test root.
 * Renders or updates UI in the root and waits for React updates.
 *
 * @callback RenderWithRootRender
 * @param {import('react').ReactNode} ui React node to render.
 * @returns {Promise<void>}
 */

/**
 * Cleanup function for the test root.
 * Unmounts the root and removes its container from the DOM.
 *
 * @callback RenderWithRootUnmount
 * @returns {Promise<void>}
 */

/**
 * Flush function for pending React work.
 * Waits one microtask tick inside `act`.
 *
 * @callback RenderWithRootFlush
 * @returns {Promise<void>}
 */

/**
 * Query helper by `data-testid`.
 *
 * @callback RenderWithRootQueryByTestId
 * @param {string} testId Test id value to query.
 * @returns {Element | null}
 */

/**
 * API returned by `renderWithRoot`.
 *
 * @typedef {object} RenderWithRootApi
 * @property {HTMLDivElement} container Root container element.
 * @property {RenderWithRootRender} render Render/update helper.
 * @property {RenderWithRootUnmount} unmount Unmount + DOM cleanup helper.
 * @property {RenderWithRootFlush} flush Pending-effects flush helper.
 * @property {RenderWithRootQueryByTestId} queryByTestId `data-testid` query helper.
 */

/**
 * Minimal React test harness for hook tests using only `react` + `react-dom`.
 *
 * Creates a detached root and returns helpers to render/update, flush effects,
 * query by `data-testid`, and unmount/cleanup.
 * 
 * This is not intended for testing actual UI interactions, but only for testing hook logic.
 * For testing UI interactions use Playwright.
 *
 * @returns {RenderWithRootApi}
 */
const renderWithRoot = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  const render = async (ui) => {
    await act(async () => {
      root.render(ui);
    });
  };

  const unmount = async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  };

  const flush = async () => {
    await act(async () => {
      await Promise.resolve();
    });
  };

  const queryByTestId = (testId) =>
    container.querySelector(`[data-testid='${testId}']`);

  return {
    container,
    render,
    unmount,
    flush,
    queryByTestId
  };
};

export default renderWithRoot;
