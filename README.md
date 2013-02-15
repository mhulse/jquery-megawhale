# jQuery MegaWhale

### Like [Superfish](http://users.tpg.com.au/j_birch/plugins/superfish/), but for mega menus!

---

#### OPTIONS
		
* `animIn`: What animation object to use to show the submenus. Default: `{ opacity: 'show' }`.
* `animOut`: IBID, but for hiding. Default: `{ opacity: 'hide' }`.
* `arrow`: Markup to use for sub-menu arrow indicators; set to false to disable this feature. Default: `'<span class="mw-arrow">&#187;</span>'`
* `close`: Markup to use for sub-menu arrow indicators; set to false to disable this feature. Default: `<span class="mw-close">(X)</span>`.
* `delayIn`: The delay in milliseconds that the mouse can `hover` "inside" the menu before it opens. Default: `400`.
* `delayOut`: The delay in milliseconds that the mouse can `hover` "outside" the menu before it closes. Default: `700`.
* `easeIn`: Easing function in. Default: `swing`.
* `easeOut`: Easing function out. Default: `swing`.
* `eventOutside`: Detect click outside events? Default: `true`.
* `eventType`: One of `click`, `hover` or `hoverIntent`. Default: `hover`.
* `openClass`: Applied to opened `<li>`s. Default: `mw-open`.
* `speedIn`: Animation speed in. Default: `normal`.
* `speedOut`: Animation speed out. Default: `normal`.

**Callbacks:**

* `onInit`: After plugin data initialized.
* `onAfterInit`: After plugin initialization.
* `onBeforeShow`: Before reveal animation begins.
* `onShow`: After reveal animation ends.
* `onBeforeHide`: Before hide animation begins.
* `onHide`: After hide animation ends.
* `onStartOutside`: When outside events start.
* `onEndOutside`: When outside events end.

---

#### DEMO

Just **MegaKrill**:

[![qr code](http://chart.apis.google.com/chart?cht=qr&chl=https://github.com/registerguard/jquery-megawhale/&chs=240x240)](http://registerguard.github.com/jquery-megawhale/demo/)

… and here's a demo using **MegaWhale** and the [jQuery **MegaKrill** plugin](https://github.com/registerguard/jquery-megakrill):

[![qr code](http://chart.apis.google.com/chart?cht=qr&chl=https://github.com/registerguard/jquery-mega-demos/&chs=240x240)](http://registerguard.github.com/jquery-mega-demos/)

Resize the browser window to see the plugin(s) in action (Firefox 15+ users, check out [Responsive Design View](https://developer.mozilla.org/en-US/docs/Tools/Responsive_Design_View)).

---

#### LEGAL

Copyright © 2013 [Micky Hulse](http://hulse.me)/[The Register-Guard](http://registerguard.com)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.