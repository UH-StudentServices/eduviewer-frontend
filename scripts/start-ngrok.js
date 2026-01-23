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
import 'dotenv/config';
import ngrok from '@ngrok/ngrok'; // eslint-disable-line import/no-extraneous-dependencies

// Gets endpoint online
const startNgrok = async () => {
  const listener = await ngrok.forward({
    addr: 8080,
    authtoken_from_env: true,
    basic_auth: [`${process.env.NGROK_USERNAME}:${process.env.NGROK_PASSWORD}`]
  });
  console.log(`Ingress established at: ${listener.url()}`);
};

// Delay is added to "ensure" the dev server is running
setTimeout(() => {
  startNgrok();
}, 3000);

process.stdin.resume();
