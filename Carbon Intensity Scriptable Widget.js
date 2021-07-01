// Carbon Intensity Widget
// Version 0.1
// Code fragments pinched from many sources and mashed together in utter ignorance of good javascript style
// May be taken and done with as you please
// Uses data from the Official Carbon Intensity API for Great Britain developed by National Grid.
// You can find out more about it at carbonintensity.org.uk.
// Be sensitive to server loading if you make adjustments - this widget requests to be refreshed no more frequently than every 3 hours

// USER DEFINITIONS
const lineWeight = 2
const vertLineWeight = .5

// Pull the widget's postcode from the JSON encoded parameter field (set when you edit the widget) - or use defaults
// Editing the defaults is easier, otherwise type this into the field: { "postcode" : "firstbitonly" }
const widgetParams = JSON.parse((args.widgetParameter != null) ? args.widgetParameter : '{ "postcode" : "RG10" , "accentColor" : "#33cc33" }')

const widgetHeight = 338
const widgetWidth = 720
const lhsMargin = 25

const postcode = widgetParams.postcode
const accentColor1 = new Color(widgetParams.accentColor, 1)
const accentColor2 = Color.lightGray()
let halfHoursToShow = 96
const spaceBetweenHalfHours = 7         // space in pixels between the half-hours

const titleFontSize = 20
const titleFont = Font.systemFont(titleFontSize)
const titlePos = new Point(25, 15)

const postcodeFontSize = 36
const postcodeFont = Font.semiboldSystemFont(postcodeFontSize)
const postcodeCoords = new Point(25, 38)

const gCO2FontSize = 22
const gCO2Font = Font.systemFont(gCO2FontSize)

const hourFontSize = 22
const hourFont = Font.systemFont(hourFontSize)

// Make the UTC date-time field
let dateTime = new Date()
let formattedUTCDateTime = dateTime.toISOString()

// Compose the URL for the 48hr forecast and retrieve the JSON format data
let url = "https://api.carbonintensity.org.uk/regional/intensity/"+formattedUTCDateTime+"/fw48h/postcode/"+postcode;
url = encodeURI(url)
let req = new Request(url)
let json = await req.loadJSON()
let data = json.data

// Similarly - grab the 'now' data
url = "https://api.carbonintensity.org.uk/regional/postcode/"+postcode;
url = encodeURI(url)
req = new Request(url)
json = await req.loadJSON()
let currentData = json.data[0]
let gCO2Now = currentData.data[0].intensity.forecast

// Supported widget size: medium
let drawContext = new DrawContext();
drawContext.size = new Size(widgetWidth, widgetHeight)
drawContext.opaque = false

// Create widget
let widget = new ListWidget();
widget.refreshAfterDate = new Date(Date.now() + 3*60*60*1000)
widget.setPadding(0, 0, 0, 0);

// Graph title
let formattedTime = dateTime.toLocaleTimeString()
drawTextP(" Forecast grams CO2/kWh (" + formattedTime + ")", titlePos, Color.white(), titleFont);
                                                                                 
// Find min, max
let min, max;
if (data.data.length < halfHoursToShow) halfHoursToShow = data.data.length     // Fix for when API doesn't return 2 days of data

for(let i = 0; i < halfHoursToShow; i++) {
  let aux = data.data[i].intensity.forecast
  min = (aux < min || min == undefined ? aux : min)
  max = (aux > max || max == undefined ? aux : max)
}

// Location and Min/Max
drawContext.setTextAlignedLeft()
drawTextP(capitalize(postcode) + ": " + gCO2Now + "g (now) vs " + min + "g (best)", postcodeCoords, accentColor1, postcodeFont);

const graphLow = 280
const graphHeight = 160

