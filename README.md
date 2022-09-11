Imaginary Geo Itinerary
===

_Imaginary Geo Itinerary_ (IGI) is an image slideshow web application designed for 
presenting pictures from a road trip, such as hiking tours, bicycle journeys, etc:

![Screenshot from the app](./screenshots/app.png)

The left side pane shows the itinerary. It can be split in different groups. For example, 
in the image above the whole hiking tour was split into its four days. Each of the group
can again have multiple tracks. The screenshot shows that the second day consisted of a
taxi trip and the actual hiking trip. Every group can be either selected or unselected. Here,
Day 2, Day 3, and Day 4 are selected.

All tracks of all selected groups are shown in the map in the lower part of the screen. All image locations are shown, too.

The upper part of the app consists of the image slideshow. It slides through the pictures belonging
to the currently selected groups. The location of the current image is emphasized in the map.

IGI offers the possibility to either show the map only, the images only, or the combined view (see Presenting below).

## Using IGI
### Give it a try

To just run the app with a sample itinerary (see `itinerary`) folder, either clone the repository and
execute `npm i && npm run dev`, or download the released binary (if available) and put it into any running webserver.

### Prerequisites

You need the following prerequisites for using IGI:

* any web server, e.g. Apache, nginx, …
* a text editor and basic knowledge of JSON
* your tracks in form of GPX files
* pictures from your journey, together with their coordinates (unfortunately, it doesn't suffice to 
  have the coordinates stored inside the images, see Limitations below.)
* the IGI binaries (e.g. downloaded from Github's release page) __or__
* npm installed to build the app from scratch: `npm i && npm run build`. The binaries are then stored in the `dist` directory.

### Creating an itinerary

1. Move IGI's binaries into your web server.
2. Create a directory `itinerary` in the same directory where IGI is.
3. Move your images and GPX files into `itinerary`. You can use any subdirectory structure you like.
4. Replace the `favicon.png` by an appropriate image of your own. The favicon is not only shown
   in the browser's toolbar, but also in the general image area if the current group selection does not contain
   an image.
5. Download the sample `itenerary/index.json` file from this repository and adapt it to your needs. Most of the
   format is self-explanatory. Information on the non-self-explanatory parts:
   
   * The `map` property defines the center of the map if the initial selection of the group does not have any images.
   * The `info` property allows you to specify a link in the app info menu, which appears after pressing the (i)-button.
     This can be used to link to a legally required contact information if you plan to make the itinerary available to the public.
   * The `types` property defines the means of transport you used during the trip. Each type has a color and an optional
     symbol. These are used in the itinerary list and the map.
   * The coordinates in the image objects are `[lat, lng]`. We're using an array here because there could be a lot of
     images and this saves a few bytes compared to the object notation.
6. Navigate to your server's URL and enjoy your itinerary.

### Presenting

IGI opens in the default view, showing the itinerary, itinerary, and the first image of all pre-selected
groups. To select or deselect a group, click it in the itinerary. 

To cycle through the images, press '→' (or space) and '←'. To go to the next picture, you can also
click on the current picture. Alternatively, the current image can be selected by pressing a marker in the
map.

Press 'm' to make the map fullscreen, or press 'i' to make the image fullscreen. Press 'ESC' to 
reset to the default view.

Press 'h' to open the help menu. There, you find the keymapping, too.

## Limitations and Issues

IGI has the following limitations:

* The length of tracks is only shown if the respective group was selected at least once. This is because the tracks'
  length are stored in the GPX files which are only loaded at the moment they should be shown in the map. A workaround
  is to pre-select all groups in the itinerary. For large itineraries, this can lead to real long loading times.
* GPS coordinates stored inside the image files are not used because that would mean to download all image files
  to show the markers in the map. Thus, image coordinates must be given manually.
* If you want to display elevation data in the itinerary, you have to use the `info` field of the tracks. I don't use
  the elevation stored in the GPX file because it is not accurate and there is no easy and free way to load
  elevation data into GPX files (apart from the inaccurate SRTM dataset).

## License

See LICENSE file.
