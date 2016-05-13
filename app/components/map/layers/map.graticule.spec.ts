import {provide} from '@angular/core';
import {
  TestComponentBuilder
} from '@angular/compiler/testing';

import {
  beforeEach,
  ddescribe,
  xdescribe,
  describe,
  expect,
  iit,
  inject,
  beforeEachProviders,
  setBaseTestProviders,
  it,
  xit
} from '@angular/core/testing';

import {AsyncTestCompleter} from '@angular/core/testing/async_test_completer';

import {
    TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
    TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
} from '@angular/platform-browser-dynamic/testing/browser';

import {GraticuleLayerComponent} from './map.graticule';
import {GRATICULE_DEFAULTS} from './layers.defaults';
import {GraticuleLayer} from '../../../model/map.model';
import {rgb2hex} from '../../../services/utils';

declare var d3: any;

describe('Test for graticule layer', () => {
  setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
    [TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS]);
  /*setBaseTestProviders(TEST_BROWSER_STATIC_PLATFORM_PROVIDERS,
    [TEST_BROWSER_STATIC_APPLICATION_PROVIDERS, AsyncTestCompleter]);*/

  function checkGraticuleStructure(nativeElement, borderStroke:string,
    borderStrokeWidth:string, backgroundFill:string, linesStroke:string,
    linesStrokeWidth:string, linesStrokeOpacity:string) {
    // Testing defs element
    var defsElement = nativeElement.querySelector('defs');
    expect(defsElement).not.null;
    expect(defsElement.childNodes).not.null;
    expect(defsElement.childNodes.length).toEqual(1);
    var pathElement = defsElement.childNodes[0]
    expect(pathElement.nodeName.toLowerCase()).toEqual('path');
    expect(pathElement.id).toEqual('sphere');
    expect(pathElement.path).not.null;
    expect(pathElement.path).not.toEqual('');

    // Testing use elements
    var useElements = nativeElement.querySelectorAll('use');
    expect(useElements).not.null;
    expect(useElements.length).toEqual(2);

    var firstUseElement = useElements[0];
    var firstUseElementStyles = firstUseElement.style;
    expect(rgb2hex(firstUseElementStyles.stroke)).toEqual(borderStroke);
    expect(firstUseElementStyles['stroke-width']).toEqual(borderStrokeWidth);
    expect(firstUseElementStyles.fill).toEqual('none');
    expect(firstUseElement.getAttribute('href')).toEqual('#sphere');

    var secondUseElement = useElements[1];
    var secondUseElementStyles = secondUseElement.style;
    expect(rgb2hex(secondUseElementStyles.fill)).toEqual(backgroundFill);
    expect(secondUseElement.getAttribute('href')).toEqual('#sphere');

    // Testing path elements
    var pathElement = [].find.call(nativeElement.childNodes, child => child.nodeName.toLowerCase() === 'path');
    expect(pathElement.id).toEqual('layer.id');
    expect(pathElement.d).not.null;
    expect(pathElement.d).not.toEqual('');
    var pathElementStyles = pathElement.style;
    expect(pathElementStyles.fill).toEqual('none');
    expect(rgb2hex(pathElementStyles.stroke)).toEqual(linesStroke);
    expect(pathElementStyles['stroke-width']).toEqual(linesStrokeWidth);
    expect(pathElementStyles['stroke-opacity']).toEqual(linesStrokeOpacity);
  }
    
  it('should define default values for properties',
    inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder) => {
      tcb.createAsync(GraticuleLayerComponent).then((componentFixture) => {
        let componentInstance = componentFixture.componentInstance;
        componentInstance.layer = { type: 'graticule' };
        componentInstance.path = d3.geo.path();

        componentFixture.detectChanges();

        let nativeElement = componentFixture.nativeElement;
        checkGraticuleStructure(nativeElement, GRATICULE_DEFAULTS.BORDER_STROKE,
          GRATICULE_DEFAULTS.BORDER_STROKE_WIDTH, GRATICULE_DEFAULTS.BACKGROUND_FILL,
          GRATICULE_DEFAULTS.LINES_STROKE, GRATICULE_DEFAULTS.LINES_STROKE_WIDTH,
          GRATICULE_DEFAULTS.LINES_STROKE_OPACITY);
      });
    }));

  it('should use custom values for properties',
    inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TestComponentBuilder) => {
      tcb.createAsync(GraticuleLayerComponent).then((componentFixture) => {
        let componentInstance = componentFixture.componentInstance;
        console.log(componentInstance)
        componentInstance.layer = <GraticuleLayer>{
          type: 'graticule',
          styles: {
            border: {
              stroke: '#000000',
              strokeWidth: '3px'
            },
            background: {
              fill: '#a4bac7'
            },
            lines: {
              stroke: '#777777',
              strokeWidth: '0.5px',
              strokeOpacity: '0.5'
            }
          }
        };
        componentInstance.path = d3.geo.path();

        componentFixture.detectChanges();

        let nativeElement = componentFixture.nativeElement;
        checkGraticuleStructure(nativeElement, '#000000',
          '3px', '#a4bac7', '#777777', '0.5px', '0.5');
      });
    }));
});