/* eslint-disable */

import React from 'react';
import ElementList from '../components/ElementList';

export function getSelectValues(select) {
  const result = [];
  const options = select && select.options;
  if (options == null) {
    return [];
  }
  let opt;

  for (let i = 0; i < options.length; i++) {
    opt = options[i];

    if (opt.selected) {
      console.log('opt: ');
      console.log(opt);
      result.push(opt.value);
    }
  }
  return result;
}

export function isViewAllEnabled() {
  console.log(`is view enabled: ${document.getElementById('viewAll').checked}`);
  return document.getElementById('viewAll').checked;
}

export function isNotEmpty(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  if (text == null || text.trim().length == 0) {
    return false;
  }
  return true;
}

export function isEqual(value, other) {
  // Get the value type
  const type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

  // Compare the length of the length of the two items
  const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
  const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  const compare = function (item1, item2) {
    // Get the object type
    const itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    }

    // Otherwise, do a simple comparison
    else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false;
      } else if (item1 !== item2) return false;
    }
  };

  // Compare properties
  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;
}

export function getRules(rule) {
  const rules = [];
  if (rule.type == 'CompositeRule') {
    const subModIds = [];
    for (let i = 0; i < rule.rules.length; i++) {
      const sub = rule.rules[i];
      if (sub.type == 'CompositeRule') {
        rules.concat(getRules(sub));
      }
      if (sub.type == 'ModuleRule') {
        subModIds.push(sub.moduleGroupId);
      }
    }
    rules.push(<li key={`l-${rule.localId}`}>
      <ElementList key={rule.localId} id={rule.localId} ids={subModIds} rule={rule} />
    </li>);
  } else if (rule.type == 'ModuleRule') {
    const mods = [];
    mods.push(rule.moduleGroupId);
    rules.push(<li key={`l-${rule.localId}`}>
      <ElementList key={rule.localId} id={rule.localId} ids={mods} rule={rule} />
    </li>);
  }
  return rules;
}

export function getElementStructure(struct, lv) {
  const structures = [];
  for (const property in struct) {
    if (property.startsWith('phase') && struct[property] != null) {
      if (property.indexOf('phase1') >= 0
        || qs.allPhases == 'true') {
        const phase = struct[property];
        const options = [];
        for (let i = 0; i < phase.options.length; i++) {
          options.push(phase.options[i].moduleGroupId);
        }
        structures.push(<div key={property}>
          <ElementList key={`opt-${property}`} id={`opt-${property}`} ids={options} lv={lv} rule="{}" />
        </div>);
      }
    }
  }
  return (
    <div>
      {structures}
    </div>
  );
}

export const qs = (function (a) {
  if (a == '') return {};
  const b = {};
  for (let i = 0; i < a.length; ++i) {
    const p = a[i].split('=', 2);
    if (p.length == 1) b[p[0]] = '';
    else b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
  }
  return b;
}(window.location.search.substr(1).split('&')));

export function parseRuleData(rule) {
  let modules = [];
  let courses = [];
  const creditsRules = [];
  let anyCUR = null;
  let anyMR = null;
  let response;
  if (rule.rule != null) {
    response = parseRuleData(rule.rule);
    modules = modules.concat(response.modules);
    courses = courses.concat(response.courses);
    if (anyCUR == null) {
      anyCUR = response.anyCUR;
    }
    if (anyMR == null) {
      anyMR = response.anyMR;
    }
  } else if (rule.rules != null) {
    for (let i = 0; i < rule.rules.length; i++) {
      response = parseRuleData(rule.rules[i]);
      modules = modules.concat(response.modules);
      courses = courses.concat(response.courses);
      if (anyCUR == null) {
        anyCUR = response.anyCUR;
      }
      if (anyMR == null) {
        anyMR = response.anyMR;
      }
    }
  } else if (rule.type == 'ModuleRule') {
    modules.push(rule.moduleGroupId);
  } else if (rule.type == 'CourseUnitRule') {
    courses.push(rule.courseUnitGroupId);
  } else if (rule.type == 'AnyCourseUnitRule') {
    anyCUR = rule;
  } else if (rule.type == 'AnyModuleRule') {
    anyMR = rule;
  } else if (rule.type == 'CreditsRule') {
    creditsRules.push(rule);
  }
  return {
    modules, courses, anyCUR, anyMR, creditsRules
  };
}
