# gridless-keynav

Keyboard Navigation on gridless feeds.

~~The written hotkeys are not through arrow keys but instead through vim-like hotkeys — j, k, h, l.~~

The hotkeys are now arrow keys.

That's just it.

Dependencies used: JQuery Library.

## Explanation ##

The feedbox here has no grid as the numbers of each row's respective columns are not symmetric to other rows.

So how do you determine the best box to to arrive on, if the column count on both the current and the next row are not equal to each other?

## The Solution ##

_Building the model version of the boxfeed_

Build the grid model of the boxfeed — it can now have a model of the feed with each of the box, being on their own respective column and rows depending on how they are shown.

While building the grid model it, then builds the — of which I just named as — "grid-weights".

You would see that there's a function named `ModellizeFeed()`. This function does the things said in hand, and in the end, builds an object containing: the grid-model — `model`; the grid-weigts — `weights`; and the current weight used among the grid-weights array — `currwaet`;

`currwaets` holds the index of the current weight used for navigation.

_Grid-weights_

The grid-weights represents the middle of imaginary boxes on the given boxfeed. How they are built is through the distance between, the center of the respective imaginary box to the left-side of the box. That is how the positions of these guys are acquired.

Lets say that the current weight is the 5th of the 50 weights. The boxfeed has a width of 500px. So the 5th segment is located at the 45px starting from the left-side of the box.

_\[Navigating Vertically\]_

When traversing to another row, the `currwaet` is accessed to get the current distance of that weight starting from the left-side. Then you subtract that distance of the current weight to the next row's each boxes' distances: left side's distance from the boxfeed's left; right side's distance from the boxfeed's left; and middle side's distance from the boxfeed's left. 

It then finds which of the next row's boxes is the most nearest to the current weight, by finding the boxes that has the lowest value. The box that will be chosen is to be the nearest one. 

_\[Navigating Horizontally\]_

When traversing left and right directions, what just happens is finding a new weight among the 50 grid-weigts, that are nearest to the arrived box — nearest through the distance of the next box's center to the grid-weight.

# conclusion #

This then leads up to some sense of consistency when navigating vertically in a gridless and unsymmetrical grid.





