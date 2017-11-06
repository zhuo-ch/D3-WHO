## General Description

![WHOviewer-screenshot](http://www.whoviewer.us/lib/whoviewer.png)

[WHOviewer](http://www.whoviewer.us/) - A World Health Organization data visualization. The WHO has a treasure trove worth of valuable data collected over many years through the hard work of many individuals. However, this data is not very easy to digest. At the moment, anyone can go to [WHO](http://www.who.int/gho/en/) and browse through the data library. What the user will come across are many data points - many of which are presented in tables. [WHOviewer](http://www.whoviewer.us/) is an attempt to create an interactive interface for users to easily consume the data.

## Features

* Color-coded globe for users to easily see how a specific WHO indicator affects one countries in relation to each other.
* Fully interactive globe that rotates on its own and can be rotated manually to locate a country or region manually.
* Clicking on a country will bring up an in-depth pie chart breaking down WHO indicator causes by relation.
* Pie Chart side bar with detailed information.
* Hover effects to easily highlight pie chart segments and their detailed breakdown.

## Tech and Implementation

* Globe is rendered using D3.js and Canvas. A GeoJSON object is passed to D3.js to generate the coordinates for each individual country. Although, SVG is more commonly used with D3.js for the data binding synergy, Canvas is used for this portion instead due to performance concerns (using SVG for this projection would create a DOM element for each country).
* D3.js and SVG is used to generate the Pie Chart. For this projection, there are substantially fewer elements to generate and SVG is the choice for data binding and to more easily implement hover effects.

## Issues and Todos

This is currently a proof of concept and not a complete project.

* [WHOviewer](http://www.whoviewer.us/) currently only supports curated data. Top level indicators and lower level causes have been hand picked.
* Needs a robust algorithm to better index top level indicators and lower level causes to make this app compatible with the entire WHO database.
* Future implementations might incorporate a full menu to select from the entire WHO database.