// Loop through the data and draw the 48hrs of graph - 96 x 1/2hrs
drawContext.setTextAlignedCenter()
for (let i = 0; i <= (halfHoursToShow-1); i++) {

  let hour = (new Date(data.data[i].from)).getHours() + (new Date(data.data[i].from)).getMinutes()/60
  let gCO2 = data.data[i].intensity.forecast // It's actually the forecast for the whole 1/2hr - but I will treat as the forecast for this time
  let y = gCO2 / max

  if (i < (halfHoursToShow-1)) {
    let nextGCO2 = data.data[i + 1].intensity.forecast
    let nextY = nextGCO2 / max
    let point1 = new Point(spaceBetweenHalfHours * i     + lhsMargin, graphLow - (graphHeight * y))
    let point2 = new Point(spaceBetweenHalfHours * (i+1) + lhsMargin, graphLow - (graphHeight * nextY))
    drawLine(point1, point2, lineWeight, accentColor1)
  }

  let red = 0, green = 0, grey = 0, blue = 0, yellow = 0
  for (let g = 0; g <= 8; g++) {
    if (data.data[i].generationmix[g].fuel == "gas") { red += data.data[i].generationmix[g].perc}
    if (data.data[i].generationmix[g].fuel == "coal") { red += data.data[i].generationmix[g].perc}
    if (data.data[i].generationmix[g].fuel == "solar") { yellow += data.data[i].generationmix[g].perc}
    if (data.data[i].generationmix[g].fuel == "wind") { blue += data.data[i].generationmix[g].perc}
    if (data.data[i].generationmix[g].fuel == "hydro") { blue += data.data[i].generationmix[g].perc}
    if (data.data[i].generationmix[g].fuel == "nuclear") { green += data.data[i].generationmix[g].perc}
    if (data.data[i].generationmix[g].fuel == "other") { green += data.data[i].generationmix[g].perc}
    if (data.data[i].generationmix[g].fuel == "imports") { grey += data.data[i].generationmix[g].perc}
    if (data.data[i].generationmix[g].fuel == "biomass") { green += data.data[i].generationmix[g].perc}
  }

  let bottom = graphLow  
  let top =  graphLow - (graphHeight * y * green / 100)
  bottom = drawGenMix(i, bottom, bottom - (graphHeight * y * green / 100), Color.green())
  bottom = drawGenMix(i, bottom, bottom - (graphHeight * y * yellow / 100), Color.yellow())
  bottom = drawGenMix(i, bottom, bottom - (graphHeight * y * blue / 100), Color.blue())
  bottom = drawGenMix(i, bottom, bottom - (graphHeight * y * grey / 100), Color.gray())
  bottom = drawGenMix(i, bottom, bottom - (graphHeight * y * red / 100), Color.red())

  if (hour % 3 == 0) {  
    // Vertical Line
    let point1 = new Point(spaceBetweenHalfHours * i + lhsMargin, graphLow - (graphHeight * y))
    let point2 = new Point(spaceBetweenHalfHours * i + lhsMargin, graphLow)
    drawLine(point1, point2, vertLineWeight* 2, accentColor2)
    // Text for hour number under that
    let hourColor = Color.white()
    if (hour == 0) {
      hourColor = Color.yellow()  //accentColor2
    }
    let hourRect = new Rect(spaceBetweenHalfHours * i + 10, graphLow + 10, lhsMargin, hourFontSize + 1)
    drawTextR(hour, hourRect, hourColor, hourFont)
    // Text for gCO2 number on top
    let gCO2Color = Color.purple()
    if (data.data[i].intensity.index == "very low") gCO2Color = Color.white()
    if (data.data[i].intensity.index == "low") gCO2Color = Color.green()
    if (data.data[i].intensity.index == "moderate") gCO2Color = Color.yellow()
    if (data.data[i].intensity.index == "high") gCO2Color = Color.red()
    if (data.data[i].intensity.index == "very high") gCO2Color = Color.purple()
    let gCO2Rect = new Rect(spaceBetweenHalfHours * i + 0, (graphLow - 40) - (graphHeight * y), 60, gCO2FontSize + 1)
    drawTextR(roundIfNeeded(gCO2), gCO2Rect, gCO2Color, gCO2Font)
  }

}

// Background
widget.backgroundColor = new Color("#444444", 1)

// Present
widget.backgroundImage = (drawContext.getImage())
widget.presentMedium()

// FUNCTIONS
function roundIfNeeded(n) {
  if (Math.floor(n / 1000) > 0) {
    return (Math.round(n / 100) / 10) + "k"
  }
  return n
}

function capitalize(string) {
  return string.replace(/\b\w/g, l=>l.toUpperCase())
}

function drawTextP(text, point, color, font) {
  drawContext.setFont(font)
  drawContext.setTextColor(color)
  drawContext.drawText(new String(text).toString(), point)
}

function drawTextR(text, rect, color, font) {
  drawContext.setFont(font)
  drawContext.setTextColor(color)
  drawContext.drawTextInRect(new String(text).toString(), rect)
}

function drawLine(point1, point2, width, color){
  const path = new Path()
  path.move(point1)
  path.addLine(point2)
  drawContext.addPath(path)
  drawContext.setStrokeColor(color)
  drawContext.setLineWidth(width)
  drawContext.strokePath()
}

function drawGenMix(i, bottom, top, colour){
  let point1 = new Point(spaceBetweenHalfHours * i + lhsMargin, top)
  let point2 = new Point(spaceBetweenHalfHours * i + lhsMargin, bottom)
  drawLine(point1, point2, vertLineWeight * 3, colour)
  return top
}

Script.complete()
