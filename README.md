# When-To-Charge-Carbon-Intensity-Forecast

This is a Scriptable Widget for IOS.

Even if you have green tariff like myself, you'll be aware the UK grid needs to generates CO2 to satisfy your demand when renewables are unavailable (even if your green tariff causes someone else to get a green unit some other time to compensate).

This widget aims to help you judge how to time-shift your use, and minimise that CO2 generation. That might help balance a greener grid, create more renewables demand and reduce demand for fossil sources.

It uses information from the https://www.carbonintensity.org.uk/ API site to display the carbon intensity forecast for electricity in your general postcode area (the API works off just the start of your postcode, up to the space e.g. RG10)

It also shows you the current carbon intensity, the minimum foreseen in the forecast and also the local generation mix (it varies a lot geographically - have a play with the website to see what I mean. Look at the code to understand the classification - but IIRC, red is fossil, yellow solar, blue hydro and wind, grey imports (like French nuclear), and I think I made nuclear green, as in this medium term context, I count it as such - alter the code if you don't like that).

The idea is, if you have an EV (or anything that intermittently sucks in lots of juice from the grid) - and are able to time your charged/use - you can use this to judge when you will cause least CO2 to be generated.

e.g. this weekend one day was windy, and by extending my 'low State-of-Charge comfort zone' (how long I was happy to have a low SoC at ~10%) by a day - I was able to reduce the CO2 generated in charging my car to a third of what it would have been.

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
