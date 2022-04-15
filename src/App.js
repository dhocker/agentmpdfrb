/*
    AgentMPDFRB - web app for controlling an mpd instance
    Copyright © 2022  Dave Hocker (email: AtHomeX10@gmail.com)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the LICENSE file for more details.

    You should have received a copy of the GNU General Public License
    along with this program (the LICENSE file).  If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainNavBar } from './components/main_navbar';
import { Player } from './player';
import { About } from './about';
import { MainFooter } from './components/main_footer';
import { EditPlaylist } from "./edit_playlist";
import { SettingsForm } from "./settings_form";
import { UpdateDatabase } from "./update_database";
import { MPDStatusPage } from "./mpd_status_page";

function App() {
  // That all pages are inside the container
  return (
    <main className="container">
      <MainNavBar></MainNavBar>
      <Routes>
        <Route path="/" element=<Player /> exact />
        <Route path="/mpdstatus" element=<MPDStatusPage /> exact />
        <Route path="/editplaylist" element=<EditPlaylist /> exact />
        <Route path="/updatedatabase" element=<UpdateDatabase /> exact />
        <Route path="/settingsform" element=<SettingsForm /> exact />
        <Route path="/about" element=<About /> exact />
        <Route component={Error} />
      </Routes>
      <MainFooter>
      </MainFooter>
    </main>
  );
}

export default App;
