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

import React from "react";
import {ajaxGet} from "./components/ajax_utils";
import {Markdown} from "./components/markdown";

export class About extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      about: "Loading..."
    };

    this.loadAbout = this.loadAbout.bind(this);
  }

  componentDidMount() {
    this.loadAbout().then();
  }

  // Get the contents of the readme.md file (Markdown)
  async loadAbout() {
    var $this = this;
    let md = await ajaxGet("/markdown/README");
    if (md !== null) {
      $this.setState({about: md.markdown});
    }
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="jumbotron text-center h-25 p-1 my-2">
            <h1 className="text-primary">About (README.md)</h1>
        </div>
        <div className="card my-5">
          <div className="card-body">
            <Markdown text={this.state.about}/>
          </div>
        </div>
      </div>
    )
  }
}
