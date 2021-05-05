# When-To-Charge-Carbon-Intensity-Forecast

This is a Scriptable Widget for IOS.

It uses information from the https://www.carbonintensity.org.uk/ API site to display the carbon intensity forecast for electricity in your postcode (well, the start of it - just the first part - e.g. RG10)

It also shows you the current carbon intensity - and the minimum foreseen in the forecast.

The idea is, if you have an EV and aren't lucky enough to have solar power - and are able to time your charges e.g. this weekend one day was windy, and by extending my 'low State-of-Charge comfort zone' (how long I was happy to have a low SoC at ~10%) by a day - I was able to reduce the CO2 generated in charging my car to a third of what it would have been.

Hope it's useful.

1/ Install the Scriptable IOS App on your phone
2/ Create a new script (call it anything)
3/ Cut/paste the Raw of the javascript file here into the Scriptable - edit the postcode from RG10 to yours (**/Just the bit before the space though/**)
4/ Either:
    (i) On your iPhone's Homescreen press and hold on any empty space until the (+) appears in the top left;
    (ii) Or swipe left to right to add it to the Today View (click edit at the bottom to get the +)
5/ Create a Sciptable widget (swipe left/right to get the middle sized rectangle sized widget)
6/ Tap on widget/Edit widget/tap Script/select whatever you called the script in (2) above
7/ Tap the black space above or below the Run Script dialog - give it a second to run - then hit done

The widget is set to auto-refresh every three hours - to avoid server load. Just click on it to override.
