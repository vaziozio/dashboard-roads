am4core.ready(function() {

am4core.useTheme(am4themes_animated);

    // Person Infographic #person-infographic
    var iconPath = "M53.5,476c0,14,6.833,21,20.5,21s20.5-7,20.5-21V287h21v189c0,14,6.834,21,20.5,21 c13.667,0,20.5-7,20.5-21V154h10v116c0,7.334,2.5,12.667,7.5,16s10.167,3.333,15.5,0s8-8.667,8-16V145c0-13.334-4.5-23.667-13.5-31 s-21.5-11-37.5-11h-82c-15.333,0-27.833,3.333-37.5,10s-14.5,17-14.5,31v133c0,6,2.667,10.333,8,13s10.5,2.667,15.5,0s7.5-7,7.5-13 V154h10V476 M61.5,42.5c0,11.667,4.167,21.667,12.5,30S92.333,85,104,85s21.667-4.167,30-12.5S146.5,54,146.5,42 c0-11.335-4.167-21.168-12.5-29.5C125.667,4.167,115.667,0,104,0S82.333,4.167,74,12.5S61.5,30.833,61.5,42.5z"

    var chart = am4core.create("person-infographic", am4charts.SlicedChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    chart.data = [{'name': '2007', 'value': 419990}, {'name': '2008', 'value': 454008}, {'name': '2009', 'value': 504916}, {'name': '2010', 'value': 595234}, {'name': '2011', 'value': 628193}, {'name': '2012', 'value': 614616}, {'name': '2013(até Jun)', 'value': 298926}];

    var series = chart.series.push(new am4charts.PictorialStackedSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "name";
    series.alignLabels = true;

    series.maskSprite.path = iconPath;
    series.ticks.template.locationX = 1;
    series.ticks.template.locationY = 0.5;

    series.labelsContainer.width = 200;

    chart.legend = new am4charts.Legend();
    chart.legend.position = "left";
    chart.legend.valign = "bottom";

// Car chart

    var chart = am4core.create("vehicle-chart", am4charts.XYChart);
    chart.padding(40, 40, 40, 40);

    chart.numberFormatter.bigNumberPrefixes = [
      { "number": 1e+3, "suffix": "K" },
      { "number": 1e+6, "suffix": "M" },
      { "number": 1e+9, "suffix": "B" }
    ];

    var label = chart.plotContainer.createChild(am4core.Label);
    label.x = am4core.percent(97);
    label.y = am4core.percent(95);
    label.horizontalCenter = "right";
    label.verticalCenter = "middle";
    label.dx = -15;
    label.fontSize = 50;

    var playButton = chart.plotContainer.createChild(am4core.PlayButton);
    playButton.x = am4core.percent(97);
    playButton.y = am4core.percent(95);
    playButton.dy = -2;
    playButton.verticalCenter = "middle";
    playButton.events.on("toggled", function(event) {
      if (event.target.isActive) {
        play();
      }
      else {
        stop();
      }
    })

    var stepDuration = 4000;

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "network";
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.rangeChangeEasing = am4core.ease.linear;
    valueAxis.rangeChangeDuration = stepDuration;
    valueAxis.extraMax = 0.1;

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "network";
    series.dataFields.valueX = "MAU";
    series.tooltipText = "{valueX.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.interpolationDuration = stepDuration;
    series.interpolationEasing = am4core.ease.linear;

    var labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = "right";
    labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    labelBullet.label.textAlign = "end";
    labelBullet.label.dx = -10;

    chart.zoomOutButton.disabled = true;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function(fill, target){
      return chart.colors.getIndex(target.dataItem.index);
    });

    var year = 2007;
    label.text = year.toString();

    var interval;

    function play() {
      interval = setInterval(function(){
        nextYear();
      }, stepDuration)
      nextYear();
    }

    function stop() {
      if (interval) {
        clearInterval(interval);
      }
    }

    function nextYear() {
      year++

      if (year > 2013) {
        year = 2007;
      }

      var newData = allData[year];
      var itemsWithNonZero = 0;
      for (var i = 0; i < chart.data.length; i++) {
        chart.data[i].MAU = newData[i].MAU;
        if (chart.data[i].MAU > 0) {
          itemsWithNonZero++;
        }
      }

      if (year == 2007) {
        series.interpolationDuration = stepDuration / 4;
        valueAxis.rangeChangeDuration = stepDuration / 4;
      }
      else {
        series.interpolationDuration = stepDuration;
        valueAxis.rangeChangeDuration = stepDuration;
      }


      chart.invalidateRawData();
      label.text = year.toString();

      categoryAxis.zoom({ start: 0, end: itemsWithNonZero / categoryAxis.dataItems.length });
    }


    categoryAxis.sortBySeries = series;

    var allData = {'2007': [{'network': 'MG', 'MAU': 32715.0},
  {'network': 'SC', 'MAU': 26579.0},
  {'network': 'PR', 'MAU': 11913.0},
  {'network': 'RJ', 'MAU': 21097.0},
  {'network': 'RS', 'MAU': 18447.0},
  {'network': 'SP', 'MAU': 19476.0},
  {'network': 'BA', 'MAU': 11790.0},
  {'network': 'ES', 'MAU': 11774.0},
  {'network': 'GO', 'MAU': 9050.0},
  {'network': 'PE', 'MAU': 8633.0},
  {'network': 'PA', 'MAU': 5996.0},
  {'network': 'RN', 'MAU': 5938.0}],
 '2008': [{'network': 'MG', 'MAU': 35961.0},
  {'network': 'SC', 'MAU': 28182.0},
  {'network': 'PR', 'MAU': 16499.0},
  {'network': 'RJ', 'MAU': 24324.0},
  {'network': 'RS', 'MAU': 19131.0},
  {'network': 'SP', 'MAU': 21278.0},
  {'network': 'BA', 'MAU': 12799.0},
  {'network': 'ES', 'MAU': 12008.0},
  {'network': 'GO', 'MAU': 10512.0},
  {'network': 'PE', 'MAU': 9559.0},
  {'network': 'PA', 'MAU': 6351.0},
  {'network': 'RN', 'MAU': 5500.0},
  {'network': 'PB', 'MAU': 5684.0},
  {'network': 'MT', 'MAU': 5095.0}],
 '2009': [{'network': 'MG', 'MAU': 40286.0},
  {'network': 'SC', 'MAU': 32370.0},
  {'network': 'PR', 'MAU': 26751.0},
  {'network': 'RJ', 'MAU': 25614.0},
  {'network': 'RS', 'MAU': 19991.0},
  {'network': 'SP', 'MAU': 21636.0},
  {'network': 'BA', 'MAU': 13749.0},
  {'network': 'ES', 'MAU': 12739.0},
  {'network': 'GO', 'MAU': 11817.0},
  {'network': 'PE', 'MAU': 10841.0},
  {'network': 'PA', 'MAU': 6722.0},
  {'network': 'RN', 'MAU': 6332.0},
  {'network': 'PB', 'MAU': 6178.0},
  {'network': 'MT', 'MAU': 5889.0},
  {'network': 'CE', 'MAU': 5079.0},
  {'network': 'RO', 'MAU': 5604.0}],
 '2010': [{'network': 'MG', 'MAU': 44593.0},
  {'network': 'SC', 'MAU': 35411.0},
  {'network': 'PR', 'MAU': 36746.0},
  {'network': 'RJ', 'MAU': 29891.0},
  {'network': 'RS', 'MAU': 24946.0},
  {'network': 'SP', 'MAU': 23105.0},
  {'network': 'BA', 'MAU': 16118.0},
  {'network': 'ES', 'MAU': 15096.0},
  {'network': 'GO', 'MAU': 13603.0},
  {'network': 'PE', 'MAU': 13454.0},
  {'network': 'PA', 'MAU': 8500.0},
  {'network': 'RN', 'MAU': 7505.0},
  {'network': 'PB', 'MAU': 6772.0},
  {'network': 'MT', 'MAU': 6182.0},
  {'network': 'CE', 'MAU': 6728.0},
  {'network': 'RO', 'MAU': 6152.0},
  {'network': 'MS', 'MAU': 5544.0}],
 '2011': [{'network': 'MG', 'MAU': 44926.0},
  {'network': 'SC', 'MAU': 35364.0},
  {'network': 'PR', 'MAU': 39333.0},
  {'network': 'RJ', 'MAU': 33231.0},
  {'network': 'RS', 'MAU': 26232.0},
  {'network': 'SP', 'MAU': 24491.0},
  {'network': 'BA', 'MAU': 17921.0},
  {'network': 'ES', 'MAU': 15182.0},
  {'network': 'GO', 'MAU': 13717.0},
  {'network': 'PE', 'MAU': 15022.0},
  {'network': 'PA', 'MAU': 8901.0},
  {'network': 'RN', 'MAU': 7755.0},
  {'network': 'PB', 'MAU': 6937.0},
  {'network': 'MT', 'MAU': 6421.0},
  {'network': 'CE', 'MAU': 6818.0},
  {'network': 'RO', 'MAU': 6993.0},
  {'network': 'MS', 'MAU': 5590.0},
  {'network': 'MA', 'MAU': 5448.0}],
 '2012': [{'network': 'MG', 'MAU': 44267.0},
  {'network': 'SC', 'MAU': 33782.0},
  {'network': 'PR', 'MAU': 36995.0},
  {'network': 'RJ', 'MAU': 32120.0},
  {'network': 'RS', 'MAU': 25058.0},
  {'network': 'SP', 'MAU': 24754.0},
  {'network': 'BA', 'MAU': 17708.0},
  {'network': 'ES', 'MAU': 14821.0},
  {'network': 'GO', 'MAU': 13171.0},
  {'network': 'PE', 'MAU': 13484.0},
  {'network': 'PA', 'MAU': 7425.0},
  {'network': 'RN', 'MAU': 7375.0},
  {'network': 'PB', 'MAU': 7192.0},
  {'network': 'MT', 'MAU': 7095.0},
  {'network': 'CE', 'MAU': 6870.0},
  {'network': 'RO', 'MAU': 6554.0},
  {'network': 'MS', 'MAU': 5268.0},
  {'network': 'MA', 'MAU': 5501.0}],
 '2013': [{'network': 'MG', 'MAU': 20910.0},
  {'network': 'SC', 'MAU': 16813.0},
  {'network': 'PR', 'MAU': 17285.0},
  {'network': 'RJ', 'MAU': 14486.0},
  {'network': 'RS', 'MAU': 13032.0},
  {'network': 'SP', 'MAU': 11403.0},
  {'network': 'BA', 'MAU': 8422.0},
  {'network': 'ES', 'MAU': 7717.0},
  {'network': 'GO', 'MAU': 6632.0},
  {'network': 'PE', 'MAU': 6632.0}]}

  chart.data = JSON.parse(JSON.stringify(allData[year]));
    categoryAxis.zoom({ start: 0, end: 1 / chart.data.length });

    series.events.on("inited", function() {
      setTimeout(function() {
        playButton.isActive = true; // this starts interval
      }, 2000)
    })

});